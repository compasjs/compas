/**
 * Overwrite used generated queries.
 * This is needed when you want cascading soft deletes to any of the exposed types.
 * It is mandatory to be called if 'files', 'session' or 'jobs' are used. If you don't
 * use the generators, you can use
 * `storeQueries` as exported by `@compas/store`.
 *
 * @since 0.1.0
 *
 * @param {typeof import("./generated/database/index.js").queries} q
 * @returns {void}
 */
export function setStoreQueries(
  q: typeof import("./generated/database/index.js").queries,
): void;
/**
 * @type {typeof storeQueries}
 */
export let queries: typeof storeQueries;
import { queries as storeQueries } from "./generated/database/index.js";
//# sourceMappingURL=generated.d.ts.map
