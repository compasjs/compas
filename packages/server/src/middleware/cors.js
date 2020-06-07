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
};

/**
 * @name CorsOptions
 *
 * @typedef {object}
 * @property {string|function(ctx)} [origin] `Access-Control-Allow-Origin`, default is
 *   request Origin header
 * @property {string[]} [exposeHeaders] `Access-Control-Expose-Headers`
 * @property {string|number} [maxAge] `Access-Control-Max-Age` in seconds
 * @property {boolean} [credentials] `Access-Control-Allow-Credentials`
 * @property {string[]} [allowMethods] `Access-Control-Allow-Methods`,
 *    default is ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
 * @property {string[]} [allowHeaders] `Access-Control-Allow-Headers`
 * @property {boolean} [returnNext] By default, and if false, won't call next, but
 *   just returns undefined
 */

/**
 * CORS middleware for koa2
 *
 * @param {CorsOptions} [options]
 * @returns {Function}
 */
export function cors(options = {}) {
  const opts = Object.assign({}, defaultOptions, options);

  let originFn = (ctx) => options.origin || ctx.get("Origin") || "*";
  if (typeof options.origin === "function") {
    originFn = options.origin;
  }

  // eslint-disable-next-line consistent-return
  return (ctx, next) => {
    const returnValue = opts.returnNext ? next : () => undefined;

    // always set vary Origin Header
    // https://github.com/rs/cors/issues/10
    ctx.vary("Origin");

    const origin = originFn(ctx);
    if (!origin) {
      return returnValue();
    }

    // Access-Control-Allow-Origin
    ctx.set("Access-Control-Allow-Origin", origin);

    if (ctx.method === "OPTIONS") {
      // Preflight Request
      if (!ctx.get("Access-Control-Request-Method")) {
        return returnValue();
      }

      // Access-Control-Max-Age
      if (opts.maxAge) {
        ctx.set("Access-Control-Max-Age", String(opts.maxAge));
      }

      // Access-Control-Allow-Credentials
      if (opts.credentials === true) {
        // When used as part of a response to a preflight request,
        // this indicates whether or not the actual request can be made using credentials.
        ctx.set("Access-Control-Allow-Credentials", "true");
      }

      // Access-Control-Allow-Methods
      if (opts.allowMethods) {
        ctx.set("Access-Control-Allow-Methods", opts.allowMethods.join(","));
      }

      // Access-Control-Allow-Headers
      if (opts.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", opts.allowHeaders.join(","));
      } else {
        ctx.set(
          "Access-Control-Allow-Headers",
          ctx.get("Access-Control-Request-Headers"),
        );
      }

      ctx.status = 204; // No Content
    } else {
      // Request
      // Access-Control-Allow-Credentials
      if (opts.credentials === true) {
        if (origin === "*") {
          // `credentials` can't be true when the `origin` is set to `*`
          ctx.remove("Access-Control-Allow-Credentials");
        } else {
          ctx.set("Access-Control-Allow-Credentials", "true");
        }
      }

      // Access-Control-Expose-Headers
      if (opts.exposeHeaders) {
        ctx.set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
      }

      return returnValue();
    }
  };
}
