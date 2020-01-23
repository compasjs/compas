import { Route } from "./router";
import { Validator } from "./validator";

export * from "./validator";
export * from "./router";

export interface AppSchema {
  name: string;
  validators: Validator[];
  routes: Route[];
}
