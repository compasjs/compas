import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { AppError, pathJoin } from "@compas/stdlib";
import { validateCompasCache } from "./generated/compas/validators.js";
import { debugTimeEnd, debugTimeStart } from "./output/debug.js";
import { output } from "./output/static.js";
import { watcherWriteSnapshot } from "./watcher.js";

/**
 * @typedef {import("./generated/common/types.js").CompasCache} Cache
 */

/**
 * Load the cache from disk. Runs the cache through the validators and validates if the
 * loaded cache works with the provided Compas version.
 *
 * @param {string} projectDirectory
 * @param {string} compasVersion
 * @returns {Promise<Cache>}
 */
export async function cacheLoadFromDisk(projectDirectory, compasVersion) {
  debugTimeStart("cache.load");

  const cachePath = pathJoin(projectDirectory, ".cache/compas/cache.json");
  const defaultConfig = {
    version: compasVersion,
  };

  if (!existsSync(cachePath)) {
    output.cache.notExisting();

    return defaultConfig;
  }

  let _cache = undefined;

  try {
    _cache = JSON.parse(await readFile(cachePath, "utf-8"));
  } catch (e) {
    output.cache.errorReadingCache(e);

    return defaultConfig;
  }

  const { value, error } = validateCompasCache(_cache);

  if (error) {
    output.cache.errorValidatingCache(error);

    return defaultConfig;
  }

  if (value.version !== compasVersion) {
    output.cache.invalidCompasVersion(value.version, compasVersion);

    return defaultConfig;
  }

  output.cache.loaded(value);
  debugTimeEnd("cache.load");

  return value;
}

/**
 * Writes the cache to disk. Before writing the cache, we run the validator to make sure
 * that we don't write an invalid cache.
 *
 * @param {string} projectDirectory
 * @param {Cache} cache
 * @returns {Promise<void>}
 */
export async function cacheWriteToDisk(projectDirectory, cache) {
  debugTimeStart("cache.write");

  const cachePath = pathJoin(projectDirectory, ".cache/compas/cache.json");

  const { error } = validateCompasCache(cache);
  if (error) {
    throw AppError.serverError({
      message:
        "Compas failed to set a valid cache entry. Please copy and paste this error (removing private parts of the stacktrace) in to a new issue on GitHub.",
      error,
    });
  }

  await mkdir(cachePath.split("/").slice(0, -1).join("/"), { recursive: true });
  await writeFile(cachePath, JSON.stringify(cache));

  await watcherWriteSnapshot(projectDirectory);

  debugTimeEnd("cache.write");
}
