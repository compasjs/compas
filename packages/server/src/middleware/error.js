import { _compasSentryExport, AppError, isProduction } from "@compas/stdlib";

/**
 * @type {NonNullable<import("../app.js").ErrorHandlerOptions["onError"]>}
 * Default onError handler that doesn't handle anything
 */
const defaultOnError = () => false;

/**
 * @type {NonNullable<import("../app.js").ErrorHandlerOptions["onAppError"]>}
 * Default onAppError handler that builds a simple object with key, message and info.
 */
const defaultOnAppError = () => ({});

/**
 * Handle any upstream errors
 *
 * @param {import("../app.js").ErrorHandlerOptions} opts
 * @returns {import("koa").Middleware}
 */
export function errorHandler(opts) {
  const onAppError = opts.onAppError ?? defaultOnAppError;
  const onError = opts.onError ?? defaultOnError;

  return async (ctx, next) => {
    try {
      await next();
    } catch (/** @type {any} */ error) {
      if (onError(ctx, error)) {
        return;
      }

      const origErr = error;
      let err = error;
      let log = ctx.log.info;

      if (!AppError.instanceOf(err)) {
        err = AppError.serverError({}, err);
      }

      const isUnexpectedError = err.status >= 500;

      if (isUnexpectedError) {
        // Upgrade to error logging, developer probably has alerting on error logs.
        log = ctx.log.error;
      }

      if (_compasSentryExport && isUnexpectedError) {
        _compasSentryExport.captureException(origErr);
      }

      ctx.status = err.status;

      const formatted = AppError.format(err);
      formatted.type = "api_error";
      formatted.requestId = ctx.requestId;

      log(formatted);

      if (onAppError === defaultOnAppError) {
        if (isProduction()) {
          // Delete generic internals
          delete formatted.stack;
          delete formatted.cause;

          if (isUnexpectedError) {
            // Remove any possible internal details. In explicit 400's for example, info is useful
            // to the caller.
            delete formatted.info;
          }
        }

        ctx.body = formatted;
      } else {
        ctx.body = onAppError(ctx, err.key, err.info);
      }
    }
  };
}
