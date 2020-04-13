import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  isNil,
} from "@lbu/stdlib";
import { join } from "path";
import { upperCaseFirst } from "../../utils.js";
import { generateJsDoc } from "./js-templates/generateJsDoc.js";
import { generateTsType } from "./js-templates/generateTsType.js";
import { normalizeModelsRecursively } from "./normalizeModelsRecursively.js";

const store = new Set();

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function init(app) {
  store.clear();

  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );

  app.templateContext.globals["generateJsDoc"] = generateJsDoc;
  app.templateContext.globals["generateTsType"] = generateTsType;

  /**
   * @name App#model
   * @param {...ModelBuilder} models
   * @return app;
   */
  app.constructor.prototype.model = function (...models) {
    for (const model of models) {
      if (
        isNil(model) ||
        isNil(model.item) ||
        isNil(model.item.name) ||
        model.item.name.trim().length === 0
      ) {
        throw new Error("App#model expects a named ModelBuilder");
      }

      store.add(model);
    }

    return this;
  };
}

/**
 * @param {App} app
 * @param {object} result
 * @param {...object} extendsFrom
 * @return {Promise<void>}
 */
export async function dumpStore(app, result, ...extendsFrom) {
  result.models = {};
  for (const model of store.values()) {
    const build = model.build();
    build.name = upperCaseFirst(build.name);
    result.models[build.name] = build;
  }

  for (const model of Object.keys(result.models)) {
    normalizeModelsRecursively(result.models, result.models[model]);
  }
}

/**
 * @param {App} app
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data) {
  return {
    path: app.options.useTypescript ? "./types.ts" : "./types.js",
    source: executeTemplate(app.templateContext, "typesFile", {
      ...data,
      opts: app.options,
    }),
  };
}
