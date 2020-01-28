import { AppSchema, ValidatorSchema } from "../fluent/types";
import {
  AbstractObjectType,
  AbstractStringType,
  AbstractTypeMap,
  AbstractTypeUnion,
  NamedAbstractT,
  NamedAbstractType,
} from "../types";
import { lowerCaseFirst, upperCaseFirst } from "../util";

export function extractTypes(schema: AppSchema): AbstractTypeMap {
  const result: AbstractTypeMap = {};

  extractTypesForRoutes(result, schema);
  extractTypesForValidators(result, schema);

  return result;
}

function extractTypesForRoutes(mapping: AbstractTypeMap, schema: AppSchema) {
  registerRouteValidators(schema);

  const handlerNames: NamedAbstractT<AbstractStringType> = {
    type: "string",
    name: "RouteHandlerNames",
    oneOf: [],
    optional: false,
  };

  for (const route of schema.routes) {
    const routeType: NamedAbstractT<AbstractObjectType> = {
      type: "object",
      optional: false,
      name: route.name + "Handler",
      keys: {},
    };

    if (route.queryValidator) {
      routeType.keys["validatedQuery"] = {
        type: "ref",
        optional: false,
        ref: route.queryValidator.name!,
      };
    }

    if (route.bodyValidator) {
      routeType.keys["validatedBody"] = {
        type: "ref",
        optional: false,
        ref: route.bodyValidator.name!,
      };
    }

    if (route.paramsValidator) {
      routeType.keys["validatedParams"] = {
        type: "ref",
        optional: false,
        ref: route.paramsValidator.name!,
      };
    }

    mapping[route.name] = routeType;
    handlerNames.oneOf!.push(lowerCaseFirst(route.name));
  }

  mapping[handlerNames.name] = handlerNames;
}

function registerRouteValidators(schema: AppSchema) {
  for (const route of schema.routes) {
    route.name = upperCaseFirst(route.name);

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
    }
  }
}

function extractTypesForValidators(
  mapping: AbstractTypeMap,
  schema: AppSchema,
) {
  for (const v of schema.validators) {
    const result = recursiveBuildValidatorType(v) as NamedAbstractType;
    result.name = v.name!;
    mapping[result.name] = result;
  }
}

function recursiveBuildValidatorType(
  schema: ValidatorSchema,
): AbstractTypeUnion {
  let result: AbstractTypeUnion | undefined = undefined;

  switch (schema.type) {
    case "number":
      result = {
        type: "number",
        oneOf: schema.oneOf,
        optional: schema.optional === true,
      };
      break;
    case "string":
      result = {
        type: "string",
        oneOf: schema.oneOf,
        optional: schema.optional === true,
      };
      break;
    case "boolean":
      result = {
        type: "boolean",
        oneOf: schema.oneOf,
        optional: schema.optional === true,
      };
      break;
    case "object":
      result = {
        type: "object",
        optional: schema.optional === true,
        keys: {},
      };
      if (schema.keys) {
        for (const key in schema.keys) {
          if (!Object.prototype.hasOwnProperty.call(schema.keys, key)) {
            continue;
          }
          result.keys[key] = recursiveBuildValidatorType(schema.keys[key]);
        }
      }
      break;
    case "array":
      result = {
        type: "array",
        optional: schema.optional === true,
        values: recursiveBuildValidatorType(schema.values),
      };
      break;
    case "oneOf":
      result = {
        type: "oneOf",
        optional: schema.optional === true,
        oneOf: schema.validators.map(it => recursiveBuildValidatorType(it)),
      };
      break;
    case "reference":
      result = {
        type: "ref",
        optional: schema.optional === true,
        ref: schema.ref,
      };
      break;
  }

  return result!;
}
