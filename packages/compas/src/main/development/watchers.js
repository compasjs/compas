import { existsSync } from "node:fs";
import { AppError, isNil, pathJoin } from "@compas/stdlib";
import watcher from "@parcel/watcher";

const DEFAULT_WATCH_OPTIONS = {
  ignore: [".cache", ".git", "node_modules"],
};

/**
 * Start watchers, process events from snapshots.
 *
 * @param {import("./state.js").State} state
 * @returns {Promise<void>}
 */
export async function watchersInit(state) {
  await watchersRefresh(state);

  // Handle events since snapshot.
  let events = [];

  for (const dir of Object.keys(state.directorySubscriptions)) {
    const snapshot = pathJoin(dir, ".cache/compas/watcher-snapshot.txt");

    if (!existsSync(snapshot)) {
      continue;
    }

    events = events.concat(
      await watcher.getEventsSince(dir, snapshot, DEFAULT_WATCH_OPTIONS),
    );
  }

  state.logInformation(`Started file watchers, ready for some action!`);

  state.externalChanges.filePaths.push(...events.map((it) => it.path));
  state.debouncedOnExternalChanges.refresh();
}

/**
 * Cleanly unsub from all watchers
 *
 * @param {import("./state.js").State} state
 * @returns {Promise<void>}
 */
export async function watchersExit(state) {
  for (const watcher of Object.values(state.directorySubscriptions)) {
    await watcher.unsubscribe();
  }
}

/**
 * Update the snapshots for each file watcher
 *
 * @param {import("./state.js").State} state
 * @returns {Promise<void>}
 */
export async function watchersWriteSnapshot(state) {
  for (const dir of Object.keys(state.directorySubscriptions)) {
    await watcher.writeSnapshot(
      dir,
      pathJoin(dir, ".cache/compas/watcher-snapshot.txt"),
      DEFAULT_WATCH_OPTIONS,
    );
  }
}

/**
 * Make sure all root directories have a watcher attached.
 *
 * @param {import("./state.js").State} state
 * @returns {Promise<void>}
 */
export async function watchersRefresh(state) {
  const dirs = state.cache.rootDirectories ?? [];

  // Cleanup unnecessary subscriptions;
  for (const key of Object.keys(state.directorySubscriptions)) {
    if (!dirs.includes(key)) {
      await state.directorySubscriptions[key].unsubscribe();
      delete state.directorySubscriptions[key];
    }
  }

  for (const dir of dirs) {
    if (!isNil(state.directorySubscriptions[dir])) {
      continue;
    }

    // Only resubscribe if we don't have subscription yet.
    state.directorySubscriptions[dir] = await watcher.subscribe(
      dir,
      (err, events) => {
        if (err) {
          throw AppError.serverError(
            {
              message: "Invariant failed. Not expecting file watcher errors.",
              dir,
            },
            err,
          );
        }

        state.externalChanges.filePaths.push(...events.map((it) => it.path));
        state.debouncedOnExternalChanges.refresh();
      },
      DEFAULT_WATCH_OPTIONS,
    );
  }
}
