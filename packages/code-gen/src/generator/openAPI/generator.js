import { readFileSync } from "fs";
import { merge, pathJoin } from "@compas/stdlib";
import {
  transformBody,
  transformParams,
  transformResponse,
} from "./transform.js";

/**
 * @type {any}
 */
const OPENAPI_SPEC_TEMPLATE = {
  openapi: "3.0.3",
  info: {
    title: process.env.APP_NAME,
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
        },
      },
    },
  },
};

/**
 * @typedef GenerateOpenApiFileOpts
 * @property {import("./index.js").OpenApiExtensions} openApiExtensions
 * @property {import("./index.js").OpenApiRouteExtensions} openApiRouteExtensions
 * @property {string[]} enabledGroups
 * @property {boolean} verbose
 */

/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {GenerateOpenApiFileOpts} options
 * @returns {string}
 */
export function generateOpenApiFile(structure, options) {
  const openApiSpec = merge(
    {},
    OPENAPI_SPEC_TEMPLATE,
    options.openApiExtensions,
  );

  // transform CodeGenRouteTypes to endpoints/paths
  for (const [group, groupStructure] of Object.entries(structure)) {
    /**
     * @type {import("../../generated/common/types").CodeGenRouteType[]}
     */
    // @ts-ignore
    const groupRoutes = Object.values(groupStructure).filter(
      (it) => it.type === "route",
    );

    // ensure tag
    if (groupRoutes.length > 0) {
      openApiSpec.tags.push({
        name: group,
        description: "",
      });
    }

    for (const route of groupRoutes) {
      // define endpoint
      const method = route.method.toLowerCase();
      const path = transformRoutePath(route.path);

      // ensure parent group is present for child methods
      if (!openApiSpec.paths[path]) {
        openApiSpec.paths[path] = {};
      }

      openApiSpec.paths[path][method] = {
        tags: [route.group],
        description: route.docString,
        operationId: route.uniqueName,
        ...transformParams(structure, route),
        ...transformBody(structure, route, openApiSpec.components.schemas),
        responses: constructResponse(
          structure,
          route,
          openApiSpec.components.schemas,
        ), // @ts-ignore
        ...(options.openApiRouteExtensions?.[route.uniqueName] ?? {}),
      };
    }
  }

  // determine compas version
  const compasVersion = parseCompasVersionNumber();
  openApiSpec[
    "x-generator"
  ] = `Compas (https://compasjs.com) v${compasVersion}`;

  return openApiSpec;
}

/**
 * Transform routes to responses but wrapped with possible compas
 * error (http status codes) states (and explanation)
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Record<string, any>} existingSchemas
 * @returns {object}
 */
function constructResponse(structure, route, existingSchemas) {
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

  // 200 behaviour
  const response = transformResponse(structure, route, existingSchemas);

  return {
    200: response,
    ...defaultResponses,
  };
}

/**
 * Interpret package version number of compas code-gen package.
 * Node_modules path is used for current "installed" version.
 *
 * @returns {string}
 */
function parseCompasVersionNumber() {
  const { version } = JSON.parse(
    readFileSync(
      // take on of the packages for reference
      pathJoin(process.cwd(), "./node_modules/@compas/code-gen/package.json"),
      "utf-8",
    ),
  );

  return version ?? "0.0.1";
}

/**
 * Transform path params to {} notation and append leading slash
 *
 * @param {string} path
 * @returns {string}
 */
function transformRoutePath(path) {
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
