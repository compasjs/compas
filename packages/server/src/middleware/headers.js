import cors from "koa2-cors";

const noop = () => {};

/**
 * TODO: Replace with custom code calling Helmet, and custom cors implementation
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
  const corsExec = cors(opts.cors);

  return async (ctx, next) => {
    // At the moment, both do not rely on next, so just use a noop
    ctx.set(standardHeaders);
    await corsExec(ctx, noop);

    return next();
  };
};
