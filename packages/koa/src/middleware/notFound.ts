import { Middleware } from "koa";

export class NotFoundError extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export function notFoundHandler(): Middleware {
  return async (ctx, next) => {
    await next();
    ctx.status = ctx.status || 404;
    if (ctx.status === 404) {
      throw new NotFoundError();
    }
  };
}
