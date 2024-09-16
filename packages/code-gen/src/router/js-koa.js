import { AnyType } from "../builders/index.js";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextGetOptional,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileWrite } from "../file/write.js";
import {
  routeStructureGet,
  routeStructureGetOpenApi,
} from "../processors/route-structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { typesCacheGet } from "../types/cache.js";
import {
  typesGeneratorGenerateNamedType,
  typesGeneratorUseTypeName,
} from "../types/generator.js";
import { upperCaseFirst } from "../utils.js";

/**
 * Get the router file for the provided group
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function jsKoaGetRouterFile(generateContext) {
  let file = fileContextGetOptional(generateContext, `common/router.js`);

  if (file) {
    return file;
  }

  file = fileContextCreateGeneric(generateContext, `common/router.js`, {
    importCollector: new JavascriptImportCollector(),
  });

  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("@compas/stdlib", "AppError");

  return file;
}

/**
 * Get the controller file for the provided group
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {string} group
 */
export function jsKoaGetControllerFile(generateContext, group) {
  let file = fileContextGetOptional(generateContext, `${group}/controller.js`);

  if (file) {
    return file;
  }

  file = fileContextCreateGeneric(generateContext, `${group}/controller.js`, {
    importCollector: new JavascriptImportCollector(),
  });

  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("@compas/stdlib", "AppError");

  return file;
}

/**
 * Create Ctx & Fn types
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureRouteDefinition} route
 * @param {Record<string, string>} contextNames
 */
export function jsKoaPrepareContext(
  generateContext,
  file,
  route,
  contextNames,
) {
  let partial = ``;
  partial +=
    contextNames.paramsType ?
      `  validatedParams: ${contextNames.paramsTypeName},\n`
    : "";
  partial +=
    contextNames.queryType ?
      `  validatedQuery: ${contextNames.queryTypeName},\n`
    : "";
  partial +=
    contextNames.bodyType ?
      `  validatedBody: ${contextNames.bodyTypeName},\n`
    : "";

  const ctxType = new AnyType(route.group, `${route.name}Ctx`)
    .implementations({
      js: {
        validatorOutputType: `import("koa").ExtendableContext & {
  event: import("@compas/stdlib").InsightEvent,
  log: import("@compas/stdlib").Logger,${
    partial.length > 0 ? `\n  ${partial.trim()}` : ""
  }
} & { body: ${contextNames.responseTypeName ?? "any"} }`,
        validatorInputType: "any",
      },
    })
    .build();

  typesGeneratorGenerateNamedType(generateContext, ctxType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: ["js"],
  });

  // @ts-expect-error
  contextNames[`ctxTypeName`] = typesCacheGet(generateContext, ctxType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: ["js"],
  });

  contextNames[`ctxType`] = typesGeneratorUseTypeName(
    generateContext,
    file,
    contextNames[`ctxTypeName`],
  );

  const fnType = new AnyType(route.group, `${route.name}Fn`)
    .implementations({
      js: {
        validatorOutputType: `(
  ctx: ${upperCaseFirst(route.group ?? "")}${upperCaseFirst(route.name ?? "")}Ctx
) => void | Promise<void>`,
        validatorInputType: "any",
      },
    })
    .build();

  typesGeneratorGenerateNamedType(generateContext, fnType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: ["js"],
  });

  // @ts-expect-error
  contextNames[`fnTypeName`] = typesCacheGet(generateContext, fnType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: ["js"],
  });

  contextNames[`fnType`] = typesGeneratorUseTypeName(
    generateContext,
    file,
    contextNames[`fnTypeName`],
  );
}

/**
 * @param {import("../file/context.js").GenerateFile} file
 * @param {string} group
 * @param {Array<import("../generated/common/types.js").StructureRouteDefinition>} routes
 * @param {Map<any, Record<string, string>>} contextNamesMap
 */
export function jsKoaWriteHandlers(file, group, routes, contextNamesMap) {
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` * `);

  fileWrite(file, `${group} route handlers\n`);

  fileWrite(file, `@type {{`);
  fileContextSetIndent(file, 1);

  for (const route of routes) {
    const contextNames = contextNamesMap.get(route) ?? {};

    fileWrite(file, `${route.name}: ${contextNames.fnType},`);
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `}}`);

  fileContextRemoveLinePrefix(file, 1);
  fileWrite(file, "/");
  fileContextRemoveLinePrefix(file, 2);

  fileWrite(file, `export const ${group}Handlers = {`);
  fileContextSetIndent(file, 1);

  for (const route of routes) {
    fileWrite(
      file,
      `${route.name}: (ctx) => { throw AppError.notImplemented({ message: "You probably forgot to override the generated handlers or import your own implementation." }) },`,
    );
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `};\n`);
}

/**
 * @param {import("../file/context.js").GenerateFile} file
 * @param {string} group
 * @param {Array<import("../generated/common/types.js").StructureRouteDefinition>} routes
 */
export function jsKoaWriteTags(file, group, routes) {
  fileWrite(file, `export const ${group}Tags = {`);
  fileContextSetIndent(file, 1);

  for (const route of routes) {
    fileWrite(file, `${route.name}: ${JSON.stringify(route.tags)},`);
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `};\n`);
}

/**
 * @param {import("../file/context.js").GenerateFile} file
 * @param {Record<string, Array<import("../generated/common/types.js").StructureRouteDefinition>>} routesPerGroup
 * @param {Map<any, Record<string, string>>} contextNamesMap
 */
export function jsKoaBuildRouterFile(file, routesPerGroup, contextNamesMap) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  importCollector.destructure("./route-matcher.js", "routeMatcher");
  importCollector.destructure("@compas/stdlib", "eventRename");

  for (const group of Object.keys(routesPerGroup)) {
    importCollector.destructure(
      `../${group}/controller.js`,
      `${group}Handlers`,
    );
  }

  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` * `);
  fileWrite(file, `The full router and dispatching\n`);

  fileWrite(file, `@param {import("@compas/server").Middleware} bodyParser`);
  fileWrite(file, `@returns {import("@compas/server").Middleware}`);

  fileContextRemoveLinePrefix(file, 1);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  fileBlockStart(file, `export function router(bodyParser)`);

  fileWrite(file, `const routes = {`);
  fileContextSetIndent(file, 1);

  for (const group of Object.keys(routesPerGroup)) {
    fileWrite(file, `${group}: {`);
    fileContextSetIndent(file, 1);

    const routes = routesPerGroup[group];
    for (const route of routes) {
      const contextNames = contextNamesMap.get(route) ?? {};

      fileWrite(file, `${route.name}: async (params, ctx, next) => {`);
      fileContextSetIndent(file, 1);

      fileBlockStart(file, `if (ctx.event)`);
      fileWrite(
        file,
        `eventRename(ctx.event, "router.${route.group}.${route.name}");`,
      );
      fileBlockEnd(file);

      fileWrite(file, `ctx.request.params = params;`);

      if (route.body || route.query) {
        fileWrite(file, `await bodyParser(ctx);`);
      }

      if (route.params) {
        fileWrite(
          file,
          `const validatedParams = ${
            contextNames[`paramsValidator`]
          }(ctx.request.params);`,
        );

        fileBlockStart(file, `if (validatedParams.error)`);
        fileWrite(
          file,
          `throw AppError.validationError("validator.error", validatedParams.error);`,
        );
        fileBlockEnd(file);

        fileBlockStart(file, `else`);
        fileWrite(file, `ctx.validatedParams = validatedParams.value;`);
        fileBlockEnd(file);
      }

      if (route.query) {
        fileWrite(
          file,
          `const validatedQuery = ${contextNames[`queryValidator`]}(ctx.request.query);`,
        );

        fileBlockStart(file, `if (validatedQuery.error)`);
        fileWrite(
          file,
          `throw AppError.validationError("validator.error", validatedQuery.error);`,
        );
        fileBlockEnd(file);

        fileBlockStart(file, `else`);
        fileWrite(file, `ctx.validatedQuery = validatedQuery.value;`);
        fileBlockEnd(file);
      }

      if (route.body) {
        fileWrite(
          file,
          `const validatedBody = ${contextNames[`bodyValidator`]}(ctx.request.body);`,
        );

        fileBlockStart(file, `if (validatedBody.error)`);
        fileWrite(
          file,
          `throw AppError.validationError("validator.error", validatedBody.error);`,
        );
        fileBlockEnd(file);

        fileBlockStart(file, `else`);
        fileWrite(file, `ctx.validatedBody = validatedBody.value;`);
        fileBlockEnd(file);
      }

      fileWrite(file, `await ${group}Handlers.${route.name}(ctx);`);

      if (route.response) {
        fileWrite(
          file,
          `const validatedResponse = ${contextNames[`responseValidator`]}(ctx.body);`,
        );

        fileBlockStart(file, `if (validatedResponse.error)`);
        fileWrite(
          file,
          `throw AppError.serverError({
  message: "Response did not satisfy the response type.",
  route: {
    group: "${route.group}",
    name: "${route.name}",
  },
  error: validatedResponse.error
});`,
        );
        fileBlockEnd(file);
        fileBlockStart(file, `else`);
        fileWrite(file, `ctx.body = validatedResponse.value;`);
        fileBlockEnd(file);
      }

      fileWrite(file, `return next();`);

      fileContextSetIndent(file, -1);
      fileWrite(file, `},`);
    }

    fileContextSetIndent(file, -1);
    fileWrite(file, `},`);
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `};\n`);

  fileBlockStart(file, `return function (ctx, next)`);

  fileWrite(file, `const match = routeMatcher(ctx.method, ctx.path);\n`);

  fileWrite(file, `if (!match) { return next(); }\n`);

  fileBlockStart(file, `if (match.params)`);
  fileBlockStart(
    file,
    `for (const [key, value] of Object.entries(match.params))`,
  );

  fileWrite(
    file,
    `try {
  match.params[key] = decodeURIComponent(value);
} catch (e) {
  throw AppError.validationError("router.param.invalidEncoding", { key, value });
}
`,
  );

  fileBlockEnd(file);
  fileBlockEnd(file);

  fileWrite(
    file,
    `return routes[match.route.group][match.route.name](match.params, ctx, next);`,
  );

  fileBlockEnd(file);

  fileBlockEnd(file);
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 */
export function jsKoaRegisterCompasStructureRoute(generateContext, file) {
  if (!generateContext.options.generators.router?.exposeApiStructure) {
    return;
  }

  fileWrite(
    file,
    `compasHandlers.structure = (ctx) => {
  ctx.set("Content-Type", "application/json");

  if (ctx.validatedQuery.format === "compas") {
  ctx.body = \`${routeStructureGet(generateContext)}\`;
  } else if (ctx.validatedQuery.format === "openapi") {
  ctx.body = \`${routeStructureGetOpenApi(generateContext)}\`;
  }
};
`,
  );
}
