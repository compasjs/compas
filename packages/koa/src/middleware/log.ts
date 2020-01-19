import { Logger } from "@lbu/insight";
import { isNil, uuid } from "@lbu/stdlib";
import { Middleware } from "koa";
import { Transform } from "stream";
import { AppState, Context } from "../types";

class StreamLength extends Transform {
  length = 0;

  public _transform(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null, data?: any) => void,
  ): void {
    this.length += chunk.length;
    this.push(chunk, encoding);
    callback();
  }
}

export function logMiddleware(): Middleware<{}, AppState> {
  return async (ctx, next) => {
    const startTime = process.hrtime.bigint();

    let requestId = ctx.get("x-request-id");
    if (isNil(requestId) || requestId.length === 0) {
      requestId = uuid();
    }
    ctx.set("X-Request-Id", requestId);

    ctx.log = new Logger<{}>(5, { requestId });

    await next();

    let counter: StreamLength | undefined;

    if (!isNil(ctx.response.length)) {
      logInfo(ctx.response.length);
      return;
    } else if (ctx.body && ctx.body.readable) {
      const body = ctx.body;
      counter = new StreamLength();
      ctx.body = body.pipe(counter).on("error", ctx.onerror);
      await bodyCloseOrFinish(ctx);
    }

    logInfo(counter?.length ?? 0);

    function logInfo(length: number) {
      const duration = Math.round(
        Number(process.hrtime.bigint() - startTime) / 1_000_000,
      );

      ctx.log.info({
        request: {
          ip: ctx.ip,
          method: ctx.method,
          path: ctx.path,
        },
        res: {
          duration,
          length,
          status: ctx.status,
        },
      });
    }
  };
}

/**
 * Wait for ctx.body to complete
 * Just don't expose this function, cause it expects the body to be an EventEmitter
 */
async function bodyCloseOrFinish(ctx: Context) {
  return new Promise(resolve => {
    const onFinish = done.bind(null, "finish");
    const onClose = done.bind(null, "close");

    function done() {
      ctx.body.removeListener("finish", onFinish);
      ctx.body.removeListener("close", onClose);
      resolve();
    }

    ctx.body.once("finish", onFinish);
    ctx.body.once("close", onClose);
  });
}
