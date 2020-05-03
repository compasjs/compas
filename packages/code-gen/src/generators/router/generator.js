import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { getInternalRoutes } from "./internalRoutes.js";
import { buildTrie } from "./trie.js";

/**
 * @param {App} app
 * @return {Promise<void>}
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
 * @param {GenerateOptions} options
 * @return {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
export async function preGenerate(app, options) {
  app.add(...getInternalRoutes());
}

/**
 * @param {App} app
 * @param {GenerateOptions} options
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, options, data) {
  data.stringified = JSON.stringify(data);
  data.routeTrie = buildTrie(data);
  data.routeTags = buildRouteTags(data);

  return {
    path: "./router.js",
    source: executeTemplate(app.templateContext, "routerFile", {
      ...data,
      options,
    }),
  };
}

/**
 * @param {App} app
 * @param {GenerateStubsOptions} options
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generateStubs(app, options, data) {
  return {
    path: "./router.js",
    source: executeTemplate(app.templateContext, "routerStubsFile", {
      ...data,
      options,
    }),
  };
}

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
