import { clearTimeout } from "timers";
import { AppError } from "@compas/stdlib";
import chokidar from "chokidar";
import treeKill from "tree-kill";

/**
 * Kill a sub process with its own sub processes.
 * Uses tree-kill under the hood, to also exit any child processes of the provided process
 *
 * @param {import("child_process").ChildProcess} process
 * @param {NodeJS.Signals | number} signal
 * @return {Promise<void>}
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
 *   chokidarOptions: chokidar.WatchOptions,
 *   hooks: {
 *     onRestart: () => void,
 *   }
 * }} options
 * @return {{ closeWatcher: () => Promise<void> }}
 */
export function watcherRun({ chokidarOptions, hooks }) {
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

// watcherRun({ chokidarOpts, compasWatcherOpts: {}, hooks: {
//   watcherReady(files: string[]): void,
//   watcherRestart(),
// },
// }): Promise<{ killWatcher: () => {}; }>
