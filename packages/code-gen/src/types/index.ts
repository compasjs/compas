import { Validator } from "./validator";

export * from "./validator";

export interface AppSchema {
  name: string;
  validators: { [k: string]: Validator };
}
