import { cacheLoadFromDisk, cacheWriteToDisk } from "../cache.js";
import { configResolve } from "../config.js";
import { debugEnable } from "../output/debug.js";
import { output } from "../output/static.js";
import {
  tuiEnable,
  tuiPrintInformation,
  tuiStateSetAvailableActions,
  tuiStateSetMetadata,
} from "../output/tui.js";
import {
  watcherAddListener,
  watcherEnable,
  watcherProcessChangesSinceSnapshot,
  watcherRemoveSnapshot,
  watcherWriteSnapshot,
} from "../watcher.js";

/**
 * Run Compas in development mode
 *
 * @param {import("../config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function developmentMode(env) {
  output.config.environment.loaded(env);

  /** @type {any} */
  const state = {
    env,
    config: undefined,
    cache: undefined,
  };

  tuiEnable();
  tuiStateSetMetadata({
    appName: env.appName,
    compasVersion: env.compasVersion,
  });

  state.cache = await cacheLoadFromDisk("", env.compasVersion);

  if (!state.cache.config) {
    // We have an empty cache

    // Remove watcher snapshot, we are going to resolve everything from scratch
    await watcherRemoveSnapshot("");

    //
    state.config = state.cache.config = await configResolve("", true);

    // Persist cache to disk
    await watcherWriteSnapshot("");
    await cacheWriteToDisk("", state.cache);
  } else {
    tuiPrintInformation("Loading from cache.");
    // Load from cache

    state.config = state.cache.config;
  }

  async function configReload() {
    const newConfig = await configResolve("", true);

    if (!newConfig) {
      tuiPrintInformation("Error while reloading config.");
      return;
    }

    tuiPrintInformation("Reloaded config due to a file change.");

    state.config = newConfig;
    state.cache.config = newConfig;
    await cacheWriteToDisk("", state.cache);
  }

  watcherAddListener({
    glob: "**/config/compas.json",
    delay: 150,
    callback: configReload,
  });

  function foo() {
    tuiPrintInformation(".env changed");
  }

  watcherAddListener({
    glob: "**/.env*",
    delay: 100,
    callback: foo,
  });

  await watcherEnable("");
  await watcherProcessChangesSinceSnapshot("");

  tuiStateSetAvailableActions(
    [
      {
        name: "Lint",
        highlight: "L",
      },
      {
        name: "Test",
        highlight: "T",
      },
    ],
    (action) => {
      tuiPrintInformation(JSON.stringify(action));
    },
  );

  debugEnable();
}
