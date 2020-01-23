import { AppSchema } from "./types";
import { upperCaseFirst } from "./util";

export function preProcessSchema(schema: AppSchema) {
  preProcessRoutes(schema);
  preProcessValidators(schema);
}

function preProcessRoutes(schema: AppSchema) {
  const knownNames = [];
  for (const route of schema.routes) {
    route.name = upperCaseFirst(route.name);

    knownNames.push(route.name);

    if (route.queryValidator) {
      route.queryValidator.name = `QuerySchema${route.name}`;
      schema.validators.push(route.queryValidator);
    }
    if (route.paramsValidator) {
      route.paramsValidator.name = `ParamSchema${route.name}`;
      schema.validators.push(route.paramsValidator);
    }
    if (route.bodyValidator) {
      route.bodyValidator.name = `BodySchema${route.name}`;
      schema.validators.push(route.bodyValidator);
    }
    if (route.response) {
      route.response.name = `ResponseSchema${route.name}`;
      schema.validators.push(route.response);
    }
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
