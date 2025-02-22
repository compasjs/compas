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
  let file = fileContextGetOptional(
    generateContext,
    `common/router.${generateContext.options.targetLanguage}`,
  );

  if (file) {
    return file;
  }

  file = fileContextCreateGeneric(
    generateContext,
    `common/router.${generateContext.options.targetLanguage}`,
    {
      importCollector: new JavascriptImportCollector(),
      typeImportCollector:
        generateContext.options.targetLanguage === "ts" ?
          new JavascriptImportCollector(true)
        : undefined,
    },
  );

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
  let file = fileContextGetOptional(
    generateContext,
    `${group}/controller.${generateContext.options.targetLanguage}`,
  );

  if (file) {
    return file;
  }

  file = fileContextCreateGeneric(
    generateContext,
    `${group}/controller.${generateContext.options.targetLanguage}`,
    {
      importCollector: new JavascriptImportCollector(),
      typeImportCollector:
        generateContext.options.targetLanguage === "ts" ?
          new JavascriptImportCollector(true)
        : undefined,
    },
  );

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

  const ctxTypeImplementation = {
    validatorOutputType: `import("koa").ExtendableContext & {
  event: import("@compas/stdlib").InsightEvent,
  log: import("@compas/stdlib").Logger,${
    partial.length > 0 ? `\n  ${partial.trim()}` : ""
  }
} & { body: ${contextNames.responseTypeName ?? "any"} }`,
    validatorInputType: "any",
  };
  const ctxType = new AnyType(route.group, `${route.name}Ctx`)
    .implementations({
      js: ctxTypeImplementation,
      ts: ctxTypeImplementation,
    })
    .build();

  typesGeneratorGenerateNamedType(generateContext, ctxType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: [generateContext.options.targetLanguage],
  });

  // @ts-expect-error
  contextNames[`ctxTypeName`] = typesCacheGet(generateContext, ctxType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: [generateContext.options.targetLanguage],
  });

  contextNames[`ctxType`] = typesGeneratorUseTypeName(
    generateContext,
    file,
    contextNames[`ctxTypeName`],
  );

  const fnTypeImplementation = {
    validatorOutputType: `(
  ctx: ${upperCaseFirst(route.group ?? "")}${upperCaseFirst(route.name ?? "")}Ctx
) => void | Promise<void>`,
    validatorInputType: "any",
  };
  const fnType = new AnyType(route.group, `${route.name}Fn`)
    .implementations({
      js: fnTypeImplementation,
      ts: fnTypeImplementation,
    })
    .build();

  typesGeneratorGenerateNamedType(generateContext, fnType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: [generateContext.options.targetLanguage],
  });

  // @ts-expect-error
  contextNames[`fnTypeName`] = typesCacheGet(generateContext, fnType, {
    validatorState: "output",
    nameSuffixes: {
      input: "Input",
      output: "Validated",
    },
    targets: [generateContext.options.targetLanguage],
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

  if (file.relativePath.endsWith(".js")) {
    fileWrite(file, `@type {{`);
    fileContextSetIndent(file, 1);

    for (const route of routes) {
      const contextNames = contextNamesMap.get(route) ?? {};

      fileWrite(file, `${route.name}: ${contextNames.fnType},`);
    }

    fileContextSetIndent(file, -1);
    fileWrite(file, `}}`);
  }

  fileContextRemoveLinePrefix(file, 1);
  fileWrite(file, "/");
  fileContextRemoveLinePrefix(file, 2);

  fileWrite(file, `export const ${group}Handlers`);

  if (file.relativePath.endsWith(".ts")) {
    fileWrite(file, `: {`);
    fileContextSetIndent(file, 1);

    for (const route of routes) {
      const contextNames = contextNamesMap.get(route) ?? {};

      fileWrite(file, `${route.name}: ${contextNames.fnType},`);
    }

    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);
  }

  fileWrite(file, ` = {`);
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

  if (file.relativePath.endsWith(".js")) {
    fileWrite(file, `};\n`);
  } else {
    fileWrite(file, `} as const;\n`);
  }
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

  if (file.relativePath.endsWith(".ts")) {
    fileWrite(
      file,
      `
type _Context = import("koa").ParameterizedContext<{}, {
  event: import("@compas/stdlib").InsightEvent,
  log: import("@compas/stdlib").Logger,
  request: {
    params: any,
    body: any,
    query: any,
    files: any,
  };
  validatedBody: any;
  validatedQuery: any;
  validatedParams: any;
}>
    `,
    );
  }

  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` * `);
  fileWrite(file, `The full router and dispatching\n`);

  if (file.relativePath.endsWith(".js")) {
    fileWrite(file, `@param {import("@compas/server").Middleware} bodyParser`);
    fileWrite(file, `@returns {import("@compas/server").Middleware}`);
  }

  fileContextRemoveLinePrefix(file, 1);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  if (file.relativePath.endsWith(".js")) {
    fileBlockStart(file, `export function router(bodyParser)`);
  } else {
    fileBlockStart(
      file,
      `export function router(bodyParser: (ctx: import("koa").Context) => Promise<void>): import("koa").Middleware`,
    );
  }

  fileWrite(file, `const routes = {`);
  fileContextSetIndent(file, 1);

  for (const group of Object.keys(routesPerGroup)) {
    fileWrite(file, `${group}: {`);
    fileContextSetIndent(file, 1);

    const routes = routesPerGroup[group];
    for (const route of routes) {
      const contextNames = contextNamesMap.get(route) ?? {};

      if (file.relativePath.endsWith(".js")) {
        fileWrite(file, `${route.name}: async (params, ctx, next) => {`);
      } else {
        fileWrite(
          file,
          `${route.name}: async (params: Record<string, any>, ctx: _Context, next: () => Promise<void>) => {`,
        );
      }
      fileContextSetIndent(file, 1);

      fileBlockStart(file, `if (ctx.event)`);
      fileWrite(
        file,
        `eventRename(ctx.event, "router.${route.group}.${route.name}");`,
      );
      fileBlockEnd(file);

      fileWrite(file, `ctx.request.params = params;`);

      if (route.body || route.query) {
        if (file.relativePath.endsWith(".ts")) {
          fileWrite(file, `await bodyParser(ctx as any);`);
        } else {
          fileWrite(file, `await bodyParser(ctx);`);
        }
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

      if (file.relativePath.endsWith(".ts")) {
        fileWrite(file, `await ${group}Handlers.${route.name}(ctx as any);`);
      } else {
        fileWrite(file, `await ${group}Handlers.${route.name}(ctx);`);
      }

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

  fileWrite(file, `// @ts-expect-error this always exists`);
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
