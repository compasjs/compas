/*
 - Load .cache/compas/cache.json
 - Parse errors
 - Run through validators
 - Version mismatch
 - Default to new cache + clean file watcher snapshots in all configured directories
 - Load up config
 - Start up file watchers
 - Watcher snapshot should be stored per top-level watched directory
 - Clean any found cache in a directory

 - Integrate with State somehow
 - Config should be retrievable
 - Derivatives from config should be cached
 - Derivatives from config should be notified on change
 - File changes should be executed in order of listener submissions

 */

import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { AppError, pathJoin } from "@compas/stdlib";
import { validateCompasCache } from "../../generated/compas/validators.js";
import { writeFileChecked } from "../../shared/fs.js";
import {
  debugPrint,
  debugTimeEnd,
  debugTimeStart,
} from "../../shared/output.js";

const CACHE_PATH = ".cache/compas/cache.json";

/**
 * Load the cache based on the working directory.
 *
 * @param {string} compasVersion
 * @returns {Promise<{
 *   empty: boolean,
 *   cache: import("../../generated/common/types.js").CompasCache,
 * }>}
 */
export async function cacheLoad(compasVersion) {
  debugTimeStart("cache.load");

  const defaultCache = {
    version: compasVersion,
  };

  if (!existsSync(CACHE_PATH)) {
    debugPrint("Cache not found.");

    debugTimeEnd("cache.load");
    return {
      empty: true,
      cache: defaultCache,
    };
  }

  let _cache = undefined;

  try {
    _cache = JSON.parse(await readFile(CACHE_PATH, "utf-8"));
  } catch {
    debugPrint("Cache not parseable");

    await cacheClean();

    debugTimeEnd("cache.load");
    return {
      empty: true,
      cache: defaultCache,
    };
  }

  const { value, error } = validateCompasCache(_cache);

  if (error) {
    debugPrint("Cache not valid.");

    await cacheClean();

    debugTimeEnd("cache.load");
    return {
      empty: true,
      cache: defaultCache,
    };
  }

  if (value.version !== defaultCache.version) {
    debugPrint("Cache from old version");

    await cacheClean();

    debugTimeEnd("cache.load");
    return {
      empty: true,
      cache: defaultCache,
    };
  }

  debugTimeEnd("cache.load");

  return {
    empty: false,
    cache: value,
  };
}

/**
 * Clean the cache for the specific project.
 *
 * @param {string} project
 * @returns {Promise<void>}
 */
export async function cacheClean(project = "") {
  const cacheFile = pathJoin(project, CACHE_PATH);

  await rm(cacheFile, { force: true });
}

export async function cachePersist(cache) {
  const { error, value } = validateCompasCache(cache);

  if (error) {
    throw AppError.serverError({
      message: "Invariant failed. Could not validate cache before persisting.",
      error,
    });
  }

  await writeFileChecked(CACHE_PATH, JSON.stringify(value));
}
