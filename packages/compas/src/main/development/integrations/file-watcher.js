import { existsSync } from "node:fs";
import { AppError, isNil, pathJoin } from "@compas/stdlib";
import watcher from "@parcel/watcher";
import { BaseIntegration } from "./base.js";

export class FileWatcherIntegration extends BaseIntegration {
  static DEFAULT_WATCH_OPTIONS = {
    ignore: [".cache", ".git"],
  };

  constructor(state) {
    super(state, "fileWatcher");

    /**
     *
     * @type {Record<string, watcher.AsyncSubscription>}
     */
    this.subscriptions = {};
  }

  async init() {
    await super.init();

    await this.refreshWatchers();

    // Handle events since snapshot.
    let events = [];

    for (const dir of Object.keys(this.subscriptions)) {
      const snapshot = pathJoin(dir, ".cache/compas/watcher-snapshot.txt");

      if (!existsSync(snapshot)) {
        continue;
      }

      events = events.concat(
        await watcher.getEventsSince(
          dir,
          snapshot,
          FileWatcherIntegration.DEFAULT_WATCH_OPTIONS,
        ),
      );
    }

    this.state.logInformation(`Started file watchers, ready for some action!`);

    return this.state.emitFileChange(events.map((it) => it.path));
  }

  async onCacheUpdated() {
    await super.onCacheUpdated();

    await this.refreshWatchers();

    for (const dir of Object.keys(this.subscriptions)) {
      await watcher.writeSnapshot(
        dir,
        pathJoin(dir, ".cache/compas/watcher-snapshot.txt"),
        FileWatcherIntegration.DEFAULT_WATCH_OPTIONS,
      );
    }
  }

  async refreshWatchers() {
    const dirs = this.state.cache.rootDirectories ?? [];

    // Cleanup unnecessary subscriptions;
    for (const key of Object.keys(this.subscriptions)) {
      if (!dirs.includes(key)) {
        await this.subscriptions[key].unsubscribe();
        delete this.subscriptions[key];
      }
    }

    const boundEmitFileChange = this.state.emitFileChange.bind(this.state);

    for (const dir of dirs) {
      if (!isNil(this.subscriptions[dir])) {
        continue;
      }

      // Only resubscribe if we don't have subscription yet.
      this.subscriptions[dir] = await watcher.subscribe(
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

          // Dangling promise!
          boundEmitFileChange(events.map((it) => it.path));
        },
        FileWatcherIntegration.DEFAULT_WATCH_OPTIONS,
      );
    }
  }
}
