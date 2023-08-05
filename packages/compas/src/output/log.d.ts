/**
 * Set the logger.
 *
 * @param {import("@compas/stdlib").Logger} setLogger
 */
export function loggerEnable(setLogger: import("@compas/stdlib").Logger): void;
/**
 * This is not used in the dev mode, but should be used in production and CI
 * environments.
 *
 * Note that a 'noop' logger is used as long as {@link loggerEnable} is not called.
 *
 * @type {import("@compas/stdlib").Logger}
 */
export let logger: import("@compas/stdlib").Logger;
//# sourceMappingURL=log.d.ts.map
