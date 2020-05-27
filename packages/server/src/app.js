import Koa from "koa";
import {
  defaultHeaders,
  errorHandler,
  healthHandler,
  logMiddleware,
  notFoundHandler,
} from "./middleware/index.js";

/**
 * Create a new Koa instance with some default middleware
 *
 * @param {Object=} opts
 * @param {boolean} [opts.proxy] Trust proxy headers
 * @param {boolean} [opts.disableHeaders] Don't handle cors headers
 * @param {boolean} [opts.disableHealthRoute] Disable GET /_health
 * @param {ErrorHandlerOptions} [opts.errorOptions] Flexible error handling options
 * @param {Object} opts.headers Argument for defaultHeaders middleware
 * @param {CorsOptions} opts.headers.cors Argument for defaultHeaders middleware
 */
export function getApp(opts = {}) {
  const app = new Koa();
  app.proxy =
    opts.proxy === undefined
      ? process.env.NODE_ENV === "production"
      : opts.proxy;

  if (opts.disableHealthRoute !== true) {
    app.use(healthHandler());
  }

  app.use(logMiddleware());
  app.use(errorHandler(opts.errorOptions || {}));
  app.use(notFoundHandler());

  if (opts.disableHeaders !== true) {
    app.use(defaultHeaders(opts.headers));
  }

  return app;
}
