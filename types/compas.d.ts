import { type } from "os";

export {};

declare global {
  type Logger = import("@compas/stdlib").Logger;
  type InsightEvent = import("@compas/stdlib").InsightEvent;

  type CliCompletion = import("@compas/cli").CliCompletion;

  type QueryPartArg = import("@compas/store").QueryPartArg;
  type QueryPart<T = any> = import("@compas/store").QueryPart<T>;
}
