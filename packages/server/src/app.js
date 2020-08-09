import { isProduction } from "@lbu/stdlib";
import Koa from "koa";
import {
  defaultHeaders,
  errorHandler,
  healthHandler,
  logMiddleware,
  notFoundHandler,
} from "./middleware/index.js";

/**
 * @param {GetAppOptions} [opts]
 */
export function getApp(opts = {}) {
  const app = new Koa();
  app.proxy = opts.proxy === undefined ? isProduction() : opts.proxy;

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
