import { spawn } from "node:child_process";
import { once } from "node:events";
import { writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import { AppError, pathJoin } from "@compas/stdlib";
import { writeFileChecked } from "../src/shared/fs.js";

/**
 *
 * @param {string} suite
 * @returns {(subdir: string) => string}
 */
export function testDirectory(suite) {
  const baseDir = pathJoin(".cache/test", suite);

  return (subdir) => {
    const dir = pathJoin(baseDir, subdir);

    rmSync(dir, { force: true, recursive: true });
    mkdirSync(dir, { recursive: true });

    return dir;
  };
}

/**
 * @typedef {Omit<import("child_process").SpawnOptions, "cwd"> & {
 *   cwd: string,
 * }} SpawnOptions
 */

/**
 * Util to test CLI execution
 *
 * Launches the CLI, and provides utils to assert on output, debug information and
 * directory state.
 *
 * Starts launching the CLI when `.launch()` is called.
 */
export class TestCompas {
  static DEFAULT_POLL_INTERVAL = 2;

  /**
   * @param {SpawnOptions} spawnOptions
   * @param {{
   *   args?: string[],
   * }} options
   */
  constructor(spawnOptions, { args } = {}) {
    /**
     * @type {SpawnOptions}
     */
    this.spawnOptions = spawnOptions;

    /**
     * @type {string[]}
     */
    this.args = args ?? ["--debug"];

    /**
     * @type {import("child_process").ChildProcess|undefined}
     */
    this.cp = undefined;

    /**
     * @type {"IDLE"|"STARTED"|"STOPPED"}
     */
    this.cpState = "IDLE";

    /**
     * @type {string}
     */
    this.stdout = "";

    /**
     * @type {string}
     */
    this.stderr = "";

    /**
     * @type {string|undefined}
     */
    this.debugFilePath = undefined;

    /**
     * @type {{
     *   debugFileLength: number,
     *   stdoutLength: number,
     *   stderrLength: number,
     * }}
     */
    this.outputState = {
      debugFileLength: 0,
      stdoutLength: this.stdout.length,
      stderrLength: this.stderr.length,
    };

    /**
     *
     * @type {TestCompas}
     * @private
     */
    const _self = this;

    /**
     * @type {() => void}}
     */
    this.exitHandler = () => {
      if (_self.cp && _self.cpState === "STARTED") {
        _self.cp.kill("SIGTERM");
      }
    };
  }

  async writeFile(relativePath, contents) {
    const fullPath = pathJoin(this.spawnOptions.cwd, relativePath);

    await this.recalculateOutputState();
    await writeFileChecked(fullPath, contents);
  }

  async writeInput(message) {
    if (this.cpState !== "STARTED") {
      throw AppError.serverError({
        message: "Test process is not started",
      });
    }

    // Wait till actions are alive
    await this.waitForOutput("stdout", "Started file watchers", {
      ignoreOffset: true,
    });

    await this.recalculateOutputState();
    if (this.cp?.stdin) {
      this.cp.stdin.write(message);
    }
  }

  withPackageJson(contents) {
    mkdirSync(this.spawnOptions.cwd, { recursive: true });
    writeFileSync(pathJoin(this.spawnOptions.cwd, "package.json"), contents);

    return this;
  }

  withConfig(contents) {
    mkdirSync(pathJoin(this.spawnOptions.cwd, "config"), { recursive: true });
    writeFileSync(
      pathJoin(this.spawnOptions.cwd, "config/compas.json"),
      contents,
    );

    return this;
  }

  launch() {
    if (this.cpState === "STARTED") {
      throw AppError.serverError({
        message: "Test process is still active",
      });
    }

    this.cp = spawn(
      `node`,
      [
        pathJoin(process.cwd(), "./packages/compas/src/cli/bin.js"),
        ...this.args,
      ],
      {
        ...this.spawnOptions,
        stdio: ["pipe", "pipe", "pipe"],
        env: {
          ...(this.spawnOptions.env ?? {
            ...process.env,
            CI: "false",
            APP_NAME: undefined,
            _COMPAS_SKIP_PACKAGE_MANAGER: "true",
            _COMPAS_SKIP_COMMIT_SIGN: "true",
          }),
        },
      },
    );

    this.cpState = "STARTED";

    process.once("exit", this.exitHandler);

    const _self = this;

    if (this.cp?.stdout) {
      this.cp.stdout.on("data", (chunk) => {
        _self.stdout += chunk.toString();
      });
    }

    if (this.cp?.stderr) {
      this.cp.stderr.on("data", (chunk) => {
        _self.stderr += chunk.toString();
      });
    }

    this.cp.once("exit", () => {
      _self.cpState = "STOPPED";
      process.removeListener("exit", _self.exitHandler);
    });

    return this;
  }

  async tryLocateDebugFile() {
    if (this.debugFilePath) {
      return;
    }

    const cacheDir = pathJoin(this.spawnOptions.cwd, ".cache/compas");

    if (existsSync(cacheDir)) {
      const files = await readdir(cacheDir);
      const debugFile = files.find((it) => it.startsWith("debug-"));

      if (debugFile) {
        this.debugFilePath = pathJoin(cacheDir, debugFile);
      }
    }
  }

  async recalculateOutputState() {
    await this.tryLocateDebugFile();

    const debugFileLength = this.debugFilePath
      ? (await readFile(this.debugFilePath, "utf-8")).length
      : 0;

    this.outputState = {
      debugFileLength,
      stdoutLength: this.stdout.length,
      stderrLength: this.stderr.length,
    };
  }

  async waitForExit() {
    await this.recalculateOutputState();

    if (this.cpState === "IDLE") {
      throw AppError.serverError({
        message: "Test process is not started",
      });
    } else if (this.cpState === "STOPPED") {
      return;
    }

    if (this.cp) {
      await once(this.cp, "exit");
    }
  }

  async exit() {
    await this.recalculateOutputState();

    if (this.cpState === "IDLE") {
      throw AppError.serverError({
        message: "Test process is not started",
      });
    } else if (this.cpState === "STOPPED") {
      return;
    }

    if (this.cp) {
      const p = once(this.cp, "exit");

      this.cp.kill("SIGTERM");

      await p;
    }
  }

  /**
   * @param {"stdout"|"stderr"|"debug"} type
   * @param {string} message
   * @param {{
   *   ignoreOffset?: boolean
   * }} [options]
   * @returns {Promise<void>}
   */
  async waitForOutput(type, message, { ignoreOffset } = {}) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (type === "debug") {
        await this.tryLocateDebugFile();

        if (this.debugFilePath) {
          const contents = await readFile(this.debugFilePath, "utf-8");

          if (
            contents.includes(
              message,
              ignoreOffset ? 0 : this.outputState.debugFileLength,
            )
          ) {
            return;
          }
        }
      } else if (type === "stdout") {
        if (
          this.stdout.includes(
            message,
            ignoreOffset ? 0 : this.outputState.stdoutLength,
          )
        ) {
          return;
        }
      } else if (type === "stderr") {
        if (
          this.stderr.includes(
            message,
            ignoreOffset ? 0 : this.outputState.stderrLength,
          )
        ) {
          return;
        }
      }
      await setTimeout(TestCompas.DEFAULT_POLL_INTERVAL);
    }
  }
}
