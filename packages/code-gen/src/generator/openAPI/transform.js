import { isNil } from "@compas/stdlib";

/**
 * Transforms compas query params to OpenApi parameters objects
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @returns {{parameters?: Object[]}}
 */
export function transformParams(structure, route) {
  if (!route?.params && !route?.query) {
    return {};
  }

  const parameters = [];

  // params
  // @ts-ignore
  const paramFields = route?.params?.reference?.keys ?? {};
  for (const [key, param] of Object.entries(paramFields)) {
    parameters.push(transformGenType(key, param, "path"));
  }

  // query
  // @ts-ignore
  const queryFields = route?.query?.reference?.keys ?? {};
  for (const [key, param] of Object.entries(queryFields)) {
    parameters.push(transformGenType(key, param, "query"));
  }

  return { parameters };

  /**
   * @param {string} key
   * @param {import("../../generated/common/types").CodeGenType} param
   * @param {"path"|"query"} paramType
   * @returns {any}
   */
  function transformGenType(key, param, paramType) {
    const schema = {};

    switch (param.type) {
      case "string":
        schema.type = "string";
        schema.enum = param?.oneOf;
        schema.minLength = param.validator?.min;
        schema.maxLength = param.validator?.max;
        break;

      case "file":
        schema.type = "string";
        schema.format = "binary";
        break;

      case "uuid":
        schema.type = "string";
        schema.format = "uuid";
        break;

      case "date":
        schema.type = "string";
        schema.format = "date-time";
        break;

      case "number":
        schema.type = param.validator.floatingPoint ? "number" : "integer";
        schema.minimum = param.validator?.min;
        schema.maximum = param.validator?.max;
        break;

      case "reference":
        return transformGenType(
          key,
          structure[param.reference.group][param.reference.name],
          paramType,
        );

      default:
        schema.type = param.type;
        break;
    }

    return {
      name: key,

      // @ts-ignore
      description: param.docString,

      // @ts-ignore
      required: !param.isOptional,
      in: paramType,
      schema,
    };
  }
}

/**
 * Transform compas body and files to OpenApi requestBody object
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Record<string, any>} existingSchemas
 * @returns {{requestBody?: Object}}
 */
export function transformBody(structure, route, existingSchemas) {
  const content = {};
  const field = route?.body ?? route?.files;

  if (!field) {
    return {};
  }

  if (field?.reference) {
    content.schema = transformTypes(structure, existingSchemas, field);
  }

  const contentType = route?.files ? "multipart/form-data" : "application/json";

  return {
    requestBody: {
      // @ts-ignore
      description: field.docString,
      content: { [contentType]: content },
      required: true,
    },
  };
}

/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Record<string, any>} existingSchemas
 * @returns {any}
 */
export function transformResponse(structure, route, existingSchemas) {
  // 200 behaviour
  const response = {
    // @ts-ignore
    description: route.response?.docString ?? "",
    content: {
      "application/json": {
        schema: {},
      },
    },
  };

  if (route.response?.reference) {
    response.content["application/json"].schema = transformTypes(
      structure,
      existingSchemas,
      route.response,
    );
  }

  return response;
}

/**
 * Docs: https://swagger.io/docs/specification/data-models/data-types/
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {Record<string, any>} existingSchemas
 * @param {import("../../generated/common/types").CodeGenType & {
 *   docString: string,
 * }} type
 * @returns {any}
 */
function transformTypes(structure, existingSchemas, type) {
  let property = {};

  // set description, if docString is not empty
  if (type.docString.length !== 0) {
    property.description = type.docString;
  }

  if (type.uniqueName && !isNil(existingSchemas[type.uniqueName])) {
    // We already went through this type, so just short circuit
    return {
      $ref: `#/components/schemas/${type.uniqueName}`,
    };
  }

  switch (type.type) {
    case "string":
      Object.assign(property, {
        type: "string",
        minLength: type.validator?.min,
        maxLength: type.validator?.max,
        enum: type?.oneOf,
      });
      break;

    case "file":
      Object.assign(property, {
        type: "string",
        format: "binary",
      });
      break;

    case "uuid":
      Object.assign(property, {
        type: "string",
        format: "uuid",
      });
      break;

    case "date":
      Object.assign(property, {
        type: "string",
        format: "date-time",
      });
      break;

    case "boolean":
      Object.assign(property, {
        type: "boolean",
      });
      break;

    case "number":
      Object.assign(property, {
        type: type.validator.floatingPoint ? "number" : "integer",
        minimum: type.validator?.min,
        maximum: type.validator?.max,
      });
      break;

    case "object":
      Object.assign(property, {
        type: "object",
        description: type.docString,
        properties: Object.entries(type.keys).reduce(
          (curr, [key, property]) => {
            // @ts-ignore
            curr[key] = transformTypes(structure, existingSchemas, property);
            return curr;
          },
          {},
        ),
        required: Object.entries(type.keys).reduce((curr, [key, property]) => {
          // @ts-ignore
          if (!property?.isOptional) {
            if (!curr) {
              // @ts-ignore
              curr = [];
            }

            // @ts-ignore
            curr.push(key);
          }
          return curr;
        }, undefined),
      });
      break;

    case "generic":
      Object.assign(property, {
        type: "object",
        additionalProperties: true,
      });
      break;

    case "array":
      Object.assign(property, {
        type: "array",

        items: transformTypes(structure, existingSchemas, type.values),
      });
      break;

    case "reference":
      property = transformTypes(
        structure,
        existingSchemas,
        structure[type.reference.group][type.reference.name],
      );
      break;

    case "anyOf":
      Object.assign(property, {
        type: "object",
        anyOf: Object.entries(type.values).reduce((curr, [, property]) => {
          curr.push(transformTypes(structure, existingSchemas, property));
          return curr;
        }, []),
      });
      break;
  }

  // If schema is named, we add it to the top level 'components.schemas' and we can
  // return a reference instead of the buildup property.
  if (type.uniqueName) {
    // Only overwrite if not exists, since the first time the full property will be
    // build, but afterwards we only get a reference back.
    if (isNil(existingSchemas[type.uniqueName])) {
      existingSchemas[type.uniqueName] = property;
    }

    return {
      $ref: `#/components/schemas/${type.uniqueName}`,
    };
  }
  return property;
}
