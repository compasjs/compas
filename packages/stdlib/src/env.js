/**
 * Cached process.env
 *
 * @type {Record<string, string>}
 */
export let environment = {};

/**
 * This should only be necessary when you or a package mutates the environment variables.
 * The `mainFn` and `mainTestFn` will call this function by default
 * after loading your `.env` file.
 *
 * Accessing an environment variable via `process.env.XXXX` is relatively slow compared
 * to direct property access. As can be seen in the following benchmark:
 *
 * ```txt
 * property access       500000000  iterations     0  ns/op
 * process.env access      5000000  iterations   246  ns/op
 * ```
 *
 * See this thread: https://github.com/nodejs/node/issues/3104 for more information.
 *
 * @since 0.1.0
 * @summary Repopulate the cached environment copy.
 *
 * @returns {void}
 */
export function refreshEnvironmentCache() {
  environment = JSON.parse(JSON.stringify(process.env));
}

/**
 * Returns true when the `NODE_ENV` variable is not set, or when it does not equal to
 * `development`. This allows for a 'safe by default' experience.
 *
 * @since 0.1.0
 *
 * @returns {boolean}
 */
export function isProduction() {
  return environment.NODE_ENV !== "development";
}

/**
 * Returns true when `NODE_ENV` is explicitly set to 'development' or when the
 * environment variable `IS_STAGING` is explicitly set to 'true'.
 *
 * @since 0.1.0
 *
 * @returns {boolean}
 */
export function isStaging() {
  return (
    environment.NODE_ENV === "development" || environment.IS_STAGING === "true"
  );
}
