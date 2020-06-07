import { AppError, isNil } from "@lbu/stdlib";

/**
 * @callback CustomErrorHandler
 * @param ctx Koa Context
 * @param {Error} err
 * @returns {boolean} Return truthy when handled or falsey when skipped
 */

/**
 * @callback AppErrorHandler
 * @param ctx Koa Context
 * @param {string} key
 * @param {object} info
 * @returns {object} The any data extracted from the key
 */

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
 * @name ErrorHandlerOptions
 *
 * @typedef {object}
 * @property {AppErrorHandler} [onAppError] Called to set the initial body when the
 *   error is an AppError
 * @property {CustomErrorHandler} [onError] Called before all others to let the user
 *   handle their own errors
 * @property {boolean} [leakError] Useful on development and staging environments to
 *   just dump the error to the consumer
 */

/**
 * Handle any upstream errors
 *
 * @param {ErrorHandlerOptions} opts
 * @returns {function(...[*]=)}
 */
export function errorHandler({ onAppError, onError, leakError }) {
  onAppError = onAppError || defaultOnAppError;
  onError = onError || defaultOnError;
  leakError = leakError === true;

  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (onError(ctx, error)) {
        return;
      }

      let err = error;
      let log = ctx.log.info;

      if (!(error instanceof AppError)) {
        log = ctx.log.error;
        err = new AppError("error.server.internal", 500, {}, error);
      }

      ctx.status = err.status;
      ctx.body = onAppError(ctx, err.key, err.info);

      let originalError = undefined;
      if (err.originalError) {
        originalError = {
          name: err.originalError.name,
          message: err.originalError.message,
          stack: err.originalError.stack.split("\n"),
        };
      }

      log({
        type: "API_ERROR",
        status: err.status,
        key: err.key,
        info: err.info,
        originalError,
      });

      if (!isNil(err.originalError) && leakError) {
        ctx.body.info = ctx.body.info || {};
        ctx.body.info._error = originalError;
      }
    }
  };
}
