// @ts-nocheck

import { dirnameForModule, isNil, pathJoin } from "@compas/stdlib";
import { AnyType, ObjectType, TypeCreator } from "../../builders/index.js";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";
import { getTypeNameForType } from "../types.js";
import { buildTrie } from "./trie.js";

/**
 * @param {CodeGenContext} context
 */
export function generateRouterFiles(context) {
  // TODO: Handle validators

  const routeTrie = buildTrie(context.structure);
  const routeTags = buildRouteTags(context.structure);

  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );

  const groupMiddleware = new ObjectType("group", "middleware")
    .keys({})
    .build();
  groupMiddleware.uniqueName = "GroupMiddleware";

  for (const group of Object.keys(context.structure)) {
    const groupStructure = context.structure[group];
    const hasRouteType = Object.values(groupStructure).find(
      (it) => it.type === "route",
    );

    if (isNil(hasRouteType)) {
      continue;
    }

    const contents = executeTemplate("routerGroupFile", {
      groupStructure,
      groupName: group,
    });

    context.outputFiles.push({
      contents,
      relativePath: `./${group}/controller${context.extension}`,
    });

    for (const route of Object.values(groupStructure)) {
      if (route.type !== "route") {
        continue;
      }

      getTypeNameForType(
        context,
        {
          type: "any",
          uniqueName: `${route.uniqueName}Ctx`,
          rawValue: `Context<{}, {
          event: InsightEvent,
          log: Logger,
          ${
            route.query
              ? `validatedQuery: ${route.query.reference.uniqueName},`
              : ""
          }
          ${
            route.params
              ? `validatedParams: ${route.params.reference.uniqueName},`
              : ""
          }
          ${
            route.body
              ? `validatedBody: ${route.body.reference.uniqueName},`
              : ""
          }
          ${
            route.files
              ? `validatedFiles: ${route.files.reference.uniqueName},`
              : ""
          }
        }, ${
          route.response ? route.response.reference.uniqueName : `unknown`
        }>`,
          rawValueImport: {
            typeScript: `import { ParameterizedContext as Context } from "koa";\nimport { InsightEvent, Logger } from "@compas/stdlib";`,
          },
        },
        "",
        {},
      );
      getTypeNameForType(
        context,
        {
          type: "any",
          uniqueName: `${route.uniqueName}Fn`,
          rawValue: `(ctx: ${route.uniqueName}Ctx, next: Next) => (void|Promise<void>)`,
          rawValueImport: {
            typeScript: `import { Next } from "@compas/server";`,
          },
        },
        "",
        {},
      );
    }

    groupMiddleware.keys[group] = new AnyType()
      .raw("Middleware|Middleware[]", {
        typeScript: `import { Middleware } from "@compas/server";`,
      })
      .build();
  }

  getTypeNameForType(context, groupMiddleware, "", {});

  const contents = executeTemplate("routerFile", {
    routeTrie,
    routeTags,
    extension: context.extension,
    importExtension: context.extension,
    structure: context.structure,
    options: context.options,
  });

  context.outputFiles.push({
    contents,
    relativePath: `./common/router${context.extension}`,
  });
}

/**
 * @param {GenerateOpts} options
 */
export function getInternalRoutes(options) {
  const T = new TypeCreator("compas");
  const G = T.router("_compas/");
  const tags = ["_compas"];

  const result = [];

  if (options.dumpApiStructure) {
    result.push(
      G.get("structure.json", "structure")
        .response(T.any())
        .tags(...tags)
        .docs("Return the full generated structure as a json object."),
    );
  }

  return result;
}

/**
 * @param {CodeGenStructure} data
 */
function buildRouteTags(data) {
  const set = new Set();

  for (const group of Object.values(data)) {
    for (const item of Object.values(group)) {
      if (item.type === "route") {
        for (const t of item.tags) {
          set.add(t);
        }
      }
    }
  }

  return [...set];
}
