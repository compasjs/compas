import { V } from "../partials";
import { createSchema } from "../schemaRegistry";

export function registerReferenceSchemas() {
  createSchema("Foo", V.bool());
  createSchema("ReferenceSimple", V.ref("Foo"));
  createSchema(
    "ReferenceOptional",
    V.ref()
      .set("Foo")
      .optional(),
  );
}
