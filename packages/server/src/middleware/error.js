import { AppError, isNil, isStaging } from "@lbu/stdlib";

/**
 * @type CustomErrorHandler
 * Default onError handler that doesn't handle anything
 */
const defaultOnError = () => false;

/**
 * @type AppErrorHandler
 * Default onAppError handler that builds a simple object with key, message and info.
 */
const defaultOnAppError = (ctx, key, info) => ({ key, message: key, info });

/**
 * Handle any upstream errors
 *
 * @param {ErrorHandlerOptions} opts
 * @returns {function(...[*]=)}
 */
export function errorHandler({ onAppError, onError, leakError }) {
  onAppError = onAppError || defaultOnAppError;
  onError = onError || defaultOnError;
  leakError = leakError === true || (leakError === undefined && isStaging());

  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
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
      ctx.body = onAppError(ctx, err.key, err.info);

      const formatted = AppError.format(error);
      log({
        type: "API_ERROR",
        ...formatted,
      });

      if (!isNil(err.originalError) && leakError) {
        ctx.body.info = ctx.body.info || {};
        ctx.body.info._error = formatted;
      }
    }
  };
}
