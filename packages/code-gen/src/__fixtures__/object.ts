import { V } from "../partials";
import { createSchema } from "../schemaRegistry";

export function registerObjectSchemas() {
  createSchema("ObjectSimple", V.object({ foo: V.bool() }));
  createSchema("ObjectOptional", V.object({ foo: V.bool() }).optional());
  createSchema("ObjectKey", V.object().key("foo", V.bool()));
  createSchema("ObjectKeys", V.object().keys({ foo: V.bool() }));
  createSchema("ObjectStrict", V.object({ foo: V.bool() }).strict());
}
