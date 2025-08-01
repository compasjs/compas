import { Transform } from "node:stream";
import {
  _compasSentryExport,
  AppError,
  eventStart,
  eventStop,
  isNil,
  newEvent,
  newLogger,
  uuid,
} from "@compas/stdlib";

/**
 * @typedef {object} LogOptions
 * @property {boolean|undefined} [disableRootEvent]
 * @property {{
 *     includeEventName?: boolean,
 *     includePath?: boolean,
 *     includeValidatedParams?: boolean,
 *     includeValidatedQuery?: boolean,
 *   }|undefined} [requestInformation]
 */

/**
 * Log basic request and response information
 *
 * @param {import("koa")} app
 * @param {LogOptions} options
 */
export function logMiddleware(app, options) {
  const requestInformation = options.requestInformation ?? {
    includePath: true,
    includeEventName: true,
    includeValidatedParams: true,
    includeValidatedQuery: true,
  };

  /**
   * Real log function
   *
   * @param ctx
   * @param {bigint} startTime
   * @param {number} length
   */
  function logInfoAndEndTrace(ctx, startTime, length) {
    const duration = Math.round(
      Number(process.hrtime.bigint() - startTime) / 1000000,
    );

    const request = {
      length: Number(ctx.get("Content-Length") || "0"),
    };

    if (requestInformation.includePath) {
      request.method = ctx.method;
      request.path = ctx.path;
    }

    if (requestInformation.includeEventName && ctx.event?.name) {
      request.eventName = ctx.event.name;
    }

    if (requestInformation.includeValidatedParams && ctx.validatedParams) {
      request.params = ctx.validatedParams;
    }

    if (requestInformation.includeValidatedQuery && ctx.validatedQuery) {
      request.query = ctx.validatedQuery;
    }

    ctx.log.info({
      request,
      response: {
        duration,
        length,
        status: ctx.status,
      },
    });

    // Skip eventStop if we don't have events enabled.
    // Skip eventStop for CORS requests, this gives a bit cleaner logs.
    if (
      options.disableRootEvent !== true &&
      ctx.method !== "OPTIONS" &&
      ctx.method !== "HEAD"
    ) {
      if (_compasSentryExport) {
        const span = _compasSentryExport.getActiveSpan();
        if (span) {
          span.updateName(ctx.event.name);
        }
      }

      eventStop(ctx.event);
    }

    if (_compasSentryExport) {
      const span = _compasSentryExport.getActiveSpan();
      const routeName = ctx.event.name;
      const isMatchedRoute = routeName.startsWith("router.");

      if (span) {
        if (!isMatchedRoute) {
          // Discard sampled spans which don't match a route.
          _compasSentryExport.setExtra("_compas.skip-event", true);
        }

        span.setStatus(
          _compasSentryExport.getSpanStatusFromHttpCode(ctx.status),
        );
        span.setAttributes({
          "http.query": ctx.validatedQuery,
          "http.response.status_code": ctx.status,
          "http.response.content_length": length,
        });
        span.end();
      }
    }
  }

  // Log stream errors after the headers are sent
  const logger = newLogger({
    ctx: {
      type: "http-error",
    },
  });
  app.on("error", (error, ctx) => {
    (ctx?.log ?? logger).info({
      type: "http-error",
      headerSent: error.headerSent,
      syscall: error.syscall,
      error: AppError.format(error),
    });
  });

  return async (ctx, next) => {
    const startTime = process.hrtime.bigint();
    const requestId = uuid();
    ctx.requestId = requestId;
    ctx.log = newLogger({
      ctx: {
        type: "http",
        requestId,
      },
    });

    if (options.disableRootEvent !== true) {
      ctx.event = newEvent(ctx.log);
      eventStart(ctx.event, `${ctx.method}.${ctx.path}`);
    }

    await next();

    let counter;

    let responseLength = undefined;
    try {
      responseLength = ctx.response.length;
    } catch {
      // May throw on circular objects
    }

    if (!isNil(responseLength)) {
      logInfoAndEndTrace(ctx, startTime, responseLength);
      return;
    } else if (ctx.body && ctx.body.readable) {
      const body = ctx.body; // The original s3Stream
      counter = new StreamLength();

      // A cleanup function to remove all listeners we're about to add.
      const cleanup = () => {
        body.removeListener("error", onError);
        counter.removeListener("error", onError);
        counter.removeListener("finish", onFinish);
        counter.removeListener("close", onClose);
      };

      const onError = (err) => {
        // If either stream has an error, destroy the other.
        if (!body.destroyed) body.destroy();
        if (!counter.destroyed) counter.destroy(err); // Pass error to propagate
        cleanup();
      };

      const onFinish = () => {
        // Cleanup listeners to prevent listener leaks.
        cleanup();
      };

      const onClose = () => {
        // This handles the client abort. The counter was closed prematurely.
        // We must destroy the source and clean up.
        if (!body.destroyed) {
          body.destroy();
        }
        cleanup();
      };

      // Attach all the listeners
      body.on("error", onError);
      counter.on("error", onError);
      counter.on("finish", onFinish);
      counter.on("close", onClose);

      ctx.body = body.pipe(counter);
      await bodyCloseOrFinish(ctx);
    }

    logInfoAndEndTrace(ctx, startTime, isNil(counter) ? 0 : counter.length);
  };
}

/**
 * Get the size of data that goes through a stream
 */
class StreamLength extends Transform {
  constructor() {
    super();
    this.length = 0;
  }

  _transform(chunk, encoding, callback) {
    this.length += chunk.length;
    this.push(chunk, encoding);
    callback();
  }
}

/**
 * Wait for the ctx.body stream to finish before resolving
 *
 * @param ctx
 * @returns {Promise<void>}
 */
function bodyCloseOrFinish(ctx) {
  return new Promise((resolve) => {
    const onFinish = done.bind(null);
    const onClose = done.bind(null);

    ctx.body.once("finish", onFinish);
    ctx.body.once("close", onClose);

    function done() {
      ctx.body.removeListener("finish", onFinish);
      ctx.body.removeListener("close", onClose);
      resolve();
    }
  });
}
