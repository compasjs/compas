import { createReadStream } from "fs";
import Koa from "koa";
import {
  DefaultHeaders,
  defaultHeaders,
  errorHandler,
  ErrorHandler,
  healthHandler,
  logMiddleware,
  notFoundHandler,
} from "./middleware";
import { AppState } from "./types";

export interface AppOpts {
  /**
   * Let koa know it's behind a proxy
   */
  proxy?: true;
  /**
   * Disables helmet and cors
   */
  disableHeaders?: true;
  /**
   * Helmet and cors optiosn
   */
  headers?: DefaultHeaders;
  /**
   * Custom error handler, when it returns true. The lbu provided error handling will not run
   */
  onError?: ErrorHandler;
  /**
   * Enables a simple route on /_health to just check if the server is alive
   */
  enableHealthRoute?: true;
}

export function getApp({
  proxy,
  disableHeaders,
  headers,
  onError,
  enableHealthRoute,
}: AppOpts): Koa<AppState> {
  const app = new Koa<AppState>();

  app.proxy = proxy ?? false;

  if (enableHealthRoute) {
    app.use(healthHandler());
  }

  app.use(logMiddleware());
  app.use(errorHandler(onError));
  app.use(notFoundHandler());

  if (!disableHeaders) {
    app.use(defaultHeaders(headers ?? {}));
  }

  app.use((ctx, next) => {
    const url = ctx.path;

    switch (url) {
      case "/text":
        ctx.status = 200;
        ctx.body = "Hello world!";
        break;
      case "/json":
        ctx.status = 200;
        ctx.body = { foo: "Bar" };
        break;
      case "/buffer":
        ctx.status = 200;
        ctx.body = Buffer.from("Hello world!");
        break;
      case "/stream":
        ctx.status = 200;
        ctx.body = createReadStream("./package.json");
        break;
      case "/err":
        throw new Error("foo");
    }

    return next();
  });

  return app;
}
