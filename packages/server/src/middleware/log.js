import { Transform } from "stream";
import {
  AppError,
  eventStart,
  eventStop,
  isNil,
  newEvent,
  newLogger,
  uuid,
} from "@compas/stdlib";

/**
 * Log basic request and response information
 *
 * @param {import("koa")} app
 * @param {{ disableRootEvent?: boolean }} options
 */
export function logMiddleware(app, options) {
  /**
   * Real log function
   *
   * @param ctx
   * @param {bigint} startTime
   * @param {number} length
   */
  function logInfo(ctx, startTime, length) {
    const duration = Math.round(
      Number(process.hrtime.bigint() - startTime) / 1000000,
    );

    ctx.log.info({
      request: {
        method: ctx.method,
        path: ctx.path,
        length: Number(ctx.get("Content-Length") || "0"),
      },
      response: {
        duration,
        length,
        status: ctx.status,
      },
    });

    // Skip eventStop if we don't have events enabled.
    // Skip eventStop for CORS requests, this gives a bit cleaner logs.
    if (options.disableRootEvent !== true && ctx.method !== "OPTIONS") {
      eventStop(ctx.event);
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
    ctx.log = newLogger({
      ctx: {
        type: "http",
        requestId: uuid(),
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
      logInfo(ctx, startTime, responseLength);
      return;
    } else if (ctx.body && ctx.body.readable) {
      const body = ctx.body;
      counter = new StreamLength();
      ctx.body = body.pipe(counter).on("error", ctx.onerror);
      await bodyCloseOrFinish(ctx);
    }

    logInfo(ctx, startTime, isNil(counter) ? 0 : counter.length);
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
    const onFinish = done.bind(null, "finish");
    const onClose = done.bind(null, "close");

    ctx.body.once("finish", onFinish);
    ctx.body.once("close", onClose);

    function done() {
      ctx.body.removeListener("finish", onFinish);
      ctx.body.removeListener("close", onClose);
      resolve();
    }
  });
}
