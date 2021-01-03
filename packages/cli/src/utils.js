import { spawn as cpSpawn } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import { exec, pathJoin, spawn } from "@compas/stdlib";
import chokidar from "chokidar";
import treeKill from "tree-kill";

/**
 * Load scripts directory and package.json scripts
 * @returns {ScriptCollection}
 */
export function collectScripts() {
  const result = {};

  const userDir = pathJoin(process.cwd(), "scripts");
  if (existsSync(userDir)) {
    for (const item of readdirSync(userDir)) {
      if (!item.endsWith(".js")) {
        continue;
      }

      const name = item.split(".")[0];

      result[name] = {
        type: "user",
        name,
        path: pathJoin(userDir, item),
      };
    }
  }

  const pkgJsonPath = pathJoin(process.cwd(), "package.json");
  if (existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
    for (const name of Object.keys(pkgJson.scripts || {})) {
      result[name] = {
        type: "package",
        name,
        script: pkgJson.scripts[name],
      };
    }
  }

  return result;
}

/**
 * Not so fool proof way of returning the accepted cli arguments of Node.js and v8
 * @returns {Promise<string[]>}
 */
export async function collectNodeArgs() {
  const [{ stdout: nodeStdout }, { stdout: v8Stdout }] = await Promise.all([
    exec(`node --help`),
    exec(`node --v8-options`),
  ]);

  return `${nodeStdout}\n${v8Stdout}`
    .split("\n")
    .filter((it) => it.trim() && it.length > 2)
    .map((it) => it.trim())
    .filter((it) => it.startsWith("--"))
    .map((it) => {
      return it.split(" ")[0].replace(/[=\\.]+/g, "");
    })
    .filter((it) => it.length > 2);
}

/**
 * @param {*} [options]
 * @returns {CliWatchOptions}
 */
export function watchOptionsWithDefaults(options) {
  /** @type {string[]} } */
  const extensions = options?.extensions ?? ["js", "json", "mjs", "cjs"];
  /** @type {string[]} } */
  const ignoredPatterns = options?.ignoredPatterns ?? ["__fixtures__"];
  /** @type {boolean} */
  const disable = options?.disable ?? false;

  if (!Array.isArray(extensions)) {
    throw new TypeError(
      `Expected cliWatchOptions.extensions to be an array. Found ${extensions}`,
    );
  }

  if (!Array.isArray(ignoredPatterns)) {
    throw new TypeError(
      `Expected cliWatchOptions.ignoredPatterns to be an array. Found ${ignoredPatterns}`,
    );
  }

  for (let i = 0; i < extensions.length; ++i) {
    // Remove '.' from extension if specified
    if (extensions[i].startsWith(".")) {
      extensions[i] = extensions[i].substring(1);
    }
  }

  return {
    disable,
    extensions,
    ignoredPatterns,
  };
}

/**
 * Compiles an chokidar ignore array for the specified options
 * @param {CliWatchOptions} options
 * @return {function(string): boolean}
 */
export function watchOptionsToIgnoredArray(options) {
  // Compiled patterns contains extension filter and ignores dotfiles and node_modules
  const patterns = [
    RegExp(`\\.(?!${options.extensions.join("|")})[a-z]{1,8}$`),
    /(^|[/\\])\../,
    /node_modules/,
  ];

  for (const pattern of options.ignoredPatterns) {
    if (pattern instanceof RegExp) {
      patterns.push(pattern);
    } else if (typeof pattern === "string") {
      patterns.push(RegExp(pattern));
    } else {
      throw new TypeError(
        `cliWatchOptions.ignoredPatterns accepts only string and RegExp. Found ${pattern}`,
      );
    }
  }

  const cwd = process.cwd();

  return (path) => {
    if (path.startsWith(cwd)) {
      path = path.substring(cwd.length);
    }

    for (const pattern of patterns) {
      if (pattern.test(path)) {
        return true;
      }
    }

    return false;
  };
}

/**
 * @param logger
 * @param verbose
 * @param watch
 * @param command
 * @param commandArgs
 * @param {CliWatchOptions} watchOptions
 */
export async function executeCommand(
  logger,
  verbose,
  watch,
  command,
  commandArgs,
  watchOptions,
) {
  if (verbose) {
    logger.info({
      msg: "Executing command",
      verbose,
      watch,
      command,
      commandArgs,
    });
  }

  if (!watch) {
    // Easy mode
    return spawn(command, commandArgs);
  }

  // May supply empty watchOptions so all defaults again
  const ignored = watchOptionsToIgnoredArray(
    watchOptionsWithDefaults(watchOptions),
  );

  let timeout = undefined;
  let instance = undefined;
  let instanceKilled = false;

  const watcher = chokidar.watch(".", {
    persistent: true,
    ignorePermissionErrors: true,
    ignored,
    cwd: process.cwd(),
  });

  watcher.on("change", (path) => {
    if (verbose) {
      logger.info(`Restarted because of ${path}`);
    }

    debounceRestart();
  });

  watcher.on("ready", () => {
    if (verbose) {
      logger.info({
        watched: watcher.getWatched(),
      });
    }

    start();
    prepareStdin(debounceRestart);
  });

  function exitListener(code, signal) {
    // Print normal exit behaviour or if verbose is requested.
    if (!instanceKilled || verbose) {
      logger.info({
        message: "Process exited",
        code: code ?? 0,
        signal,
      });
    }

    // We don't need to kill this instance, and just let it be garbage collected.
    instance = undefined;
  }

  function start() {
    instance = cpSpawn(command, commandArgs, {
      stdio: "inherit",
    });

    instanceKilled = false;
    instance.once("exit", exitListener);
  }

  function killAndStart() {
    if (instance && !instanceKilled) {
      instanceKilled = true;
      instance.removeListener("exit", exitListener);

      // Needs tree-kill since `instance.kill` does not kill spawned processes by this
      // instance
      treeKill(instance.pid, "SIGTERM", (error) => {
        if (error) {
          logger.error({
            message: "Could not kill process",
            error,
          });
        }

        start();
      });
    } else {
      start();
    }
  }

  /**
   * Restart with debounce
   * @param {boolean} [skipDebounce]
   */
  function debounceRestart(skipDebounce) {
    // Restart may be called multiple times in a row
    // We may want to add some kind of graceful back off here
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    if (skipDebounce) {
      killAndStart();
    } else {
      timeout = setTimeout(() => {
        killAndStart();
        timeout = undefined;
      }, 250);
    }
  }
}

/**
 * Prepare stdin to be used for manual restarting
 * @param {Function} restart
 */
function prepareStdin(restart) {
  process.stdin.resume();
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (data) => {
    const input = data.toString().trim().toLowerCase();

    // Consistency with Nodemon
    if (input === "rs") {
      restart(true);
    }
  });
}
