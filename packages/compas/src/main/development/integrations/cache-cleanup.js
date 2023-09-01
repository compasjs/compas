import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { isNil, pathJoin } from "@compas/stdlib";
import { BaseIntegration } from "./base.js";

export class CacheCleanupIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "cacheCleanup");
  }

  async init() {
    await super.init();

    const hasPreviouslyCleaned = this.state.cache.cachesCleaned;
    this.state.cache.cachesCleaned = true;

    if (!hasPreviouslyCleaned) {
      return await this.state.emitCacheUpdated();
    }
  }

  async onConfigUpdated() {
    await super.onConfigUpdated();

    await this.cleanup();
  }

  async cleanup() {
    const isCleanBoot = isNil(this.state.cache.cachesCleaned);

    async function handleProject(project) {
      const isRootProject = (project.rootDirectory = process.cwd());

      if (isCleanBoot && isRootProject) {
        // Watcher snapshot when ran from another project
        await rm(".cache/compas/watcher-snapshot.txt", { force: true });
      } else if (isCleanBoot && !isRootProject) {
        // Remove caches and snapshots from other runs
        await rm(pathJoin(project.rootDirectory, ".cache/compas/cache.json"), {
          force: true,
        });
        await rm(
          pathJoin(
            project.rootDirectory,
            ".cache/compas/watcher-snapshot.json",
          ),
          { force: true },
        );
      } else if (!isCleanBoot && !isRootProject) {
        // Project could have ran in standalone, without referencing this project. Which
        // means that we will be quite confused. At least clean this up. We may need to
        // revisit this later, that we still want to boot up freshly after cleaning up
        // the root cache.
        if (
          existsSync(
            pathJoin(project.rootDirectory, ".cache/compas/cache.json"),
          )
        ) {
          await rm(
            pathJoin(project.rootDirectory, ".cache/compas/cache.json"),
            {
              force: true,
            },
          );
          await rm(
            pathJoin(
              project.rootDirectory,
              ".cache/compas/watcher-snapshot.json",
            ),
            { force: true },
          );
        }
      }
    }

    await handleProject(this.state.cache.config);
  }
}
