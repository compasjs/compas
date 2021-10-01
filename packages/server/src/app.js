import { isProduction } from "@compas/stdlib";
import Koa from "koa";
import {
  defaultHeaders,
  errorHandler,
  healthHandler,
  logMiddleware,
  notFoundHandler,
} from "./middleware/index.js";

/**
 * @typedef {ReturnType<getApp>} KoaApplication
 */

/**
 * @typedef {object} GetAppOptions
 * @property {boolean|undefined} [proxy] Trust proxy headers
 * @property {boolean|undefined} [disableHeaders] Don't handle cors headers
 * @property {boolean|undefined} [disableHealthRoute] Disable GET /_health
 * @property {ErrorHandlerOptions|undefined} [errorOptions] Flexible error handling
 *    options
 * @property {HeaderOptions|undefined} [headers] Argument for defaultHeader middleware
 * @property {{ disableRootEvent?: boolean|undefined }|undefined} [logOptions]
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
 * @property {boolean|undefined} [leakError] Adds the stacktrace and originalError to the
 *    response. Useful on development and staging environments.
 */

/**
 * @typedef {object} HeaderOptions
 * @property {CorsOptions|undefined} [cors]
 */

/**
 * @typedef {object} CorsOptions
 * @property {string|((ctx: Koa.Context) => (string|undefined))} [origin]
 *    'Access-Control-Allow-Origin', defaults to the 'Origin' header.
 * @property {string|string[]|undefined} [exposeHeaders] 'Access-Control-Expose-Headers'
 * @property {string|number|undefined} [maxAge] 'Access-Control-Max-Age' in seconds
 * @property {boolean|undefined} [credentials] 'Access-Control-Allow-Credentials'
 * @property {string|string[]|undefined} [allowMethods] 'Access-Control-Allow-Methods',
 *    defaults to ["DELETE", "GET", "PUT", "POST", "PATCH", "HEAD", "OPTIONS"]
 * @property {string|string[]|undefined} [allowHeaders] 'Access-Control-Allow-Headers'
 */

/**
 * Create a new Koa instance with default middleware applied.
 * Adds the following:
 *
 * - Health check route on `/_health`
 *
 * - Log middleware to add the Logger from @compas/stdlib on `ctx.log`
 *
 * - Error handler to catch any errors thrown by route handlers
 *
 * - A 404 handler when no response is set by other middleware
 *
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

  app.use(logMiddleware(app, opts.logOptions ?? {}));
  app.use(errorHandler(opts.errorOptions ?? {}));
  app.use(notFoundHandler());

  if (opts.disableHeaders !== true) {
    app.use(defaultHeaders(opts.headers));
  }

  return app;
}
