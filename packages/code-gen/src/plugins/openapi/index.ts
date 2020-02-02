import {
  AbstractRoute,
  AbstractTree,
  AbstractTypeUnion,
  PluginMetaData,
} from "../../types";

export function getPlugin(): PluginMetaData {
  return {
    name: "OpenAPI",
    description:
      "Create an openapi compatible json file and add a route to host it",
    hooks: {
      mutateAppSchema: schema => {
        schema.routes.push({
          name: "getSwagger",
          method: "GET",
          path: "/_openapi",
        });
      },
      buildOutput: tree => {
        const asset = buildOpenApiSchema(tree);
        const tsFile = buildRouteHandler();

        return [
          {
            source: asset,
            path: "./assets/openapi.json",
          },
          {
            source: tsFile,
            path: "./src/generated/openapi.ts",
          },
        ];
      },
    },
  };
}

function buildRouteHandler() {
  return `
  import { join } from "path";
  import { routeHandlers } from "./router";  
  
  const spec = require(join(process.cwd(), "./assets/openapi.json"));
  
  routeHandlers.getSwagger = async (ctx, next) => {
    ctx.body = spec;

    return next();
  };
  
  export function mutateOpenApiSpec(cb: (spec: any) => void) {
   cb(spec);
  }
`;
}

function buildOpenApiSchema(tree: AbstractTree): string {
  const result: any = {};

  addMetaData(tree, result);
  addComponentSchemas(tree, result);
  addRoutes(tree, result);

  return JSON.stringify(result);
}

function addMetaData(tree: AbstractTree, result: any) {
  result.openapi = "3.0.0";
  result.info = {
    title: `${tree.name} API spec`,
    version: "0.0.1",
  };
  result.servers = [
    {
      url: "http://localhost:3000",
      description: "Localhost setup",
    },
  ];
  result.components = {
    schemas: {},
    securitySchemes: {},
  };
}

function addComponentSchemas(tree: AbstractTree, result: any) {
  // TODO: This doesn't work as expected, take into account in the refactor
  //  Refs need to be resolved recursively
  //  i.e. Point -> QuerySchema -> ParamsSchema
  for (const route of tree.abstractRoutes) {
    if (route.bodyValidator) {
      const type = route.bodyValidator.typeName;
      result.components.schema[type] = buildComponentSchema(
        tree,
        result,
        tree.types[type],
      );
    }

    if (route.response) {
      const type = route.response.typeName;
      result.components.schema[type] = buildComponentSchema(
        tree,
        result,
        tree.types[type],
      );
    }
  }
}

function buildComponentSchema(
  tree: AbstractTree,
  result: any,
  type: AbstractTypeUnion,
): any {
  switch (type.type) {
    case "number":
      return {
        type: "number",
      };
    case "string":
      return {
        type: "string",
      };
    case "boolean":
      return {
        type: "boolean",
      };
    case "array":
      return {
        type: "array",
        items: buildComponentSchema(tree, result, type.values),
      };
    case "oneOf":
      return {
        anyOf: type.oneOf.map(it => buildComponentSchema(tree, result, it)),
      };
    case "ref":
      return {
        $ref: `#/components/schemas/${type.ref}`,
      };
    case "object": {
      const required: string[] = [];
      const properties: any = {};

      if (type.keys) {
        for (const k in type.keys) {
          if (!Object.prototype.hasOwnProperty.call(type.keys, k)) {
            continue;
          }

          const v = type.keys[k];
          if (!v.optional) {
            required.push(k);
          }

          properties[k] = buildComponentSchema(tree, result, v);
        }
      }

      return {
        type: "object",
        properties,
        required: required.length > 0 ? required : undefined,
      };
    }
  }
}

function addRoutes(tree: AbstractTree, result: any) {
  result.paths = {};

  for (const route of tree.abstractRoutes) {
    const openApiPath = convertPath(route.path);
    if (!result.paths[openApiPath]) {
      result.paths[openApiPath] = {};
    }
    result.paths[openApiPath][route.method.toLowerCase()] = buildOperation(
      tree,
      result,
      route,
    );
  }
}

function convertPath(path: string): string {
  return (
    "/" +
    path
      .split("/")
      .map(it => {
        if (it.startsWith(":")) {
          return `{${it.substring(1)}}`;
        }
        return it;
      })
      .join("/")
  );
}

function buildOperation(
  tree: AbstractTree,
  result: any,
  route: AbstractRoute,
): any {
  const operation: any = {
    operationId: route.name,
    parameters: [],
  };

  if (route.queryValidator) {
    const type: any = tree.types[route.queryValidator.typeName];
    for (const key in type.keys) {
      if (!Object.prototype.hasOwnProperty.call(type.keys, key)) {
        continue;
      }
      const value: any = type.keys[key];
      operation.parameters.push({
        in: "query",
        name: key,
        style: "form",
        schema: buildComponentSchema(tree, result, value),
      });
    }
  }

  if (route.paramsValidator) {
    const type: any = tree.types[route.paramsValidator.typeName];
    for (const key in type.keys) {
      if (!Object.prototype.hasOwnProperty.call(type.keys, key)) {
        continue;
      }
      const value: any = type.keys[key];
      operation.parameters.push({
        in: "path",
        name: key,
        style: "form",
        schema: buildComponentSchema(tree, result, value),
      });
    }
  }

  operation.responses = {
    "200": {
      description: "OK",
      content: route.response
        ? {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${route.response.typeName}`,
              },
            },
          }
        : undefined,
    },
  };

  if (route.bodyValidator) {
    operation.requestBody = {
      required: true,

      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${route.bodyValidator.typeName}`,
          },
        },
      },
    };
  }

  return operation;
}
