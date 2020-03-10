import { cors } from "./cors.js";

/**
 * @param {Object} [opts=]
 * @param {Object=} opts.cors Cors configuration see koa2-cors
 */
export const defaultHeaders = (opts = {}) => {
  // Excerpt from default helmet headers
  // When serving static files, some extra headers should be added
  // See: https://helmetjs.github.io/docs/
  const standardHeaders = {
    "X-DNS-Prefetch-Control": "off",
    "Strict-Transport-Security": "max-age=5184000; includeSubDomains", // 60 day default
  };
  const corsOptions = opts.cors || {};
  corsOptions.returnNext = false;
  const corsExec = cors(opts.cors);

  return (ctx, next) => {
    ctx.set(standardHeaders);
    corsExec(ctx);

    return next();
  };
};
