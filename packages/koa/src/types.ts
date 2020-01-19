import { Logger } from "@lbu/insight";
import * as Koa from "koa";

export interface AppState {
  log: Logger;
}

export type Context = Koa.ParameterizedContext<{}, AppState>;
