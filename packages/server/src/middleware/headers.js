const koaHelmet = require("koa-helmet");
const cors = require("koa2-cors");

const noop = () => {};

/**
 * TODO: Replace with custom code calling Helmet, and custom cors implementation
 * @param {Object} [opts=]
 * @param {Object=} opts.helmet Helmet configuration see koa-helmet
 * @param {Object=} opts.cors Cors configuration see koa2-cors
 */
const defaultHeaders = (opts = {}) => {
  const helmetExec = koaHelmet(opts.helmet);
  const corsExec = cors(opts.cors);

  return async (ctx, next) => {
    // At the moment, both do not rely on next, so just use a noop
    await helmetExec(ctx, noop);
    await corsExec(ctx, noop);

    return next();
  };
};

module.exports = {
  defaultHeaders,
};
