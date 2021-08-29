/**
 * @typedef {import("koa").Middleware} Middleware
 */
/**
 * Compose `middleware` returning of all those which are passed.
 *
 * @since 0.1.0
 *
 * @param {Middleware[]} middleware
 * @returns {Middleware}
 */
export function compose(middleware: Middleware[]): Middleware;
export type Middleware = import("koa").Middleware;
//# sourceMappingURL=compose.d.ts.map