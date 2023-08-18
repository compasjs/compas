import { spawn as cpSpawn } from "node:child_process";
import { once } from "node:events";
import treeKill from "tree-kill";
import { cacheLoadFromDisk, cacheWriteToDisk } from "../cache.js";
import { configResolve } from "../config.js";
import { debugEnable } from "../output/debug.js";
import { output } from "../output/static.js";
import {
  tuiEnable,
  tuiEraseLayout,
  tuiExit,
  tuiPaintLayout,
  tuiPrintInformation,
  tuiStateSetAvailableActions,
  tuiStateSetMetadata,
  tuiWritePersistent,
} from "../output/tui.js";
import {
  watcherAddListener,
  watcherEnable,
  watcherProcessChangesSinceSnapshot,
  watcherRemoveSnapshot,
  watcherWriteSnapshot,
} from "../watcher.js";

/**
 * @typedef {{
 *   env: import("../config.js").ConfigEnvironment,
 *   config: import("../generated/common/types.js").CompasResolvedConfig,
 *   cache: import("../generated/common/types.js").CompasCache,
 *   tui: {
 *     activeConfig: import("../generated/common/types.js").CompasResolvedConfig,
 *     navigationStack: import("../generated/common/types.js").CompasResolvedConfig[],
 *     activeProcess?: import("child_process").ChildProcess & {
 *       exitListener: (signal?: number|null) => void,
 *       command: string[],
 *     }
 *   }
 * }} DevelopmentState
 */

/**
 * Run Compas in development mode
 *
 * @param {import("../config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function developmentMode(env) {
  output.config.environment.loaded(env);
  debugEnable();

  /** @type {DevelopmentState} */
  const state = {
    env,
    // @ts-expect-error
    config: undefined,
    // @ts-expect-error
    cache: undefined,
    // @ts-expect-error
    tui: {
      navigationStack: [],
    },
  };

  tuiEnable();
  tuiStateSetMetadata({
    appName: env.appName,
    compasVersion: env.compasVersion,
  });

  state.cache = await cacheLoadFromDisk("", env.compasVersion);

  if (!state.cache.config) {
    // Load from disk.

    // Remove watcher snapshot, we are going to resolve everything from scratch
    await watcherRemoveSnapshot("");

    // @ts-expect-error
    //
    // All actions
    state.config = state.cache.config = await configResolve("", true);

    // TODO: ...

    // End all actions

    // Persist cache to disk
    await watcherWriteSnapshot("");
    await cacheWriteToDisk("", state.cache);
  } else {
    // Restore from cache
    tuiPrintInformation("Booted from cache.");

    // Restoring state
    state.config = state.cache.config;

    // TODO: ...

    // End restoring state...
  }

  // Register watcher
  watcherAddListener({
    glob: "**/config/compas.json",
    delay: 150,
    callback: developmentReloadConfig.bind(undefined, state),
  });

  await watcherEnable("");
  await watcherProcessChangesSinceSnapshot("");
  // End register watcher

  // Start input cycle
  developmentManagementCycle(state);
}

/**
 * @param {DevelopmentState} state
 * @returns {Promise<void>}
 */
async function developmentReloadConfig(state) {
  const newConfig = await configResolve("", true);

  if (!newConfig) {
    tuiPrintInformation("Error while reloading config.");
    return;
  }

  tuiPrintInformation("Reloaded config due to a file change.");

  state.config = newConfig;
  state.cache.config = newConfig;
  await cacheWriteToDisk("", state.cache);

  state.tui.activeConfig = state.config;
  state.tui.navigationStack = [];
  developmentManagementCycle(state);
}

/**
 * @param {DevelopmentState} state
 */
function developmentManagementCycle(state) {
  if (state.tui.activeProcess) {
    tuiStateSetAvailableActions([
      {
        title: "Process actions",
        actions: [
          {
            name: "Restart",
            shortcut: "R",
            callback: () => {
              if (!state.tui.activeProcess) {
                return;
              }

              const command = state.tui.activeProcess.command;
              return new Promise((r) => {
                if (!state.tui.activeProcess) {
                  return;
                }

                state.tui.activeProcess.removeListener(
                  "exit",
                  state.tui.activeProcess.exitListener,
                );

                Promise.all([
                  once(state.tui.activeProcess, "exit"),
                  new Promise((r) => {
                    // @ts-expect-error
                    treeKill(state.tui.activeProcess.pid, r);
                  }),
                ]).then(() => {
                  // @ts-expect-error
                  r();
                });
              }).then(() => {
                if (!state.tui.activeProcess) {
                  return;
                }

                state.tui.activeProcess.exitListener(null);
                developmentSpawnAction(state, command);
              });
            },
          },
          {
            name: "Kill",
            shortcut: "K",
            callback: () => {
              if (!state.tui.activeProcess) {
                return;
              }

              state.tui.activeProcess.removeListener(
                "exit",
                state.tui.activeProcess.exitListener,
              );

              return new Promise((r) => {
                if (!state.tui.activeProcess) {
                  return;
                }

                Promise.all([
                  once(state.tui.activeProcess, "exit"),
                  new Promise((r) => {
                    // @ts-expect-error
                    treeKill(state.tui.activeProcess.pid, r);
                  }),
                ]).then(() => {
                  if (!state.tui.activeProcess) {
                    return;
                  }

                  state.tui.activeProcess.exitListener(null);
                  r();
                });
              });
            },
          },
        ],
      },
    ]);
  } else if (state.tui.activeConfig) {
    const actions =
      state.tui.activeConfig.actions?.map((it) => ({
        name: it.name,
        shortcut: it.shortcut,
        callback: () => {
          developmentSpawnAction(state, it.command);
        },
      })) ?? [];

    tuiStateSetAvailableActions([
      {
        title: "Navigation:",
        // @ts-expect-error
        actions: [
          state.tui.navigationStack.length
            ? {
                name: "Back",
                shortcut: "B",
                callback: () => {
                  // @ts-expect-error
                  state.tui.activeConfig = state.tui.navigationStack.pop();
                  developmentManagementCycle(state);
                },
              }
            : undefined,
          {
            name: "Quit",
            shortcut: "Q",
            callback: () => {
              tuiExit();
            },
          },
          ...state.tui.activeConfig.projects.map((it, idx) => ({
            name: it.rootDirectory,
            shortcut: `${idx + 1}`,
            callback: () => {
              state.tui.navigationStack.push(state.tui.activeConfig);
              state.tui.activeConfig = it;
              developmentManagementCycle(state);
            },
          })),
        ].filter((it) => !!it),
      },
      {
        title: "Available actions:",
        actions,
      },
      {
        title: "Shortcuts while an action is active:",
        actions: [
          {
            name: "Restart",
            shortcut: "R",
            callback: () => {
              // noop
            },
          },
          {
            name: "Kill",
            shortcut: "K",
            callback: () => {
              // noop
            },
          },
        ],
      },
    ]);

    // Repaint!
    tuiPaintLayout();
  }
}

/**
 * @param {DevelopmentState} state
 * @param {string[]} command
 */
function developmentSpawnAction(state, command) {
  tuiEraseLayout();

  // Reregister actions before the command is running
  // @ts-expect-error
  state.tui.activeProcess = true;
  developmentManagementCycle(state);

  tuiWritePersistent((cursor) =>
    cursor
      .reset()
      .write("> Spawning '")
      .fg.magenta()
      .write(command.join(" "))
      .reset()
      .write("'\n"),
  );

  const start = Date.now();

  const cp = cpSpawn(command[0], command.slice(1), {
    stdio: ["ignore", "inherit", "inherit"],
  });

  // @ts-expect-error
  cp.exitListener = (status) => {
    // @ts-expect-error
    delete state.tui.activeConfig;

    const time = Number((Date.now() - start) / 1000).toFixed(1);
    if (status === 0) {
      tuiWritePersistent((cursor) =>
        cursor
          .reset()
          .fg.green()
          .write(`> Action complete in ${time}s.\n`)
          .reset(),
      );
    } else if (status) {
      tuiWritePersistent((cursor) =>
        cursor.reset().fg.red().write(`> Action failed in ${time}s.\n`).reset(),
      );
    } else {
      tuiWritePersistent((cursor) =>
        cursor
          .reset()
          .fg.yellow()
          .write(`> Action stopped after ${time}s.\n`)
          .reset(),
      );
    }

    developmentManagementCycle(state);
  };

  // @ts-expect-error
  cp.on("exit", cp.exitListener);

  // @ts-expect-error
  cp.command = command;
  // @ts-expect-error
  state.tui.activeConfig = cp;
}
