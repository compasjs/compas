import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import { pathToFileURL } from "node:url";
import { environment } from "./env.js";
import { AppError } from "./error.js";
import { isNil } from "./lodash.js";
import { pathJoin } from "./node.js";

/**
 * @typedef {object} ConfigLoaderOptions
 * @property {string} name
 * @property {"project"|"user"} location
 */

/**
 * @typedef {object} ConfigLoaderResult
 * @property {string} name
 * @property {"project"|"user"} location
 * @property {{
 *   directory: string,
 *   filename: string,
 * }} [resolvedLocation]
 * @property {object} data
 */

/**
 *
 * @type {Map<string, ConfigLoaderResult>}
 */
export const configLoaderCache = new Map();

/**
 *
 * @param {ConfigLoaderOptions} options
 * @returns {Promise<ConfigLoaderResult>}
 */
export async function configLoaderGet(options) {
  if (
    isNil(options.name) ||
    typeof options.name !== "string" ||
    !["project", "user"].includes(options.location)
  ) {
    throw AppError.serverError({
      message:
        "Invalid config options object. 'name' and 'location' are both required and should be a string.",
    });
  }

  const cacheKey = `${options.name}-${options.location}`;

  if (configLoaderCache.has(cacheKey)) {
    // @ts-ignore
    return configLoaderCache.get(cacheKey);
  }

  const resolvedLocation = configLoaderResolveDirectory(options);

  if (isNil(resolvedLocation)) {
    configLoaderCache.set(cacheKey, {
      name: options.name,
      location: options.location,
      data: {},
    });

    // @ts-ignore
    return configLoaderCache.get(cacheKey);
  }

  let data;

  if (resolvedLocation.filename.endsWith(".json")) {
    data = JSON.parse(
      await readFile(
        pathJoin(resolvedLocation.directory, resolvedLocation.filename),
        "utf-8",
      ),
    );
  } else {
    const imported = await import(
      // @ts-ignore
      pathToFileURL(
        pathJoin(resolvedLocation.directory, resolvedLocation.filename),
      )
    );
    data = imported.config() ?? {};
  }

  configLoaderCache.set(cacheKey, {
    name: options.name,
    location: options.location,
    resolvedLocation,
    data,
  });

  // @ts-ignore
  return configLoaderCache.get(cacheKey);
}

/**
 * Clear the config cache.
 * Is able to do partially removes by either specifying a name or location but not both.
 *
 * @param {{
 *   name?: string,
 *   location?: "project"|"user"
 * }} [options]
 * @returns {void}
 */
export function configLoaderDeleteCache(options) {
  options = options ?? {};

  if (options.name && options.location) {
    throw AppError.serverError({
      message:
        "'name' and 'location' can't both be specified. So remove one of them or both.",
    });
  }

  if (!isNil(options.name)) {
    for (const key of configLoaderCache.keys()) {
      if (key.startsWith(options.name)) {
        configLoaderCache.delete(key);
      }
    }
  } else if (!isNil(options.location)) {
    for (const key of configLoaderCache.keys()) {
      if (key.endsWith(options.location)) {
        configLoaderCache.delete(key);
      }
    }
  } else {
    configLoaderCache.clear();
  }
}

/**
 *
 * @param {ConfigLoaderOptions} options
 * @returns {{
 *   directory: string,
 *   filename: string,
 * }|undefined}
 */
function configLoaderResolveDirectory({ name, location }) {
  if (location === "project") {
    if (existsSync(`./${name}.json`)) {
      return {
        directory: process.cwd(),
        filename: `${name}.json`,
      };
    }

    if (existsSync(`./${name}.js`)) {
      return {
        directory: process.cwd(),
        filename: `${name}.js`,
      };
    }

    if (existsSync(`./${name}.mjs`)) {
      return {
        directory: process.cwd(),
        filename: `${name}.mjs`,
      };
    }

    if (existsSync(pathJoin(`./config`, `./${name}.json`))) {
      return {
        directory: pathJoin(process.cwd(), "./config"),
        filename: `${name}.json`,
      };
    }

    if (existsSync(pathJoin(`./config`, `./${name}.js`))) {
      return {
        directory: pathJoin(process.cwd(), "./config"),
        filename: `${name}.js`,
      };
    }

    if (existsSync(pathJoin(`./config`, `./${name}.mjs`))) {
      return {
        directory: pathJoin(process.cwd(), "./config"),
        filename: `${name}.mjs`,
      };
    }

    return undefined;
  }

  if (location === "user") {
    const configDir = configLoaderGetUserConfigDir(name);

    if (existsSync(pathJoin(configDir, `./${name}.json`))) {
      return {
        directory: configDir,
        filename: `${name}.json`,
      };
    }

    if (existsSync(pathJoin(configDir, `./${name}.js`))) {
      return {
        directory: configDir,
        filename: `${name}.js`,
      };
    }

    if (existsSync(pathJoin(configDir, `./${name}.mjs`))) {
      return {
        directory: configDir,
        filename: `${name}.mjs`,
      };
    }

    return undefined;
  }
}

/**
 * Determine the config dir based on the program name.
 * We don't support different config file for the same program. So the config directory
 * is the same as the config name.
 *
 * @param {string} name
 * @returns {string}
 */
function configLoaderGetUserConfigDir(name) {
  // Inspired by:
  // https://github.com/sindresorhus/env-paths/tree/f1729272888f45f6584e74dc4d0af3aecba9e7e8
  // License:
  // https://github.com/sindresorhus/env-paths/blob/f1729272888f45f6584e74dc4d0af3aecba9e7e8/license

  const homedir = os.homedir();

  if (process.platform === "darwin") {
    return pathJoin(homedir, "Library", "Preferences", name);
  }

  if (process.platform === "win32") {
    return pathJoin(
      environment.APPDATA ??
        pathJoin(homedir, "AppData", "Roaming", name, "Config"),
    );
  }

  // Linux
  return pathJoin(
    environment.XDG_CONFIG_HOME ?? pathJoin(homedir, ".config"),
    name,
  );
}
