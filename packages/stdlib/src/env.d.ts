/**
 * This should only be necessary when you or a package mutates the environment variables.
 * The `mainFn` / `mainTestFn` / `mainBenchFn` / ... will call this function by default
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
export function refreshEnvironmentCache(): void;
/**
 * Returns true when the `NODE_ENV` variable is not set, or when it does not equal to
 * `development`. This allows for a 'safe by default' experience.
 *
 * @since 0.1.0
 *
 * @returns {boolean}
 */
export function isProduction(): boolean;
/**
 * Returns true when `NODE_ENV` is explicitly set to 'development' or when the
 * environment variable `IS_STAGING` is explicitly set to 'true'.
 *
 * @since 0.1.0
 *
 * @returns {boolean}
 */
export function isStaging(): boolean;
/**
 * Try to calculate the CORS_URL environment variable from the APP_URL environment
 * variable. Assumes the APP_URL is in the following format: http(s)://api.xxx.xx.com and
 * generates the following CORS_URL value: http(s)://xxx.xx.com.
 * If the APP_URL host only contains xxx.com the CORS_URL value will be equivalent.
 *
 * Refreshing the environment cache via `refreshEnvironmentCache` is not necessary.
 *
 * @since 0.1.0
 *
 * @returns {void}
 */
export function calculateCorsUrlFromAppUrl(): void;
/**
 * Try to calculate the COOKIE_URL environment variable from the APP_URL environment
 * variable. Assumes the APP_URL is in the following format: http(s)://api.xxx.xx.com and
 * generates the following COOKIE_URL value: xxx.xx.com.
 * If the APP_URL host only contains xxx.com the CORS_URL value will be equivalent.
 *
 * Refreshing the environment cache via `refreshEnvironmentCache` is not necessary.
 *
 * @since 0.1.0
 *
 * @returns {void}
 */
export function calculateCookieUrlFromAppUrl(): void;
/**
 * Cached process.env
 *
 * @type {Record<string, string>}
 */
export let environment: Record<string, string>;
//# sourceMappingURL=env.d.ts.map