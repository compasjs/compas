import { AppError } from "@compas/stdlib";

/**
 * Middleware that sets a 404 and throws a NotFoundError
 */
export function notFoundHandler() {
  return async (ctx, next) => {
    await next();
    ctx.status = ctx.status || 404;
    if (ctx.status === 404) {
      throw AppError.notFound();
    }
  };
}
