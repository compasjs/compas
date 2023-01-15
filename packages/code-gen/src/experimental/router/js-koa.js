import { AnyType } from "../../builders/index.js";
import { upperCaseFirst } from "../../utils.js";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextGetOptional,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileWrite } from "../file/write.js";
import { routeStructureGet } from "../processors/route-structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { typesCacheGet } from "../types/cache.js";
import {
  typesGeneratorGenerateNamedType,
  typesGeneratorUseTypeName,
} from "../types/generator.js";

/**
 * Get the router file for the provided group
 *
 * @param {import("../generate").GenerateContext} generateContext
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
 * @param {import("../generate").GenerateContext} generateContext
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
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @param {Record<string, string>} contextNames
 */
export function jsKoaPrepareContext(
  generateContext,
  file,
  route,
  contextNames,
) {
  let partial = ``;
  partial += contextNames.paramsType
    ? `  validatedParams: ${contextNames.paramsTypeName},\n`
    : "";
  partial += contextNames.queryType
    ? `  validatedQuery: ${contextNames.queryTypeName},\n`
    : "";
  partial += contextNames.filesType
    ? `  validatedFiles: ${contextNames.filesTypeName},\n`
    : "";
  partial += contextNames.bodyType
    ? `  validatedBody: ${contextNames.bodyTypeName},\n`
    : "";

  const ctxType = new AnyType(route.group, `${route.name}Ctx`)
    .raw(
      `import("@koa").ExtendableContext & {
  event: import("@compas/stdlib").InsightEvent,
  log: import("@compas/stdlib").Logger,${
    partial.length > 0 ? `\n  ${partial.trim()}` : ""
  }
} & { body: ${contextNames.responseTypeName ?? "any"} }`,
    )
    .build();

  typesGeneratorGenerateNamedType(generateContext, ctxType, {
    validatorState: "output",
    nameSuffix: "",
    typeOverrides: {},
  });

  // @ts-expect-error
  contextNames[`ctxTypeName`] = typesCacheGet(ctxType, {
    validatorState: "output",
    nameSuffix: "",
    typeOverrides: {},
  });

  contextNames[`ctxType`] = typesGeneratorUseTypeName(
    generateContext,
    file,
    contextNames[`ctxTypeName`],
  );

  const fnType = new AnyType(route.group, `${route.name}Fn`)
    .raw(
      `(
  ctx: ${upperCaseFirst(route.group ?? "")}${upperCaseFirst(
        route.name ?? "",
      )}Ctx,
  next: import("@compas/store").Next,
) => void | Promise<void>`,
    )
    .build();

  typesGeneratorGenerateNamedType(generateContext, fnType, {
    validatorState: "output",
    nameSuffix: "",
    typeOverrides: {},
  });

  // @ts-expect-error
  contextNames[`fnTypeName`] = typesCacheGet(fnType, {
    validatorState: "output",
    nameSuffix: "",
    typeOverrides: {},
  });

  contextNames[`fnType`] = typesGeneratorUseTypeName(
    generateContext,
    file,
    contextNames[`fnTypeName`],
  );
}

/**
 * @param {import("../file/context").GenerateFile} file
 * @param {string} group
 * @param {import("../generated/common/types").ExperimentalRouteDefinition[]} routes
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
      `${route.name}: (ctx, next) => { throw AppError.notImplemented() },`,
    );
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `};\n`);
}

/**
 * @param {import("../file/context").GenerateFile} file
 * @param {string} group
 * @param {import("../generated/common/types").ExperimentalRouteDefinition[]} routes
 
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
 * @param {import("../file/context").GenerateFile} file
 * @param {Record<string, import("../generated/common/types").ExperimentalRouteDefinition[]>} routesPerGroup
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

  fileWrite(file, `@param {import("@compas/server").BodyParserPair} parsers`);
  fileWrite(file, `@returns {import("@compas/server").Middleware}`);

  fileContextRemoveLinePrefix(file, 1);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  fileBlockStart(file, `export function router(parsers)`);

  fileWrite(file, `const routes = {`);
  fileContextSetIndent(file, 1);

  for (const [group, routes] of Object.entries(routesPerGroup)) {
    fileWrite(file, `${group}: {`);
    fileContextSetIndent(file, 1);

    for (const route of routes) {
      const contextNames = contextNamesMap.get(route) ?? {};

      const isAsync = route.files || route.body || route.query ? "async " : "";

      fileWrite(file, `${route.name}: ${isAsync}(params, ctx, next) => {`);
      fileContextSetIndent(file, 1);

      fileBlockStart(file, `if (ctx.event)`);
      fileWrite(
        file,
        `eventRename(ctx.event, "router.${route.group}.${route.name}");`,
      );
      fileBlockEnd(file);

      fileWrite(file, `ctx.request.params = params;`);

      if (route.files) {
        fileWrite(file, `await parsers.multipartBodyParser(ctx);`);
      } else if (route.body || route.query) {
        fileWrite(file, `await parsers.bodyParser(ctx);`);
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
          `const validatedQuery = ${
            contextNames[`queryValidator`]
          }(ctx.request.query);`,
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

      if (route.files) {
        fileWrite(
          file,
          `const validatedFiles = ${
            contextNames[`filesValidator`]
          }(ctx.request.files);`,
        );

        fileBlockStart(file, `if (validatedFiles.error)`);
        fileWrite(
          file,
          `throw AppError.validationError("validator.error", validatedFiles.error);`,
        );
        fileBlockEnd(file);

        fileBlockStart(file, `else`);
        fileWrite(file, `ctx.validatedFiles = validatedFiles.value;`);
        fileBlockEnd(file);
      }

      if (route.body) {
        fileWrite(
          file,
          `const validatedBody = ${
            contextNames[`bodyValidator`]
          }(ctx.request.body);`,
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

      fileWrite(file, `return ${group}Handlers.${route.name}(ctx, next);`);

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

  fileWrite(file, `if (!match) { throw AppError.notFound(); }\n`);

  // TODO: decodeUriComponent
  fileWrite(
    file,
    `return routes[match.route.group][match.route.name](match.params, ctx, next);`,
  );

  fileBlockEnd(file);

  fileBlockEnd(file);
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 */
export function jsKoaRegisterCompasStructureRoute(generateContext, file) {
  if (!generateContext.options.generators.router?.exposeApiStructure) {
    return;
  }

  fileWrite(
    file,
    `compasHandlers.structure = (ctx, next) => {
  ctx.set("Content-Type", "application/json");

  ctx.body = \`${routeStructureGet(generateContext)}\`;

  return next();
};
`,
  );
}
