import { AppError } from "./error.js";

/**
 * The Sentry version that all Compas packages use if set via {@link compasWithSentry}.
 *
 * @type {undefined|typeof import("@sentry/node")}
 */
export let _compasSentryExport = undefined;

/**
 * Let Compas enrich what Sentry already instruments. Requires `@sentry/node` v11 or
 * higher. Sentry owns the request and query spans, Compas adds the parts that only it
 * knows about:
 *
 * - Server: names the `http.server` span after the matched route of the generated
 *   router, for example `GET /user/:id`, and sets `http.route` and `compas.route`.
 *   Unknown errors and `AppError.serverError`'s from the error handler are captured.
 * - Store: each job handled by the QueueWorker gets its own root span with a
 *   `queue.process` op. Handler errors are captured.
 * - Stdlib: errors that reach the handlers installed by `mainFn` are captured, and
 *   Sentry is flushed before the process exits.
 *
 * Call `Sentry.init()` and this function before creating a Postgres connection via
 * `newPostgresConnection` or `createTestPostgresDatabase`. `@compas/store` imports
 * `postgres` lazily, so Sentry's default `postgresJsIntegration` can instrument it
 * without any `node` loader flags. An application that imports `postgres` itself
 * before `Sentry.init()` won't get query spans.
 *
 * Logs are not sent to Sentry by default. Add `Sentry.pinoIntegration()` to the
 * integrations to ship all Compas logs. String messages are used as the log body,
 * structured messages get 'See attributes' as body and are searchable via the
 * `message` attribute.
 *
 * Configure `Sentry.koaIntegration()` to ignore middleware layers. Otherwise, each
 * middleware added by `getApp` shows up as a nested, unnamed 'middleware' span if Koa
 * happens to be imported after `Sentry.init()`.
 *
 * Sentry v11 sends spans while the request is still running, so requests can't be
 * dropped based on their response or matched route. Use `tracesSampler` instead. If a
 * custom list of `allowHeaders` is provided in the CORS options, 'sentry-trace' and
 * 'baggage' should be allowed as well.
 *
 * @example
 *   import * as Sentry from "@sentry/node";
 *
 *   mainFn(import.meta, async (logger) => {
 *     Sentry.init({
 *       dsn: environment.SENTRY_DSN,
 *       tracesSampler: ({ attributes, inheritOrSampleWith }) => {
 *         if (
 *           attributes?.["url.path"] === "/_health" ||
 *           attributes?.["http.request.method"] === "OPTIONS" ||
 *           attributes?.["http.request.method"] === "HEAD"
 *         ) {
 *           return 0;
 *         }
 *
 *         return inheritOrSampleWith(0.1);
 *       },
 *
 *       // Include the custom AppError properties with captured errors.
 *       normalizeDepth: 0,
 *       integrations: [
 *         Sentry.extraErrorDataIntegration({ depth: 30 }),
 *         Sentry.koaIntegration({ ignoreLayersType: ["middleware"] }),
 *
 *         // Optional, ship all logs to Sentry.
 *         Sentry.pinoIntegration(),
 *       ],
 *     });
 *     compasWithSentry(Sentry);
 *
 *     const sql = await newPostgresConnection();
 *     // ...
 *   });
 * @param {typeof import("@sentry/node")} instance
 * @returns {void}
 */
export function compasWithSentry(instance) {
  const major = Number(instance?.SDK_VERSION?.split(".")[0]);
  if (!(major >= 11)) {
    throw AppError.serverError({
      message: "Compas requires @sentry/node v11 or higher.",
      version: instance?.SDK_VERSION,
    });
  }

  _compasSentryExport = instance;
}
