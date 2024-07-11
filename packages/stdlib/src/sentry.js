/**
 * The Sentry version that all Compas packages use if set via {@link compasWithSentry}.
 *
 * @type {undefined|import("@sentry/node")}
 */
export let _compasSentryExport = undefined;

/**
 * Send queries executed via `query` from @compas/store as a sentry span.
 *
 * @type {boolean}
 */
export let _compasSentryEnableQuerySpans = false;

/**
 * Enable Sentry support. This comes with the following changes:
 *
 * Stdlib:
 * - Logger: both info and error logs are added as breadcrumbs to the current active span.
 * - Event: Events are propagated to Sentry as (inactive) spans.
 *     Meaning that further logs are not necessarily correlated to the correct event.
 *     The final event callstack is not logged.
 *
 * Server:
 * - Starts a new root span for each incoming request.
 * - Tries to name it based on the finalized name of `ctx.event`.
 *     This is most likely in the format `router.foo.bar` for matched routes by the generated router.
 * - Uses the sentry-trace header when provided.
 *     Note that if a custom list of `allowHeaders` is provided in the CORS options,
 *     'sentry-trace' and 'baggage' should be allowed as well.
 * - If the error handler retrieves an unknown or AppError.serverError, it is reported as an uncaught exception.
 *     It is advised to set 'normalizeDepth' to '0' in your Sentry config, and to enable the 'extraErrorDataIntegration' integration.
 *
 * Store:
 * - Starts a new root span for each handled Job in the QueueWorker
 *     The span name is based on the job name. Unhandled errors are captured as exceptions.
 * - Supports passing queries to Sentry as spans. Requires {@link opts.sendQueriesAsSpans} to be set.
 *
 * All:
 * - All error logs in Compas package code are captured as exceptions.
 *
 * @param {import("@sentry/node")} instance
 * @param {{
 *   sendQueriesAsSpans?: boolean
 * }} [opts]
 */
export function compasWithSentry(instance, { sendQueriesAsSpans } = {}) {
  _compasSentryExport = instance;
  _compasSentryEnableQuerySpans = sendQueriesAsSpans ?? false;
}
