/**
 *
 * @param {ConfigLoaderOptions} options
 * @returns {Promise<ConfigLoaderResult>}
 */
export function configLoaderGet(
  options: ConfigLoaderOptions,
): Promise<ConfigLoaderResult>;
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
export function configLoaderDeleteCache(
  options?:
    | {
        name?: string | undefined;
        location?: "user" | "project" | undefined;
      }
    | undefined,
): void;
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
export const configLoaderCache: Map<string, ConfigLoaderResult>;
export type ConfigLoaderOptions = {
  name: string;
  location: "project" | "user";
};
export type ConfigLoaderResult = {
  name: string;
  location: "project" | "user";
  resolvedLocation?:
    | {
        directory: string;
        filename: string;
      }
    | undefined;
  data: object;
};
//# sourceMappingURL=config-loader.d.ts.map
