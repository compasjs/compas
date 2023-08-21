import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { clearTimeout } from "node:timers";
import { AppError, pathJoin } from "@compas/stdlib";
import watcher from "@parcel/watcher";
import micromatch from "micromatch";
import { debugPrint } from "../../output/debug.js";
import { tuiPrintInformation } from "../../output/tui.js";

/**
 * @typedef {object} WatcherListener
 * @property {string} name
 * @property {string} glob
 * @property {() => (void|Promise<void>)} callback
 */

const globalOptions = {
  ignore: [".cache", ".git"],
};

/**
 * @type {WatcherListener[]}
 */
const listeners = [];

/**
 * Enable the watcher we process things directly, so make sure that the listeners are
 * added via {@link watcherAddListener} before starting the watcher. The watcher by
 * default ignores the `.cache` directory.
 *
 * @param {string} projectDirectory
 * @returns {Promise<void>}
 */
export async function watcherEnable(projectDirectory) {
  await watcher.subscribe(
    projectDirectory,
    (err, events) => {
      if (err) {
        debugPrint(AppError.format(err));
      }

      const pathArray = events.map((it) => it.path);
      debugPrint(JSON.stringify({ err: AppError.format(err), events }));

      for (const listener of listeners) {
        if (micromatch.some(pathArray, listener.glob)) {
          debugPrint(`Matched ${listener.name} invoking callback.`);
          listener.callback();
        }
      }
    },
    {
      ...globalOptions,
    },
  );
}

/**
 * Register the watcher listener. The glob is matched with 'micromatch' and the
 * {@link callback} is called with a trailing debounce using the {@link delay} in
 * milliseconds.
 *
 * @param {{
 *   glob: string,
 *   delay: number,
 *   callback: () => (void|Promise<void>)
 * }} listener
 */
export function watcherAddListener({ glob, delay, callback }) {
  if (!callback.name) {
    throw AppError.serverError({
      message: "Compas issue, all watcher callbacks should have a name.",
    });
  }

  debugPrint(
    `Registering ${callback.name} on changes to ${glob} after ${delay}ms.`,
  );

  listeners.push({
    name: callback.name,
    callback: debounce(callback, delay),
    glob,
  });
}

/**
 * Remove the snapshot path, to prevent loading of a snapshot if the cache is invalid.
 *
 * @param {string} projectDirectory
 * @returns {Promise<void>}
 */
export async function watcherRemoveSnapshot(projectDirectory) {
  const snapshotPath = pathJoin(
    projectDirectory,
    ".cache/compas/watcher-snapshot.txt",
  );

  await rm(snapshotPath, { force: true });
}

/**
 * Write the snapshot path.
 *
 * @param {string} projectDirectory
 * @returns {Promise<void>}
 */
export async function watcherWriteSnapshot(projectDirectory) {
  const snapshotPath = pathJoin(
    projectDirectory,
    ".cache/compas/watcher-snapshot.txt",
  );

  await watcher.writeSnapshot("", snapshotPath, {
    ...globalOptions,
  });
}

/**
 * Load the snapshot and process all changes that happened since. Is a noop if no
 * snapshot exists. It should be called when all systems are started, so everything has
 * added its listeners.
 *
 * @param {string} projectDirectory
 * @returns {Promise<void>}
 */
export async function watcherProcessChangesSinceSnapshot(projectDirectory) {
  const snapshotPath = pathJoin(
    projectDirectory,
    ".cache/compas/watcher-snapshot.txt",
  );

  if (!existsSync(snapshotPath)) {
    return;
  }

  const events = await watcher.getEventsSince(projectDirectory, snapshotPath, {
    ...globalOptions,
  });

  const pathArray = events.map((it) => it.path);

  let didLog = false;

  for (const listener of listeners) {
    if (micromatch.some(pathArray, listener.glob)) {
      if (!didLog) {
        // Only log once. We don't tell the user  that we are processing the events until
        // it triggers some action.
        tuiPrintInformation("Processing file events since the last run.");
        didLog = true;
      }
      debugPrint(`Matched ${listener.callback.name} invoking callback.`);
      listener.callback();
    }
  }
}

/**
 * @template {(...args: any[]) => any} T
 *
 * Trailing debounce function.
 *
 * @param {T} fn
 * @param {number} delay
 * @returns {T}
 */
function debounce(fn, delay) {
  let _timeout = 0;

  // @ts-expect-error
  return (...args) => {
    if (_timeout) {
      clearTimeout(_timeout);
    }

    // @ts-expect-error
    _timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
