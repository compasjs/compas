import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  pathJoin,
} from "@lbu/stdlib";
import { generatorTemplates } from "../index.js";

export async function init() {
  await compileTemplateDirectory(
    generatorTemplates,
    pathJoin(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}

/**
 *
 * @param {App} app
 * @param {*} data
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
export async function preGenerate(app, data, options) {
  if (!options.useTypescript) {
    throw new Error("ReactQuery generator requires `useTypescript` to be true");
  }

  if (options.enabledGenerators.indexOf("apiClient") === -1) {
    throw new Error("ReactQuery plugin depends on the apiClient plugin");
  }
}

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
  return {
    path: "./reactQueries.ts",
    source: executeTemplate(generatorTemplates, "reactQueryFile", {
      ...data,
      options,
    }),
  };
}
