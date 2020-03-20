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
 * @param {Object=} opts
 * @param {boolean} [opts.proxy]
 * @param {boolean} [opts.disableHeaders]
 * @param {boolean} [opts.disableHealthRoute]
 * @param {ErrorHandlerOptions} [opts.errorOptions]
 * @param {Object} opts.headers Argument for defaultHeaders middleware
 * @param {CorsOptions} opts.headers.cors Argument for defaultHeaders middleware
 */
export const getApp = (opts = {}) => {
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
};
