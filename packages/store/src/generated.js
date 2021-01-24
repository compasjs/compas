export let queries = undefined;

/**
 * Overwrite used generated queries.
 * This is needed when you want cascading soft deletes to any of the exposed types
 * @param {typeof import("./generated/index.js").queries} q
 */
export function setStoreQueries(q) {
  queries = q;
}
