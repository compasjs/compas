import { RouteSchema } from "./router";
import { ValidatorSchema } from "./validator";

export * from "./validator";
export * from "./router";

export interface AppSchema {
  name: string;
  validators: ValidatorSchema[];
  routes: RouteSchema[];
}
