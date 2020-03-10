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

/**
 * CORS middleware for koa2
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Array} allowMethods `Access-Control-Allow-Methods`,
 *    default is ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
 *  - {Array} allowHeaders `Access-Control-Allow-Headers`
 * @return {Function}
 * @api public
 */
module.exports = function crossOrigin(options = {}) {
  const defaultOptions = {
    allowMethods: ["GET", "PUT", "POST", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  };

  // set defaultOptions to options
  options = Object.assign({}, defaultOptions, options); // eslint-disable-line no-param-reassign

  // eslint-disable-next-line consistent-return
  return async function cors(ctx, next) {
    // always set vary Origin Header
    // https://github.com/rs/cors/issues/10
    ctx.vary("Origin");

    let origin;
    if (typeof options.origin === "function") {
      origin = options.origin(ctx);
    } else {
      origin = options.origin || ctx.get("Origin") || "*";
    }
    if (!origin) {
      return await next();
    }

    // Access-Control-Allow-Origin
    ctx.set("Access-Control-Allow-Origin", origin);

    if (ctx.method === "OPTIONS") {
      // Preflight Request
      if (!ctx.get("Access-Control-Request-Method")) {
        return await next();
      }

      // Access-Control-Max-Age
      if (options.maxAge) {
        ctx.set("Access-Control-Max-Age", String(options.maxAge));
      }

      // Access-Control-Allow-Credentials
      if (options.credentials === true) {
        // When used as part of a response to a preflight request,
        // this indicates whether or not the actual request can be made using credentials.
        ctx.set("Access-Control-Allow-Credentials", "true");
      }

      // Access-Control-Allow-Methods
      if (options.allowMethods) {
        ctx.set("Access-Control-Allow-Methods", options.allowMethods.join(","));
      }

      // Access-Control-Allow-Headers
      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
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
      if (options.credentials === true) {
        if (origin === "*") {
          // `credentials` can't be true when the `origin` is set to `*`
          ctx.remove("Access-Control-Allow-Credentials");
        } else {
          ctx.set("Access-Control-Allow-Credentials", "true");
        }
      }

      // Access-Control-Expose-Headers
      if (options.exposeHeaders) {
        ctx.set(
          "Access-Control-Expose-Headers",
          options.exposeHeaders.join(","),
        );
      }

      try {
        await next();
      } catch (err) {
        throw err;
      }
    }
  };
};
