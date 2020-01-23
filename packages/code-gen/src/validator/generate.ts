import { Validator } from "../types";
import { getErrorClass } from "./errors";
import { createFunctionsForSchemas } from "./functions";
import { checkReferences } from "./references";
import { createTypesForSchemas } from "./typings";

export function generateValidatorStringFromValidators(
  validators: Validator[],
): string {
  const validatorMap = checkReferences(validators);

  const types = createTypesForSchemas(validatorMap);
  const functions = createFunctionsForSchemas(validatorMap);

  return [getHeader(), getErrorClass(), types, functions].join("\n");
}

function getHeader() {
  return `
// @lbu/validator
// GENERATED FILE DO NOT EDIT

import { isNil } from "@lbu/stdlib";
`;
}
