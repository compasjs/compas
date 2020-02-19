const Koa = require("koa");
const {
  errorHandler,
  healthHandler,
  notFoundHandler,
  logMiddleware,
  defaultHeaders,
} = require("./middleware");

/**
 * Create a new Koa instance with some default middleware
 * @param {Object=} opts
 * @param {boolean} [opts.proxy=false]
 * @param {boolean} [opts.disableHeaders=false]
 * @param {boolean} [opts.enableHealthRoute=true]
 * @param {KoaErrorHandler=} opts.onError
 * @param {Object} opts.headers Argument for defaultHeaders middleware
 */
const getApp = (opts = {}) => {
  const app = new Koa();
  app.proxy = opts.proxy === true;

  if (opts.enableHealthRoute !== false) {
    app.use(healthHandler());
  }

  app.use(logMiddleware());
  app.use(errorHandler(opts.onError));
  app.use(notFoundHandler());

  if (!opts.disableHeaders) {
    app.use(defaultHeaders(opts.headers));
  }

  return app;
};

module.exports = {
  getApp,
};
