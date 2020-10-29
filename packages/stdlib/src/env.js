/**
 * Cached process.env
 */
export let environment = {};

/**
 * Repopulate the cached environment copy.
 * This should only be necessary when you or a sub package mutates the environment.
 * The `mainFn` / `mainTestFn` / `mainBenchFn` / ... will call this function by default
 * after loading your `.env` file.
 *
 * Accessing process.env.XXX is relatively in Node.js.
 * Benchmark of a plain object property access and accessing process.env.NODE_ENV:
 *
 * property access       500000000  iterations     0  ns/op
 * process.env access      5000000  iterations   246  ns/op
 *
 * See this thread: https://github.com/nodejs/node/issues/3104
 */
export function refreshEnvironmentCache() {
  environment = JSON.parse(JSON.stringify(process.env));
}

/**
 * @returns {boolean}
 */
export function isProduction() {
  return environment.NODE_ENV === "production";
}

/**
 * @returns {boolean}
 */
export function isStaging() {
  return (
    environment.NODE_ENV !== "production" || environment.IS_STAGING === "true"
  );
}
