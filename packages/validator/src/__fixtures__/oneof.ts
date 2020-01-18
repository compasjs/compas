import { V } from "../partials";
import { createSchema } from "../schemaRegistry";

export function registerOneOfSchemas() {
  createSchema("OneOfSimple", V.oneOf().add(V.bool()));
  createSchema(
    "OneOfOptional",
    V.oneOf()
      .add(V.bool())
      .optional(),
  );
  createSchema("OneOfMultiple", V.oneOf().add(V.bool(), V.number()));
}
