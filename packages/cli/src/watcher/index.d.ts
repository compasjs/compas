/**
 * Kill a sub process with its own sub processes.
 * Uses tree-kill under the hood, to also exit any child processes of the provided process
 *
 * @param {import("child_process").ChildProcess} process
 * @param {NodeJS.Signals | number} signal
 * @returns {Promise<void>}
 */
export function watcherKillProcess(
  process: import("child_process").ChildProcess,
  signal: NodeJS.Signals | number,
): Promise<void>;
/**
 * Run watcher with the provided chokidar options, calling the hooks
 *
 * @param {{
 *   chokidarOptions: chokidar.WatchOptions,
 *   hooks: {
 *     onRestart: () => void,
 *   }
 * }} options
 * @returns {{ closeWatcher: () => Promise<void> }}
 */
export function watcherRun({
  chokidarOptions,
  hooks,
}: {
  chokidarOptions: chokidar.WatchOptions;
  hooks: {
    onRestart: () => void;
  };
}): {
  closeWatcher: () => Promise<void>;
};
/**
 * Run watcher run & wrap around child process spawn.
 * Makes sure the instance is fully killed, before starting up again.
 *
 * @param {Logger} logger
 * @param {{
 *   chokidarOptions: chokidar.WatchOptions,
 *   spawnArguments: [
 *     string,
 *     ReadonlyArray<string>,
 *     import("child_process").SpawnOptions,
 *   ],
 * }} options
 */
export function watcherRunWithSpawn(
  logger: Logger,
  options: {
    chokidarOptions: chokidar.WatchOptions;
    spawnArguments: [
      string,
      ReadonlyArray<string>,
      import("child_process").SpawnOptions,
    ];
  },
): void;
import chokidar from "chokidar";
//# sourceMappingURL=index.d.ts.map
