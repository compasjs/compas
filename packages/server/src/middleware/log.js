import { bindLoggerContext, newLogger } from "@lbu/insight";
import { isNil, uuid } from "@lbu/stdlib";
import { Transform } from "stream";

/**
 * Log basic request and response information
 */
export function logMiddleware() {
  const logger = newLogger({
    depth: 5,
  });

  return async (ctx, next) => {
    const startTime = process.hrtime.bigint();

    let requestId = ctx.get("X-Request-Id");
    if (isNil(requestId) || requestId.length === 0) {
      requestId = uuid();
    }
    ctx.set("X-Request-Id", requestId);

    ctx.log = bindLoggerContext(logger, {
      type: "http",
      requestId,
    });

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
 * Given a logged object, check if it is a request log
 *
 * @param {object} obj
 * @returns {boolean}
 */
export function isServerLog(obj) {
  if (obj?.type !== "http") {
    return false;
  }

  if (!obj.message?.request || !obj.message.response) {
    return false;
  }

  return obj.message.request.path && !!obj.message.response.duration;
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
    },
    response: {
      duration,
      length,
      status: ctx.status,
    },
  });
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

    /**
     *
     */
    function done() {
      ctx.body.removeListener("finish", onFinish);
      ctx.body.removeListener("close", onClose);
      resolve();
    }
  });
}
