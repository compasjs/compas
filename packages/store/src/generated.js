export let queries = undefined;

/**
 * Overwrite used generated queries.
 * This is needed when you want cascading soft deletes to any of the exposed types.
 * It is mandatory to be called if 'files', 'session' or 'jobs' are used. If you don't
 * use the generators, you can use
 * `storeQueries` as exported by `@compas/store`.
 *
 * @since 0.1.0
 *
 * @param {typeof import("./generated/index.js").queries} q
 * @returns {undefined}
 */
export function setStoreQueries(q) {
  queries = q;
}
