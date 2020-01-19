import { Middleware } from "koa";
import koaHelmet from "koa-helmet";
import { default as cors } from "koa2-cors";
import { AppState } from "../types";

export interface DefaultHeaders {
  helmet?: Parameters<typeof koaHelmet>[0];
  cors?: cors.Options;
}

export function defaultHeaders({
  helmet,
  cors: corsOpts,
}: DefaultHeaders): Middleware<AppState> {
  const noop: any = () => {
    return;
  };
  const helmetExec = koaHelmet(helmet);
  const corsExec = cors(corsOpts);

  return async (ctx, next) => {
    await helmetExec(ctx, noop);
    await corsExec(ctx, noop);

    return next();
  };
}
