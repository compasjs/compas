import { Middleware } from "koa";
import koaBody from "koa-body";

export function bodyParser(opts?: koaBody.IKoaBodyOptions): Middleware {
  return koaBody(opts);
}
