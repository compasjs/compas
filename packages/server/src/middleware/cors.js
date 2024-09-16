import { environment, isStaging } from "@compas/stdlib";

/*
 Original copy from: https://github.com/zadzbw/koa2-cors/commit/45b6de0de6c4816b93d49335490b81995d450191

 MIT License

 Copyright (c) 2020 -      Dirk de Visser
 Copyright (c) 2016 - 2020 朱博文
 Copyright (c) 2015 - 2016 koajs and other contributors

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

const defaultOptions = {
  allowMethods: ["GET", "PUT", "POST", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  credentials: true,
  exposeHeaders: [],
};

/**
 * CORS middleware for koa2
 *
 * @param {import("../app.js").CorsOptions} [options]
 * @returns {Function}
 */
export function cors(options = {}) {
  const opts = Object.assign({}, defaultOptions, options);

  if (Array.isArray(opts.exposeHeaders)) {
    // @ts-ignore
    opts.exposeHeaders = opts.exposeHeaders.join(",");
  }

  if (Array.isArray(opts.allowHeaders)) {
    opts.allowHeaders = opts.allowHeaders.join(",");
  }

  if (Array.isArray(opts.allowMethods)) {
    // @ts-ignore
    opts.allowMethods = opts.allowMethods.join(",");
  }

  if (opts.maxAge) {
    opts.maxAge = String(opts.maxAge);
  }

  let originFn = (ctx) => options.origin || ctx.get("origin") || "*";
  if (typeof options.origin === "function") {
    originFn = options.origin;
  } else if (
    environment.CORS_URL !== undefined &&
    environment.CORS_URL.length > 0
  ) {
    // Use CORS_URL array provided via environment variables
    const allowedOrigins = (environment.CORS_URL || "").split(",");
    const localhostRegex = /^http:\/\/localhost:\d{1,6}$/i;

    if (isStaging()) {
      // Allow all localhost origins
      originFn = (ctx) => {
        const header = ctx.get("origin");
        if (allowedOrigins.indexOf(header) !== -1) {
          return header;
        }

        if (localhostRegex.test(header)) {
          return header;
        }

        return undefined;
      };
    } else {
      originFn = (ctx) => {
        const header = ctx.get("origin");
        if (allowedOrigins.indexOf(header) !== -1) {
          return header;
        }
        return undefined;
      };
    }
  }

  return (ctx, next) => {
    // always set vary Origin Header
    // https://github.com/rs/cors/issues/10
    ctx.vary("Origin");

    const origin = originFn(ctx);
    if (!origin) {
      return next();
    }

    if (ctx.method === "OPTIONS") {
      // Preflight Request
      if (!ctx.get("Access-Control-Request-Method")) {
        // Invalid request, skip directly
        return next();
      }

      ctx.set("Access-Control-Allow-Origin", origin);

      if (opts.maxAge) {
        ctx.set("Access-Control-Max-Age", opts.maxAge);
      }

      if (opts.credentials === true) {
        ctx.set("Access-Control-Allow-Credentials", "true");
      }

      if (opts.allowMethods) {
        ctx.set("Access-Control-Allow-Methods", opts.allowMethods);
      }

      if (opts.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", opts.allowHeaders);
      } else if (ctx.get("Access-Control-Request-Headers")) {
        ctx.set(
          "Access-Control-Allow-Headers",
          ctx.get("Access-Control-Request-Headers"),
        );
      }

      ctx.status = 204; // No Content
    } else {
      // Non OPTIONS request
      ctx.set("Access-Control-Allow-Origin", origin);

      if (opts.credentials === true) {
        if (origin === "*") {
          // `credentials` can't be true when the `origin` is set to `*`
          ctx.remove("Access-Control-Allow-Credentials");
        } else {
          ctx.set("Access-Control-Allow-Credentials", "true");
        }
      }

      if (opts.exposeHeaders) {
        ctx.set("Access-Control-Expose-Headers", opts.exposeHeaders);
      }

      return next();
    }
  };
}
