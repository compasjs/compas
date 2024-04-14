/**
 * The Sentry version that all Compas packages use if set via {@link compasWithSentry}.
 *
 * @type {undefined|import("@sentry/node")}
 */
export let _compasSentryExport = undefined;

/**
 * Enable Sentry support. This comes with the following changes:
 *
 * Stdlib:
 * - Logger: both info and error logs are added as breadcrumbs to the current active span.
 * - Event: Events are propagated to Sentry as (inactive) spans.
 *     Meaning that further logs are not necessarily correlated to the correct event.
 *     This can be inferred based on the timeline.
 *
 * Server:
 * - Starts a new root span for each incoming request.
 * - Tries to name it based on the finalized name of `ctx.event`.
 *     This is most likely in the format `router.foo.bar` for matched routes by the generated router.
 * - Uses the sentry-trace header when provided.
 *     Note that if a custom list of `allowHeaders` is provided in the CORS options,
 *     'sentry-trace' and 'baggage' should be allowed as well.
 * - If the error handler retrieves an unknown or AppError.serverError, it is reported as an uncaught exception.
 *     It is advised to set 'maxDepth' to '0' in your Sentry config, and to enable the 'extraErrorDataIntegration' integration.
 *
 * Queue:
 * - Starts a new root span for each handled Job
 * - Names it based on the job name.
 * - Reports unhandled errors as exceptions.
 *
 * All:
 * - Each package that has error logs, will report an exception as well.
 * - Note that we still execute the logs for now. Which may be removed in a future release.
 *
 * @param {import("@sentry/node")} instance
 */
export function compasWithSentry(instance) {
  _compasSentryExport = instance;
}
