import { existsSync, rmSync } from "node:fs";
import { pathJoin } from "@compas/stdlib";

/**
 * @type {import("./base.js").Integration}
 */
export const cacheCleanupIntegration = {
  getStaticName() {
    return "cacheCleanup";
  },

  onColdStart(state) {
    cacheCleanup(state.cache.config, {
      isColdStart: true,
      isRootConfig: true,
    });
  },

  onCachedStart(state) {
    cacheCleanup(state.cache.config, {
      isColdStart: true,
      isRootConfig: true,
    });
  },

  onExternalChanges(state) {
    cacheCleanup(state.cache.config, {
      isColdStart: true,
      isRootConfig: true,
    });
  },
};

/**
 *
 * @param {import("../../../generated/common/types.js").CompasResolvedConfig|undefined} config
 * @param {{
 *   isRootConfig: boolean,
 *   isColdStart: boolean,
 * }} options
 */
function cacheCleanup(config, { isColdStart, isRootConfig }) {
  if (!config) {
    return;
  }

  if (isColdStart && isRootConfig) {
    // Watcher snapshot when ran from another project
    rmSync(".cache/compas/watcher-snapshot.txt", { force: true });
  } else if (isColdStart && !isRootConfig) {
    // Remove caches and snapshots from other runs
    rmSync(pathJoin(config.rootDirectory, ".cache/compas/cache.json"), {
      force: true,
    });
    rmSync(
      pathJoin(config.rootDirectory, ".cache/compas/watcher-snapshot.json"),
      { force: true },
    );
  } else if (!isColdStart && !isRootConfig) {
    // Project could have ran in standalone, without referencing this project. Which
    // means that we will be quite confused. At least clean this up. We may need to
    // revisit this later, that we still want to boot up freshly after cleaning up
    // the root cache.
    if (
      existsSync(pathJoin(config.rootDirectory, ".cache/compas/cache.json"))
    ) {
      rmSync(pathJoin(config.rootDirectory, ".cache/compas/cache.json"), {
        force: true,
      });
      rmSync(
        pathJoin(config.rootDirectory, ".cache/compas/watcher-snapshot.json"),
        { force: true },
      );
    }
  }

  for (const project of config.projects) {
    cacheCleanup(project, {
      isColdStart,
      isRootConfig: false,
    });
  }
}
