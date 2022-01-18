/**
 * Transforms compas query params to OpenApi parameters objects
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Set<string>} uniqueNameSet
 * @returns {{parameters?: Object[]}}
 */
export function transformParams(structure, route, uniqueNameSet) {
  if (!route?.params && !route?.query) {
    return {};
  }

  const parameters = [];

  // params
  // @ts-ignore
  const paramFields = route?.params?.reference?.keys ?? {};
  for (const [key, param] of Object.entries(paramFields)) {
    switch (param.type) {
      case "reference":
        uniqueNameSet.add(param.reference.uniqueName);
        parameters.push(transformGenType(key, param.reference, "path"));
        break;
      default:
        parameters.push(transformGenType(key, param, "path"));
    }
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
 * @param {Set<string>} uniqueNameSet
 * @returns {{requestBody?: Object}}
 */
export function transformBody(structure, route, uniqueNameSet) {
  const content = {};
  const field = route?.body ?? route?.files;

  if (!field) {
    return {};
  }

  /**
   * @type {import("../../generated/common/types").CodeGenType}
   */
  // @ts-ignore
  const reference = field?.reference;
  if (reference) {
    // @ts-ignore
    uniqueNameSet.add(reference.uniqueName);
    content.schema = {
      // @ts-ignore
      $ref: `#/components/schemas/${reference.uniqueName}`,
    };
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
 * @param {Set<string>} uniqueNameSet
 * @returns {any}
 */
export function transformResponse(structure, route, uniqueNameSet) {
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

  // @ts-ignore
  if (route.response?.reference) {
    // @ts-ignore
    uniqueNameSet.add(route.response.reference.uniqueName);
    response.content["application/json"].schema = {
      // @ts-ignore
      $ref: `#/components/schemas/${route.response.reference.uniqueName}`,
    };
  }

  return response;
}

/**
 * @param {import("../../generated/common/types").CodeGenStructure} groupStructure
 * @param {Set<string>} uniqueNameSet
 * @returns {Object<string, any>}
 */
export function transformComponents(groupStructure, uniqueNameSet) {
  const schemas = {};

  const components = Object.values(groupStructure).filter((it) =>
    // @ts-ignore
    uniqueNameSet.has(it.uniqueName),
  );

  for (const component of components) {
    // @ts-ignore
    schemas[component.uniqueName] = transformTypes(component);
  }

  return schemas;

  /**
   * Docs: https://swagger.io/docs/specification/data-models/data-types/
   *
   * @param {import("../../generated/common/types").CodeGenType & {
   *   docString: string,
   * }} component
   * @returns {any}
   */
  function transformTypes(component) {
    const property = {};

    // set description, if docString is not empty
    if (component.docString.length !== 0) {
      property.description = component.docString;
    }

    switch (component.type) {
      // primitive
      case "string":
        return {
          type: "string",
          minLength: component.validator?.min,
          maxLength: component.validator?.max,
          enum: component?.oneOf,
          ...property,
        };

      case "file":
        return {
          type: "string",
          format: "binary",
          ...property,
        };

      case "uuid":
        return {
          type: "string",
          format: "uuid",
          ...property,
        };

      case "date":
        return {
          type: "string",
          format: "date-time",
          ...property,
        };

      case "boolean":
        return {
          type: "boolean",
          ...property,
        };

      case "number":
        return {
          type: component.validator.floatingPoint ? "number" : "integer",
          minimum: component.validator?.min,
          maximum: component.validator?.max,
          ...property,
        };

      case "object":
        return {
          type: "object",
          description: component.docString,
          properties: Object.entries(component.keys).reduce(
            (curr, [key, property]) => {
              // @ts-ignore
              curr[key] = transformTypes(property);
              return curr;
            },
            {},
          ),
          required: Object.entries(component.keys).reduce(
            (curr, [key, property]) => {
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
            },
            undefined,
          ),
        };

      case "generic":
        return {
          type: "object",
          additionalProperties: true,
          ...property,
        };

      case "array":
        return {
          type: "array", // @ts-ignore
          items: transformTypes(component.values),
          ...property,
        };

      case "reference":
        return {
          // @ts-ignore
          $ref: `#/components/schemas/${component.reference.uniqueName}`,
        };

      case "anyOf":
        return {
          type: "object",
          anyOf: Object.entries(component.values).reduce(
            (curr, [, property]) => {
              // @ts-ignore
              curr.push(transformTypes(property));
              return curr;
            },
            [],
          ),
          ...property,
        };

      default:
        return undefined;
    }
  }
}
