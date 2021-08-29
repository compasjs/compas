/**
 * @typedef {import("koa").Middleware} Middleware
 */
/**
 * Session middleware. Requires process.env.APP_KEYS to be set. To generate a key use
 * something like:
 * `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
 * This also accepts the session store as provided by `@compas/store`.
 *
 * @since 0.1.0
 *
 * @param {import("../app").KoaApplication} app
 * @param {Partial<koaSession.opts>} opts KoaSession options
 * @returns {Middleware}
 */
export function session(app: import("../app").KoaApplication, opts: Partial<koaSession.opts>): Middleware;
export type Middleware = import("koa").Middleware;
import koaSession from "koa-session";
//# sourceMappingURL=session.d.ts.map