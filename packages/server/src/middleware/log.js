import { newLogger } from "@lbu/insight";
import { isNil, uuid } from "@lbu/stdlib";
import { Transform } from "stream";

/**
 * Wait for the ctx.body stream to finish before resolving
 * @param ctx
 * @returns {Promise<void>}
 */
const bodyCloseOrFinish = async (ctx) => {
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
};

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
 * @param ctx
 * @param {BigInt} startTime
 * @param {number} length
 */
const logInfo = (ctx, startTime, length) => {
  const duration = Math.round(
    Number(process.hrtime.bigint() - startTime) / 1000000,
  );

  ctx.log.info({
    request: {
      ip: ctx.ip,
      method: ctx.method,
      path: ctx.path,
    },
    response: {
      duration,
      length,
      status: ctx.status,
    },
  });
};

/**
 * Log basic request and response information
 */
export const logMiddleware = () => async (ctx, next) => {
  const startTime = process.hrtime.bigint();

  let requestId = ctx.get("X-Request-Id");
  if (isNil(requestId) || requestId.length === 0) {
    requestId = uuid();
  }
  ctx.set("X-Request-Id", requestId);

  ctx.log = newLogger({
    depth: 5,
    ctx: {
      type: "HTTP",
      requestId,
    },
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

/**
 * Basic http log counters
 * @param store
 * @return {function(...[*]=)}
 */
export const logParser = (store) => {
  store.requestCount = 0;
  store.totalDuration = 0;
  store.totalResponseLength = 0;
  store.methodSummary = {};
  store.statusCodeSummary = {};

  return (obj) => {
    if (!obj.type || obj.type !== "HTTP") {
      return;
    }
    if (!obj.message || !obj.message.request || !obj.message.response) {
      return;
    }

    handleRequestLog(obj);
  };

  function handleRequestLog(obj) {
    store.requestCount++;
    store.totalDuration += Number(obj.message.response.duration);
    store.totalResponseLength += obj.message.response.length;

    if (!store.methodSummary[obj.message.request.method]) {
      store.methodSummary[obj.message.request.method] = 0;
    }
    store.methodSummary[obj.message.request.method]++;

    if (!store.statusCodeSummary[obj.message.response.status]) {
      store.statusCodeSummary[obj.message.response.status] = 0;
    }
    store.statusCodeSummary[obj.message.response.status]++;
  }
};
