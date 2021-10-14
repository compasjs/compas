import { AppError, isStaging } from "@compas/stdlib";

/**
 * @typedef {import("../app").ErrorHandlerOptions} ErrorHandlerOptions
 */

/**
 * @type {NonNullable<ErrorHandlerOptions["onError"]>}
 * Default onError handler that doesn't handle anything
 */
const defaultOnError = () => false;

/**
 * @type {NonNullable<ErrorHandlerOptions["onAppError"]>}
 * Default onAppError handler that builds a simple object with key, message and info.
 */
const defaultOnAppError = (ctx, key, info) => ({ key, message: key, info });

/**
 * Handle any upstream errors
 *
 * @param {ErrorHandlerOptions} opts
 * @returns {Middleware}
 */
export function errorHandler(opts) {
  const onAppError = opts.onAppError ?? defaultOnAppError;
  const onError = opts.onError ?? defaultOnError;
  const leakError =
    opts.leakError === true || (opts.leakError === undefined && isStaging());

  return async (ctx, next) => {
    try {
      await next();
    } catch (/** @type {any} */ error) {
      if (onError(ctx, error)) {
        return;
      }

      let err = error;
      let log = ctx.log.info;

      if (!AppError.instanceOf(error)) {
        log = ctx.log.error;
        err = new AppError("error.server.internal", 500, {}, error);
      }

      ctx.status = err.status;

      const formatted = AppError.format(err);
      formatted.type = "api_error";
      log(formatted);

      if (leakError && onAppError === defaultOnAppError) {
        ctx.body = formatted;
      } else {
        ctx.body = onAppError(ctx, err.key, err.info);
      }
    }
  };
}
