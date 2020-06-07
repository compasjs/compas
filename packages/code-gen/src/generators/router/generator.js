import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { addToData } from "../../generate.js";
import { getInternalRoutes } from "./internalRoutes.js";
import { buildTrie } from "./trie.js";

/**
 * @param {App} app
 * @returns {Promise<void>}
 */
export async function init(app) {
  if (!app.generators.has("validator")) {
    throw new Error("router depends on validators");
  }

  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param data
 * @returns {Promise<void>}
 */
export async function preGenerate(app, data) {
  for (const r of getInternalRoutes()) {
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

  const template = options.useStubGenerators ? "routerStubsFile" : "routerFile";

  return {
    path: "./router.js",
    source: executeTemplate(app.templateContext, template, {
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
