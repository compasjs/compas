import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { addToData } from "../../generate.js";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";
import { getInternalRoutes } from "./internalRoutes.js";
import { buildTrie } from "./trie.js";

export function init() {
  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<void>}
 */
export async function preGenerate(app, { structure, options }) {
  if (options.enabledGenerators.indexOf("validator") === -1) {
    throw new Error("router generator depends on validator generator");
  }
  for (const r of getInternalRoutes(options)) {
    addToData(structure, r.build());
  }
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, { structure, options }) {
  const routeTrie = buildTrie(structure);
  const routeTags = buildRouteTags(structure);

  const template = "routerFile";

  return {
    path: "./router.js",
    source: executeTemplate(template, {
      routeTrie,
      routeTags,
      structure,
      options,
    }),
  };
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
