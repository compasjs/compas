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
 * @param {GeneratorOptions} input
 * @returns {Promise<void>}
 */
export async function preGenerate(app, { options }) {
  if (!options.useTypescript) {
    throw new Error("ReactQuery generator requires `useTypescript` to be true");
  }

  if (options.enabledGenerators.indexOf("apiClient") === -1) {
    throw new Error("ReactQuery plugin depends on the apiClient plugin");
  }
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, input) {
  return {
    path: "./reactQueries.ts",
    source: executeTemplate(generatorTemplates, "reactQueryFile", input),
  };
}
