/**
 * Error to be used when a path is not found
 */
class NotFoundError extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Middleware that sets a 404 and throws a NotFoundError
 */
const notFoundHandler = () => async (ctx, next) => {
  await next();
  ctx.status = ctx.status || 404;
  if (ctx.status === 404) {
    throw new NotFoundError();
  }
};

module.exports = {
  NotFoundError,
  notFoundHandler,
};
