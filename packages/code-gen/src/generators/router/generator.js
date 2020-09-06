import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  pathJoin,
} from "@lbu/stdlib";
import { addToData } from "../../generate.js";
import { generatorTemplates } from "../index.js";
import { getInternalRoutes } from "./internalRoutes.js";
import { buildTrie } from "./trie.js";

export async function init() {
  await compileTemplateDirectory(
    generatorTemplates,
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
export async function preGenerate(app, data, options) {
  if (options.enabledGenerators.indexOf("validator") === -1) {
    throw new Error("router generator depends on validator generator");
  }

  for (const r of getInternalRoutes(options)) {
    addToData(data, r.build());
  }
}

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
  data.routeTrie = buildTrie(data);
  data.routeTags = buildRouteTags(data);

  const template = "routerFile";

  return {
    path: "./router.js",
    source: executeTemplate(generatorTemplates, template, {
      ...data,
      options,
    }),
  };
}

/**
 * @param data
 */
function buildRouteTags(data) {
  const set = new Set();

  for (const group of Object.values(data.structure)) {
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
