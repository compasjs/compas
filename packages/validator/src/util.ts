import { Schema, schemaBuildSymbol, SchemaLike } from "./types";

export function toSchema(s: SchemaLike): Schema {
  if (schemaBuildSymbol in s) {
    // @ts-ignore
    return s[schemaBuildSymbol]();
  } else {
    return s as Schema;
  }
}
