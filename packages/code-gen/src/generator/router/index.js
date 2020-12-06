import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { TypeCreator } from "../../builders/index.js";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";
import { buildTrie } from "./trie.js";

/**
 * @param {CodeGenContext} context
 */
export function generateRouterFiles(context) {
  if (!context.options.throwingValidators) {
    throw new Error(`Option 'throwingValidators' not enabled. The router generator requires this.
  Please add 'throwingValidators' to the 'App.generate({ throwingValidators: true })' call.`);
  }

  const routeTrie = buildTrie(context.structure);
  const routeTags = buildRouteTags(context.structure);

  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );

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
