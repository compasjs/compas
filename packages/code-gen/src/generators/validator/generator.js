import {
  compileTemplate,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { TypeCreator } from "../../types/index.js";
import { extractValidatorsToGenerate } from "./transform.js";

const store = new Set();

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function init(app) {
  store.clear();

  collectTypes(app);

  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
  app.templateContext.globals.quote = (x) => `"${x}"`;

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
 * @return {Promise<void>}
 */
export async function dumpStore(app, result) {
  const validators = new Set();

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
      ...data,
      validatorsToGenerate,
      opts: app.options,
    }),
  };
}

/**
 * @param {App} app
 */
function collectTypes(app) {
  let fnString = `{{ let result = ''; }}`;

  for (const type of TypeCreator.types.values()) {
    if ("validator" in type) {
      const templateName = `${type.name}Validator`;
      compileTemplate(app.templateContext, templateName, type.validator());

      fnString += `{{ if (it.type === "${type.name}") { }}{{ result = ${templateName}(it); }}{{ } }}\n`;
    }
  }

  fnString += `
   {{= result.trim() }} 
  `;

  compileTemplate(app.templateContext, "validatorExec", fnString);
}
