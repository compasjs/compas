import { isNil } from "@lbu/stdlib";

/**
 * AppErrors represent errors, that should immediately stop the request and return a
 * status and other meta data directly
 */
export class AppError extends Error {
  constructor(key, status, info, originalError) {
    super();

    this.key = key || "error.server.internal";
    this.status = status || 500;
    this.info = info || {};
    this.originalError = originalError;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(info = {}, error = undefined) {
    return new AppError("error.server.notFound", 404, info, error);
  }

  static notImplemented(info = {}, error = undefined) {
    return new AppError("error.server.notImplemented", 405, info, error);
  }

  static serverError(info = {}, error = undefined) {
    return new AppError("error.server.internal", 500, info, error);
  }
}

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
 * @param {Object} info
 * @returns {Object} The any data extracted from the key
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
 * @typedef {Object} ErrorHandlerOptions
 * @property {AppErrorHandler} [onAppError] Called to set the initial body when the
 *   error is an AppError
 * @property {CustomErrorHandler} [onError] Called before all others to let the user
 *   handle their own errors
 * @property {boolean} [leakError=false] Useful on development and staging environments to
 *   just dump the error to the consumer
 */

/**
 * Handle any upstream errors
 * @param {ErrorHandlerOptions} opts
 * @returns {function(...[*]=)}
 */
export const errorHandler = ({ onAppError, onError, leakError }) => {
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

      log({
        type: "API_ERROR",
        status: err.status,
        key: err.key,
        info: err.info,
        originalError: err.originalError,
      });

      if (!isNil(err.originalError) && leakError) {
        ctx.body.info = ctx.body.info || {};
        ctx.body.info._error = {
          name: err.originalError.name,
          message: err.originalError.message,
          stack: err.originalError.stack,
        };
      }
    }
  };
};
