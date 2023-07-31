import { spawn as cpSpawn } from "node:child_process";
import { AppError } from "@compas/stdlib";
import treeKill from "tree-kill";

/**
 * Kill a sub process with its own sub processes.
 * Uses tree-kill under the hood, to also exit any child processes of the provided process
 *
 * @param {import("child_process").ChildProcess} process
 * @param {NodeJS.Signals | number} signal
 * @returns {Promise<void>}
 */
export function watcherKillProcess(process, signal) {
  const pid = process?.pid;
  if (typeof pid !== "number") {
    throw AppError.validationError("watcher.killProcess.invalidProcess");
  }

  return new Promise((resolve, reject) => {
    treeKill(pid, signal, (error) => {
      if (error) {
        reject(
          AppError.serverError(
            {
              message: "Could not kill process",
              pid,
            },
            error,
          ),
        );
      } else {
        resolve();
      }
    });
  });
}

/**
 * Run watcher with the provided chokidar options, calling the hooks
 *
 * @param {{
 *   chokidarOptions: import("chokidar").WatchOptions,
 *   hooks: {
 *     onRestart: () => void,
 *   }
 * }} options
 * @returns {Promise<{ closeWatcher: () => Promise<void> }>}
 */
export async function watcherRun({ chokidarOptions, hooks }) {
  const stdinCallback = (data) => {
    const input = data.toString().trim().toLowerCase();

    // Consistency with Nodemon
    if (input === "rs") {
      debounceRestart(true);
    }
  };

  function prepareStdin() {
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", stdinCallback);
  }

  function cleanupStdinHook() {
    process.stdin.removeListener("data", stdinCallback);
  }

  let timeout = undefined;

  const chokidar = await import("chokidar");
  const watcher = chokidar.watch(".", chokidarOptions);

  watcher.on("change", () => {
    debounceRestart();
  });

  watcher.on("ready", () => {
    prepareStdin();
    debounceRestart(true);
  });

  /**
   * Restart with debounce
   *
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
      hooks.onRestart();
    } else {
      timeout = setTimeout(() => {
        hooks.onRestart();
        timeout = undefined;
      }, 250);
    }
  }

  return {
    closeWatcher: async () => {
      await watcher.close();
      clearTimeout(timeout);
      cleanupStdinHook();
    },
  };
}

/**
 * Run watcher run & wrap around child process spawn.
 * Makes sure the instance is fully killed, before starting up again.
 *
 * @param {Logger} logger
 * @param {{
 *   chokidarOptions: import("chokidar").WatchOptions,
 *   spawnArguments: [
 *     string,
 *     ReadonlyArray<string>,
 *     import("child_process").SpawnOptions,
 *   ],
 * }} options
 */
export async function watcherRunWithSpawn(logger, options) {
  let instance = undefined;
  let instanceKilled = false;

  // @ts-ignore
  await watcherRun({
    chokidarOptions: options.chokidarOptions,
    hooks: {
      onRestart: killAndStart,
    },
  });

  function exitListener(code) {
    // Print normal exit behaviour or if verbose is requested.
    if (!instanceKilled) {
      logger.info({
        message: "Process exited",
        code: code ?? 0,
      });
    }

    // We don't need to kill this instance, and just let it be garbage collected.
    instance = undefined;
  }

  function start() {
    instance = cpSpawn(...options.spawnArguments);

    instanceKilled = false;
    instance.once("exit", exitListener);
  }

  function killAndStart() {
    if (instance && !instanceKilled) {
      instanceKilled = true;
      instance.removeListener("exit", exitListener);

      watcherKillProcess(instance, "SIGTERM")
        .then(() => {
          start();
        })
        .catch((e) => {
          logger.error({
            message: "Could not kill process",
            error: AppError.format(e),
          });
        });
    } else {
      start();
    }
  }
}
