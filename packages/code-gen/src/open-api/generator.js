import { readFileSync } from "node:fs";
import { environment, isNil, merge, pathJoin } from "@compas/stdlib";
import { fileContextCreateGeneric } from "../file/context.js";
import { fileWrite } from "../file/write.js";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureRoutes } from "../processors/routes.js";
import { structureResolveReference } from "../processors/structure.js";
import { upperCaseFirst } from "../utils.js";

/**
 * Generate the open api specification for the provided structure.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function openApiGenerate(generateContext) {
  if (isNil(generateContext.options.generators.openApi)) {
    return;
  }

  const file = fileContextCreateGeneric(
    generateContext,
    "common/openapi.json",
    {
      addGeneratedByComment: false,
    },
  );

  fileWrite(file, JSON.stringify(openApiBuildFile(generateContext), null, 2));
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function openApiBuildFile(generateContext) {
  const openApiSpec = merge(
    {
      openapi: "3.0.3",
      info: {
        title: environment.APP_NAME,
        description: "",
        version: "0.0.0",
      },
      servers: [],
      tags: [],
      paths: {},
      components: {
        schemas: {
          AppError: {
            type: "object",
            properties: {
              info: {
                type: "object",
              },
              key: {
                type: "string",
              },
              status: {
                type: "number",
              },
              requestId: {
                type: "string",
              },
            },
          },
        },
      },
    },
    generateContext.options.generators.openApi?.openApiExtensions ?? {},
  );

  // determine compas version
  const compasVersion = openApiGetCompasVersion();
  const groups = new Set();

  for (const route of structureRoutes(generateContext)) {
    groups.add(route.group);

    openApiTransformRoute(generateContext, openApiSpec, route);
  }

  openApiSpec.tags = [...groups].map((it) => ({
    name: it,
    description: "",
  }));

  openApiSpec["x-generator"] =
    `Compas (https://compasjs.com) v${compasVersion}`;

  return openApiSpec;
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {any} openApiSpec
 * @param { import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureRouteDefinition>} route
 */
function openApiTransformRoute(generateContext, openApiSpec, route) {
  const method = route.method.toLowerCase();
  const path = openApiTransformPath(route.path);
  const uniqueName = upperCaseFirst(route.group) + upperCaseFirst(route.name);

  openApiSpec.paths[path] ??= {};
  openApiSpec.paths[path][method] = {
    tags: [route.group],
    description: route.docString,
    operationId: uniqueName,
    ...openApiTransformParams(generateContext, openApiSpec, route),
    ...openApiTransformBody(generateContext, openApiSpec, route),
    responses: openApiTransformResponse(generateContext, openApiSpec, route),
    ...(generateContext.options.generators.openApi?.openApiRouteExtensions?.[
      uniqueName
    ] ?? {}),
  };
}

/**
 * Transform path params to {} notation and append leading slash
 *
 * @param {string} path
 * @returns {string}
 */
function openApiTransformPath(path) {
  return `/${path
    .split("/")
    .filter((it) => it.length > 0)
    .map((it) => {
      if (it.startsWith(":")) {
        return `{${it.substring(1)}}`;
      }
      return it;
    })
    .join("/")}`;
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {any} openApiSpec
 * @param { import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureRouteDefinition>} route
 */
function openApiTransformParams(generateContext, openApiSpec, route) {
  if (isNil(route.query) && isNil(route.params)) {
    return {};
  }

  const parameters = [];

  if (route.params) {
    const paramsObject = structureResolveReference(
      generateContext.structure,
      route.params,
    );

    // @ts-expect-error
    for (const [key, param] of Object.entries(paramsObject.keys)) {
      parameters.push(inlineTransform(key, param, "path"));
    }
  }

  if (route.query) {
    const queryObject = structureResolveReference(
      generateContext.structure,
      route.query,
    );

    // @ts-expect-error
    for (const [key, param] of Object.entries(queryObject.keys)) {
      parameters.push(inlineTransform(key, param, "query"));
    }
  }

  return { parameters };

  function inlineTransform(key, param, paramType) {
    let schema = {};

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

        if (param.specifier === "dateOnly") {
          schema.format = "date";
        } else if (param.specifier === "timeOnly") {
          // This is not an officially supported value. Format is free-form, so we are allowed to
          // set it.
          schema.format = "time";
        }
        break;

      case "number":
        schema.type = param.validator.floatingPoint ? "number" : "integer";
        schema.minimum = param.validator?.min;
        schema.maximum = param.validator?.max;
        break;

      case "reference":
        // @ts-expect-error
        schema = transformType(generateContext, openApiSpec, param);

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
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {any} openApiSpec
 * @param { import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureRouteDefinition>} route
 */
function openApiTransformBody(generateContext, openApiSpec, route) {
  const field = route.body;

  if (!field) {
    return {};
  }

  const content = {
    // @ts-expect-error
    schema: transformType(generateContext, openApiSpec, field),
  };

  return {
    requestBody: {
      description: referenceUtilsGetProperty(generateContext, field, [
        "docString",
      ]),
      content: {
        [route.metadata?.requestBodyType === "form-data" ?
          "multipart/form-data"
        : "application/json"]: content,
      },
      required: true,
    },
  };
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {any} openApiSpec
 * @param { import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureRouteDefinition>} route
 */
function openApiTransformResponse(generateContext, openApiSpec, route) {
  const contentAppError = {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/AppError",
      },
    },
  };

  // document all non 200 status codes, controlled by compas itself
  const defaultResponses = {
    400: {
      description: "Validation Error",
      content: contentAppError,
    },
    401: {
      description: "Unauthorized Error",
      content: contentAppError,
    },
    404: {
      description: "Not Found Error",
      content: contentAppError,
    },
    405: {
      description: "Not Implemented Error",
      content: contentAppError,
    },
    500: {
      description: "Internal Server Error",
      content: contentAppError,
    },
  };

  const response = {
    description:
      route.response ?
        referenceUtilsGetProperty(
          generateContext,
          route.response,
          ["docString"],
          "",
        )
      : "",
    content: {
      "application/json": {
        schema:
          route.response ?
            // @ts-expect-error
            transformType(generateContext, openApiSpec, route.response)
          : {},
      },
    },
  };

  return {
    200: response,
    ...defaultResponses,
  };
}

/**
 * Docs: https://swagger.io/docs/specification/data-models/data-types/
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {any} openApiSpec
 * @param { import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureTypeSystemDefinition>} type
 */
function transformType(generateContext, openApiSpec, type) {
  const property = {};

  if (type.docString) {
    property.description = type.docString;
  }

  if (type.group && type.name) {
    const uniqueName = upperCaseFirst(type.group) + upperCaseFirst(type.name);

    if (openApiSpec.components.schemas[uniqueName]) {
      return {
        $ref: `#/components/schemas/${uniqueName}`,
      };
    }

    openApiSpec.components.schemas[uniqueName] = property;
  }

  switch (type.type) {
    case "string":
      Object.assign(property, {
        type: "string",
        minLength: type.validator.min,
        maxLength: type.validator.max,
        enum: type.oneOf,
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

      if (type.specifier === "dateOnly") {
        property.format = "date";
      } else if (type.specifier === "timeOnly") {
        // This is not an officially supported value. Format is free-form, so we are allowed to set
        // it.
        property.format = "time";
      }

      break;

    case "boolean":
      Object.assign(property, {
        type: "boolean",
      });
      break;

    case "number":
      Object.assign(property, {
        type: type.validator.floatingPoint ? "number" : "integer",
        minimum: type.validator.min,
        maximum: type.validator.max,
      });
      break;

    case "object":
      Object.assign(property, {
        type: "object",
        description: type.docString,
        properties: Object.entries(type.keys).reduce(
          (curr, [key, property]) => {
            // @ts-ignore
            curr[key] = transformType(generateContext, openApiSpec, property);
            return curr;
          },
          {},
        ),
        required: Object.entries(type.keys).reduce((curr, [key, property]) => {
          // @ts-ignore
          if (
            !referenceUtilsGetProperty(generateContext, property, [
              "isOptional",
            ])
          ) {
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

        // @ts-expect-error
        items: transformType(generateContext, openApiSpec, type.values),
      });
      break;

    case "reference":
      return transformType(
        generateContext,
        openApiSpec,

        // @ts-expect-error
        structureResolveReference(generateContext.structure, type),
      );

    case "anyOf":
      Object.assign(property, {
        type: "object",
        anyOf: type.values.map((it) =>
          // @ts-expect-error
          transformType(generateContext, openApiSpec, it),
        ),
      });
      break;
  }

  if (type.group && type.name) {
    const uniqueName = upperCaseFirst(type.group) + upperCaseFirst(type.name);

    return {
      $ref: `#/components/schemas/${uniqueName}`,
    };
  }
  return property;
}

/**
 * Interpret package version number of compas code-gen package.
 * Node_modules path is used for current "installed" version.
 *
 * @returns {string}
 */
function openApiGetCompasVersion() {
  const localPackageJson = JSON.parse(
    readFileSync(
      // take on of the packages for reference
      pathJoin(process.cwd(), "./package.json"),
      "utf-8",
    ),
  );

  return (
    localPackageJson.dependencies?.["@compas/code-gen"] ??
    localPackageJson.devDependencies?.["@compas/code-gen"] ??
    "0.0.1"
  );
}
