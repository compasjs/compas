import { Transform } from "stream";
import { eventStart, eventStop, newEvent, newLogger } from "@lbu/insight";
import { isNil, uuid } from "@lbu/stdlib";

/**
 * Log basic request and response information
 */
export function logMiddleware() {
  return async (ctx, next) => {
    const startTime = process.hrtime.bigint();

    let requestId = ctx.get("x-request-id");
    if (isNil(requestId) || requestId.length === 0) {
      requestId = uuid();
    }
    ctx.set("x-request-id", requestId);

    ctx.log = newLogger({
      ctx: {
        type: "http",
        requestId,
      },
    });
    ctx.event = newEvent(ctx.log);
    eventStart(ctx.event, `${ctx.method}.${ctx.path}`);

    await next();

    let counter;
    if (!isNil(ctx.response.length)) {
      logInfo(ctx, startTime, ctx.response.length);
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

  if (ctx.method !== "OPTIONS") {
    eventStop(ctx.event);
  }
}

/**
 * Wait for the ctx.body stream to finish before resolving
 *
 * @param ctx
 * @returns {Promise<void>}
 */
async function bodyCloseOrFinish(ctx) {
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
