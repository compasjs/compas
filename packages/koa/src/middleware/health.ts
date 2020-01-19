import { Next } from "koa";

export function healthHandler() {
  return (ctx: any, next: Next) => {
    if (ctx.path === "/_health") {
      ctx.body = "";
      return;
    } else {
      return next();
    }
  };
}
