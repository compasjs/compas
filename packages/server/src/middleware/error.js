import { NotFoundError } from "./notFound.js";

/**
 * @callback KoaErrorHandler
 * @param ctx Koa Context
 * @param {Error} err
 * @returns {boolean} Return truthy when handled or falsey when skipped
 */

/**
 * Handle any upstream errors
 * @param {KoaErrorHandler} onError
 * @returns {function(...[*]=)}
 */
export const errorHandler = onError => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (onError && onError(ctx, error)) {
      return;
    }

    if (error instanceof NotFoundError) {
      ctx.body = {
        message: "Not found",
      };
    } else {
      ctx.log.error({
        error,
      });
      ctx.status = 500;
      ctx.body = {
        message: "Internal server error",
      };
    }
  }
};
