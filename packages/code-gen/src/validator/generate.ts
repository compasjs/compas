import { Validator } from "../types";
import { getErrorClass } from "./errors";
import { createFunctionsForSchemas } from "./functions";
import { checkReferences, createSchemaMapping } from "./references";
import { createTypesForSchemas } from "./typings";

export function generateFromSchemas(schemas: Validator[]): string {
  const schemaMap = createSchemaMapping(schemas);
  checkReferences(schemaMap);

  const types = createTypesForSchemas(schemaMap);
  const validators = createFunctionsForSchemas(schemaMap);

  return [getHeader(), getErrorClass(), types, validators].join("\n");
}

function getHeader() {
  return `
// @lbu/validator
// GENERATED FILE DO NOT EDIT

import { isNil } from "@lbu/stdlib";
`;
}
