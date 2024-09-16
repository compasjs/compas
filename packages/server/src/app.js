import { isProduction } from "@compas/stdlib";
import Koa from "koa";
import { errorHandler } from "./middleware/error.js";
import { defaultHeaders } from "./middleware/headers.js";
import { healthHandler } from "./middleware/health.js";
import { logMiddleware } from "./middleware/log.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { sentry } from "./middleware/sentry.js";

/**
 * @typedef {ReturnType<getApp>} KoaApplication
 */

/**
 * @typedef {object} GetAppOptions
 * @property {boolean|undefined} [proxy] Trust proxy headers, defaults to true in
 *   production.
 * @property {boolean|undefined} [disableHeaders] Skip CORS and Strict Transport Security
 *   headers.
 * @property {boolean|undefined} [disableHealthRoute] Disable GET /_health
 * @property {ErrorHandlerOptions|undefined} [errorOptions] Flexible error handling
 *   options
 * @property {HeaderOptions|undefined} [headers] Argument for defaultHeader middleware.
 *   Can only be completely disabled by setting `disableHeaders`.
 * @property {import("./middleware/log.js").LogOptions|undefined} [logOptions] Pass
 *   custom log options to the log middleware.
 */

/**
 * @typedef {object} ErrorHandlerOptions
 * @property {((
 *     ctx: Koa.Context,
 *     key: string,
 *     info: any
 *   ) => Record<string, any> )| undefined} [onAppError] Called to set the initial body
 *   when the error is an AppError
 * @property {((ctx: Koa.Context, err: Error) => boolean)|undefined} [onError] Called
 *   before any logic, to let the user handle errors. If 'true' is returned, no other
 *   logic is applied.
 */

/**
 * @typedef {object} HeaderOptions
 * @property {CorsOptions|undefined} [cors] CORS options, defaults to empty object.
 */

/**
 * @typedef {object} CorsOptions
 * @property {string|((ctx: Koa.Context) => (string|undefined))} [origin]
 *   'Access-Control-Allow-Origin', defaults to the 'Origin' header.
 * @property {string | Array<string> | undefined} [exposeHeaders] 'Access-Control-Expose-Headers'
 * @property {string|number|undefined} [maxAge] 'Access-Control-Max-Age' in seconds
 * @property {boolean|undefined} [credentials] 'Access-Control-Allow-Credentials'
 * @property {string | Array<string> | undefined} [allowMethods] 'Access-Control-Allow-Methods',
 *   defaults to ["DELETE", "GET", "PUT", "POST", "PATCH", "HEAD", "OPTIONS"]
 * @property {string | Array<string> | undefined} [allowHeaders] 'Access-Control-Allow-Headers'
 */

/**
 * Create a new Koa instance with default middleware applied.
 * Adds the following:
 *
 * - Health check route on `/_health`
 * - Log middleware to add the Logger from @compas/stdlib on `ctx.log`
 * - Error handler to catch any errors thrown by route handlers
 * - A 404 handler when no response is set by other middleware
 * - Default headers to respond to things like CORS requests
 *
 * @since 0.1.0
 * @summary Create a new Koa instance with default middleware applied.
 *
 * @param {GetAppOptions} [opts={}]
 */
export function getApp(opts = {}) {
  const app = new Koa();
  app.proxy = opts.proxy === undefined ? isProduction() : opts.proxy;

  if (opts.disableHealthRoute !== true) {
    app.use(healthHandler());
  }

  app.use(sentry());

  app.use(logMiddleware(app, opts.logOptions ?? {}));
  app.use(errorHandler(opts.errorOptions ?? {}));
  app.use(notFoundHandler());

  if (opts.disableHeaders !== true) {
    app.use(defaultHeaders(opts.headers));
  }

  return app;
}
