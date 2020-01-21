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
