import { Schema } from "../types";
import { checkReferences, createSchemaMapping } from "./references";
import { createTypesForSchemas } from "./typings";

export function generateFromSchemas(schemas: Schema[]): string {
  const schemaMap = createSchemaMapping(schemas);
  checkReferences(schemaMap);

  const types = createTypesForSchemas(schemaMap);

  return types;
}
