import {
  compileTemplate,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  isNil,
} from "@lbu/stdlib";
import { join } from "path";
import { normalizeModelsRecursively } from "./normalizeModelsRecursively.js";
import { processExtendsFrom, processStore } from "./process.js";

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

  /**
   * @name App#model
   * @param {...TypeBuilder} models
   * @return app;
   */
  app.constructor.prototype.model = function (...models) {
    for (const model of models) {
      if (
        isNil(model) ||
        isNil(model.data) ||
        isNil(model.data.uniqueName) ||
        model.data.uniqueName.trim().length === 0
      ) {
        throw new Error("App#model expects a named TypeBuilder");
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

  const extendsResult = processExtendsFrom(result.models, extendsFrom);
  const processResult = processStore(result.models, store);

  if (extendsResult.length !== 0 && processResult.length !== 0) {
    app.logger.info("Overwrote some models", {
      nonUniqueExtend: extendsResult,
      nonUniqueStore: processResult,
    });
  }

  for (const model of Object.keys(result.models)) {
    normalizeModelsRecursively(result.models, result.models[model]);
  }

  const groups = new Set();

  for (const model of Object.keys(result.models)) {
    groups.add(result.models[model].group);
  }

  result.groups = [...groups];
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

/**
 * @param {App} app
 */
function collectTypes(app) {
  const useTypescript = app.options && app.options.useTypescript;
  const key = useTypescript ? "tsType" : "jsType";

  let fnString = `{{ let result = ''; }}`;

  app.options.models = app.options.models || {};
  app.options.models.enabledTypes = [];

  for (const type of app.types) {
    if (key in type) {
      app.options.models.enabledTypes.push(type.name);

      const templateName = `${type.name}Type`;
      compileTemplate(app.templateContext, templateName, type[key]());

      fnString += `{{ if (it.type === "${type.name}") { }}{{ result = ${templateName}(it); }}{{ } }}\n`;
    }
  }

  fnString += `
   {{ if (it.ignoreDefaults) { }}
     {{ if (it.model && it.model.isOptional) { }}
       {{ result += "|undefined"; }}
     {{ } }}
   {{ } else { }}
     {{ if (it.model.isOptional && it.model.defaultValue === undefined) { }}
       {{ result += "|undefined"; }}       
     {{ } }}
   {{ } }}
   {{= result.trim().replace(/\\s+/g, " ") }} 
  `;

  compileTemplate(app.templateContext, "typeExec", fnString);
}
