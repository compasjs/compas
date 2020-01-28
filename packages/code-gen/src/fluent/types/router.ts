import { ValidatorSchema } from "./validator";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

export interface RouteSchema {
  method: HttpMethod;
  path: string;
  name: string;
  queryValidator?: ValidatorSchema;
  paramsValidator?: ValidatorSchema;
  bodyValidator?: ValidatorSchema;
  response?: ValidatorSchema;
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
  handler?: RouteSchema;
}
