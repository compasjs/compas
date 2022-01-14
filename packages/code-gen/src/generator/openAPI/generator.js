import { readFileSync } from "fs";
import { pathJoin } from "@compas/stdlib";
import {
  transformBody,
  transformComponents,
  transformParams,
  transformResponse,
} from "./transform.js";

/**
 * @type {any}
 */
const OPENAPI_SPEC_TEMPLATE = {
  openapi: "3.0.3",
  info: {},
  servers: [],
  tags: [],
  paths: {},
  components: {
    schemas: {
      AppError: {
        type: "object",
        description: "https://compasjs.com/api/stdlib.html#AppError",
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
 * @property {string[]} enabledGroups
 * @property {boolean} verbose
 */

/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {GenerateOpenApiFileOpts} options
 * @returns {string}
 */
export function generateOpenApiFile(structure, options) {
  const openApiSpec = Object.assign({}, OPENAPI_SPEC_TEMPLATE);

  for (const group of Object.keys(structure)) {
    const groupStructure = structure[group];

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
        // query, params
        ...transformParams(structure, route),
        // requestBody (with files, if any)
        ...transformBody(structure, route),
        responses: constructResponse(structure, route),
      };
    }

    /**
     * @type {import("../../generated/common/types").CodeGenType[]}
     */
    // @ts-ignore
    const groupComponents = Object.values(groupStructure).filter(
      // Strip params types because they're transformed inline
      // @ts-ignore
      (it) => it.type !== "route" && !it.uniqueName.endsWith("Params"),
    );

    // transform components
    const schemas = transformComponents(structure, groupComponents);
    openApiSpec.components.schemas = Object.assign(
      schemas,
      openApiSpec.components.schemas,
    );
  }

  // determine compas version
  const compasVersion = parseCompasVersionNumber();
  openApiSpec[
    "x-generator"
  ] = `Compas (https://compasjs.com) v${compasVersion}`;

  // set meta
  openApiSpec.info = {
    title: `${options.openApiExtensions?.title ?? process.env.APP_NAME}`,
    description: options.openApiExtensions?.description ?? "",
    version: options.openApiExtensions?.version ?? "0.0.0",
  };

  // set servers, if any (pass-trough settings)
  openApiSpec.servers = options.openApiExtensions?.servers ?? [];

  // merge components, if any (pass-trough settings)
  openApiSpec.components = Object.assign(
    options.openApiExtensions?.components,
    {},
    openApiSpec.components,
  );

  return openApiSpec;
}

/**
 * Transform routes to responses but wrapped with possible compas
 * error (http status codes) states (and explanation)
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 */
function constructResponse(structure, route) {
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
  const response = transformResponse(structure, route);

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
