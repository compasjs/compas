import { AppError } from "./error.js";

/**
 * Middleware that sets a 404 and throws a NotFoundError
 */
export const notFoundHandler = () => async (ctx, next) => {
  await next();
  ctx.status = ctx.status || 404;
  if (ctx.status === 404) {
    throw AppError.notFound();
  }
};
