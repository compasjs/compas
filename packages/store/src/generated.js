import { queries as defaultQueries } from "./generated/index.js";

export let queries = defaultQueries;

/**
 * Overwrite used generated queries.
 * This is needed when you want cascading soft deletes to any of the exposed types
 * @param {typeof defaultQueries} q
 */
export function setStoreQueries(q) {
  queries = q;
}
