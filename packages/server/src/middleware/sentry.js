import { _compasSentryExport } from "@compas/stdlib";

/**
 * Sentry support;
 * - Starts a new root span for each incoming request.
 * - Tries to name it based on the finalized name of `ctx.event`.
 *     This is most likely in the format `router.foo.bar` for matched routes by the
 * generated router.
 * - Uses the sentry-trace header when provided.
 *     Note that if a custom list of `allowHeaders` is provided in the CORS options,
 * 'sentry-trace' and 'baggage' should be allowed as well.
 * - If the error handler retrieves an unknown or AppError.serverError, it is reported as
 * an uncaught exception.
 *
 * @returns {import("koa").Middleware}
 */
export function sentry() {
  if (!_compasSentryExport) {
    return (ctx, next) => {
      return next();
    };
  }

  return (ctx, next) => {
    const method = ctx.method.toLowerCase();
    if (method === "options" || method === "head") {
      return next();
    }

    if (!_compasSentryExport) {
      return next();
    }

    const _sentry = _compasSentryExport;

    return _sentry.startNewTrace(() => {
      return _sentry.startSpanManual(
        {
          op: "http.server",
          name: "http",
          attributes: {
            "http.request.method": ctx.method,
            "http.request.url": ctx.url,
          },
          forceTransaction: true,
        },
        async () => {
          return await next();
        },
      );
    });
  };
}
