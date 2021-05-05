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
 * @returns {Application}
 */
export function getApp(opts = {}) {
  const app = new Koa();
  app.proxy = opts.proxy === undefined ? isProduction() : opts.proxy;

  if (opts.disableHealthRoute !== true) {
    app.use(healthHandler());
  }

  app.use(logMiddleware(opts.logOptions ?? {}));
  app.use(errorHandler(opts.errorOptions || {}));
  app.use(notFoundHandler());

  if (opts.disableHeaders !== true) {
    app.use(defaultHeaders(opts.headers));
  }

  return app;
}
