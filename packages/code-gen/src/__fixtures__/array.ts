import { V } from "../partials";
import { createSchema } from "../schemaRegistry";

export function registerArraySchemas() {
  createSchema("ArraySimple", V.array().values(V.bool()));
  createSchema(
    "ArrayConvert",
    V.array()
      .values(V.bool())
      .convert(),
  );
  createSchema(
    "ArrayOptional",
    V.array()
      .values(V.bool())
      .optional(),
  );
}
