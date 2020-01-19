import { Middleware } from "koa";
import { AppState, Context } from "../types";
import { NotFoundError } from "./notFound";

export type ErrorHandler = (ctx: Context, err: ErrorHandler) => boolean;

export function errorHandler(handler?: ErrorHandler): Middleware<{}, AppState> {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      // Give the configured handler a chance to handle this error
      if (handler && handler(ctx, e)) {
        return;
      }

      if (e instanceof NotFoundError) {
        ctx.status = 404;
        ctx.body = {
          message: "Not found",
        };
      } else {
        ctx.log.error({
          error: e,
        });
        ctx.status = 500;
        ctx.body = {
          message: "Internal server error",
        };
      }
    }
  };
}
