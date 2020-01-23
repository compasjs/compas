import { Validator } from "./validator";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

export interface Route {
  method: HttpMethod;
  path: string;
  name: string;
  queryValidator?: Validator;
  paramsValidator?: Validator;
  bodyValidator?: Validator;
  response?: Validator;
}

/**
 * Lowest prio value means higher priority and should be matched first
 */
export enum RoutePrio {
  STATIC,
  PARAM,
  WILDCARD,
}

export interface RouteTrie {
  prio: RoutePrio;
  path: string;
  children: RouteTrie[];
  handler?: Route;
}
