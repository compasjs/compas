import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdirSync, rmSync } from "node:fs";
import { setTimeout } from "node:timers/promises";
import { pathJoin } from "@compas/stdlib";

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
 * Util to test CLI execution.
 *
 * Launches the CLI directly and is able to send a list of inputs to it. It collects the
 * stdout and stderr to assert on.
 *
 * By default exits after executing all actions. Provide {@link options.waitForClose} if
 * you want to wait till the process exits automatically.
 *
 * @param {{
 *   args?: string[],
 *   waitForExit?: boolean,
 *   inputs: {
 *     write: string|Buffer,
 *     timeout?: number,
 *   }[]
 * } & import("child_process").SpawnOptionsWithoutStdio} options
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
export async function testCompasCli({
  args,
  inputs,
  waitForExit,
  ...spawnOpts
}) {
  const cp = spawn(
    `node`,
    [
      pathJoin(process.cwd(), "./packages/compas/src/cli/bin.js"),
      ...(args ?? ["--debug"]),
    ],
    {
      ...spawnOpts,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...(spawnOpts.env ?? {
          ...process.env,
          CI: "false",
          APP_NAME: undefined,
          _COMPAS_SKIP_PACKAGE_MANAGER: "true",
          _COMPAS_SKIP_COMMIT_SIGN: "true",
        }),
      },
    },
  );

  const exitHandler = () => {
    cp.kill("SIGTERM");
  };
  process.once("exit", exitHandler);

  const stdoutBuffers = [];
  const stderrBuffers = [];

  cp.stdout.on("data", (chunk) => {
    stdoutBuffers.push(chunk);
  });
  cp.stderr.on("data", (chunk) => {
    stderrBuffers.push(chunk);
  });

  let closed = false;
  cp.once("exit", () => {
    closed = true;
  });

  // Wait max 500ms for the first output or process exit
  for (let i = 0; i < 100; ++i) {
    if (stdoutBuffers.length !== 0 || stderrBuffers.length !== 0 || closed) {
      break;
    }

    await setTimeout(5);
  }

  if (closed) {
    process.removeListener("exit", exitHandler);
    return {
      stdout: Buffer.concat(stdoutBuffers).toString(),
      stderr: Buffer.concat(stderrBuffers).toString(),
    };
  }

  for (const input of inputs) {
    cp.stdin.write(input.write);

    await setTimeout(input.timeout ?? 0);

    if (closed) {
      process.removeListener("exit", exitHandler);

      return {
        stdout: Buffer.concat(stdoutBuffers).toString(),
        stderr: Buffer.concat(stderrBuffers).toString(),
      };
    }
  }

  if (closed) {
    process.removeListener("exit", exitHandler);
    return {
      stdout: Buffer.concat(stdoutBuffers).toString(),
      stderr: Buffer.concat(stderrBuffers).toString(),
    };
  }

  const p = once(cp, "exit");

  if (!waitForExit) {
    cp.kill("SIGTERM");
  }

  await p;

  process.removeListener("exit", exitHandler);

  return {
    stdout: Buffer.concat(stdoutBuffers).toString(),
    stderr: Buffer.concat(stderrBuffers).toString(),
  };
}
