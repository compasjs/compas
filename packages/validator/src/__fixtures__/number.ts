import { V } from "../partials";
import { createSchema } from "../schemaRegistry";

export function registerNumberSchemas() {
  createSchema("NumberSimple", V.number());
  createSchema("NumberInteger", V.number().integer());
  createSchema(
    "NumberMinMax",
    V.number()
      .min(1)
      .max(5),
  );
  createSchema("NumberOneOf", V.number().oneOf(1, 2, 3));
  createSchema("NumberConvert", V.number().convert());
  createSchema("NumberOptional", V.number().optional());
}
