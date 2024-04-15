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

  return async (ctx, next) => {
    let traceParentData = {
      forceTransaction: true,
    };
    if (ctx.request.get("sentry-trace")) {
      // @ts-expect-error
      traceParentData = _compasSentryExport.extractTraceparentData(
        ctx.request.get("sentry-trace"),
      );
    }

    // @ts-expect-error
    return await _compasSentryExport.startSpanManual(
      {
        op: "http.server",
        name: "http",
        description: "http",
        ...traceParentData,
        data: {
          "http.request.method": ctx.method,
          "http.request.url": ctx.url,
        },
      },
      async () => {
        return await next();
      },
    );
  };
}
