import { AppSchema } from "../fluent/types";
import { upperCaseFirst } from "../util";

export function validateSchema(schema: AppSchema) {
  preProcessRoutes(schema);
  preProcessValidators(schema);
}

function preProcessRoutes(schema: AppSchema) {
  const knownNames = [];
  for (const route of schema.routes) {
    route.name = upperCaseFirst(route.name);

    knownNames.push(route.name);
  }

  if (new Set(knownNames).size !== knownNames.length) {
    throw new Error("Duplicate route name found.");
  }
}

function preProcessValidators(schema: AppSchema) {
  const knownNames = [];
  for (const validator of schema.validators) {
    validator.name = upperCaseFirst(validator.name!);
    knownNames.push(validator.name);
  }

  if (new Set(knownNames).size !== knownNames.length) {
    throw new Error("Duplicate route name found.");
  }
}
