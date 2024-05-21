import { _compasSentryExport, isNil, uuid } from "@compas/stdlib";

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

    const traceHeader = ctx.request.get("sentry-trace");
    /** @type {any} */
    const traceParentData =
      _compasSentryExport.extractTraceparentData(traceHeader) ?? {};

    // Use a manual span, so we can end it right after the body is send.
    return _compasSentryExport.startSpanManual(
      {
        // Force a new trace for every request. This keeps the traces view usable.
        traceId: uuid().replace(/-/g, ""),
        ...traceParentData,
        spanId: uuid().replace(/-/g, "").slice(16),
        forceTransaction: isNil(traceParentData.parentSpanId),

        op: "http.server",
        name: "http",
        description: "http",
        attributes: {
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
