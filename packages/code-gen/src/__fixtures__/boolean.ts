import { V } from "../partials";
import { createSchema } from "../schemaRegistry";

export function registerBooleanSchemas() {
  createSchema("BooleanSimple", V.boolean());
  createSchema("BooleanOneOf", V.boolean().oneOf(true));
  createSchema("BooleanConvert", V.boolean().convert());
  createSchema("BooleanOptional", V.boolean().optional());
}
