import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { upperCaseFirst } from "../../utils.js";
import { decorateModels } from "./decoreModels.js";
import { extractValidatorsToGenerate, transform } from "./transform.js";

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
  result.validators = [];

  for (const m of store) {
    result.validators.push(upperCaseFirst(m.item.name));
  }
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

  console.log(validatorsToGenerate);

  const validatorFunctions = transform({
    models: data.models,
    validators: validatorsToGenerate,
  });

  return {
    path: "./validators.js",
    source: executeTemplate(app.templateContext, "validatorsFile", {
      models: data.models,
      validatorFunctions,
      opts: app.options,
    }),
  };
}
