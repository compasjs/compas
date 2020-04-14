import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { decorateModels } from "./decoreModels.js";
import { extractValidatorsToGenerate } from "./transform.js";

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
  app.templateContext.globals.quote = (x) => `"${x}"`;

  decorateModels();

  app.constructor.prototype.validator = function (...models) {
    for (const m of models) {
      app.model(m);
      store.add(m);
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
  const validators = new Set();

  for (const extender of extendsFrom) {
    for (const v of extender.validators || []) {
      validators.add(v);
    }
  }

  for (const m of store) {
    validators.add(m.data.uniqueName);
  }

  // Get a unique list
  result.validators = [...validators];
}

/**
 * @param {App} app
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data) {
  const validatorsToGenerate = [];

  for (const validator of data.validators) {
    extractValidatorsToGenerate(
      data.models,
      data.models[validator],
      validatorsToGenerate,
    );
  }

  return {
    path: "./validators.js",
    source: executeTemplate(app.templateContext, "validatorsFile", {
      models: data.models,
      validatorsToGenerate,
      ctx: { counter: 0, functions: "" },
      opts: app.options,
    }),
  };
}
