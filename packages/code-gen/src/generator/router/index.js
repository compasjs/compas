import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { TypeCreator } from "../../builders/index.js";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/tag.js";
import { getTypeNameForType } from "../types.js";
import { buildTrie } from "./trie.js";

/**
 * @param {CodeGenContext} context
 */
export function generateRouterFiles(context) {
  const routeTrie = buildTrie(context.structure);
  const routeTags = buildRouteTags(context.structure);

  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );

  addRouterTypes(context);

  const contents = executeTemplate("routerFile", {
    routeTrie,
    routeTags,
    extension: context.extension,
    importExtension: context.extension,
    structure: context.structure,
    options: context.options,
  });

  context.outputFiles.push({
    contents: contents,
    relativePath: `./router${context.extension}`,
  });
  context.rootExports.push(
    `export * from "./router${context.importExtension}";`,
  );
}

/**
 * A all necessary router types
 * @param {CodeGenContext} context
 */
function addRouterTypes(context) {
  const groupMiddlewarePartials = [];

  context.types.imports.destructureImport("Context", "@lbu/server");
  context.types.imports.destructureImport("DefaultState", "@lbu/server");
  context.types.imports.destructureImport("DefaultContext", "@lbu/server");
  context.types.imports.destructureImport("Middleware", "@lbu/server");
  context.types.imports.destructureImport("Next", "@lbu/server");

  for (const group of Object.keys(context.structure)) {
    // GroupMiddleware partials
    groupMiddlewarePartials.push(
      `${group}: GroupFn${upperCaseFirst(group)}|GroupFn${upperCaseFirst(
        group,
      )}[]|undefined;`,
    );

    // GroupMiddleware sub type
    context.types.rawTypes.push(
      `export type GroupContext${upperCaseFirst(
        group,
      )}<StateT = DefaultState, CustomT = DefaultContext> = Context<StateT, CustomT>;`,
      `export type GroupFn${upperCaseFirst(
        group,
      )} = (ctx: GroupContext${upperCaseFirst(
        group,
      )}, next: Next) => (void | Promise<void>);`,
    );

    for (const type of Object.values(context.structure[group])) {
      if (type.type !== "route") {
        continue;
      }

      context.types.rawTypes.push(`
        export type ${
          type.uniqueName
        }Ctx<StateT = DefaultState, CustomT = DefaultContext> = GroupContext${upperCaseFirst(
        group,
      )}<StateT, CustomT> & {
          ${
            type.query
              ? `validatedQuery: ${type.query.reference.uniqueName};`
              : ""
          }
          ${
            type.params
              ? `validatedParams: ${type.params.reference.uniqueName};`
              : ""
          }
          ${
            type.body ? `validatedBody: ${type.body.reference.uniqueName};` : ""
          }
          ${
            type.files
              ? `validatedFiles: ${getTypeNameForType(
                  context,
                  type.files.reference,
                  "Validated",
                  { fileTypeIO: "outputRouter" },
                )};`
              : ""
          }
          ${type.response ? `body: ${type.response.reference.uniqueName};` : ""}
        };
      `);

      context.types.rawTypes.push(`
        export type ${type.uniqueName}Fn = (ctx: ${type.uniqueName}Ctx, next: Next) => (void | Promise<void>);
      `);
    }
  }

  context.types.rawTypes.push(
    `export type ReadableStream = NodeJS.ReadableStream;`,
    js`export interface GroupMiddleware {
      ${groupMiddlewarePartials}
    }`,
  );
}

/**
 * @param {GenerateOpts} options
 */
export function getInternalRoutes(options) {
  const T = new TypeCreator("lbu");
  const G = T.router("_lbu/");
  const tags = ["_lbu"];

  const result = [];

  if (options.dumpStructure) {
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
