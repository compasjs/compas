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
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, { structure, options }) {
  const template = "apiClientFile";
  const path = "./apiClient.js";

  return {
    path,
    source: executeTemplate(generatorTemplates, template, {
      structure,
      options,
    }),
  };
}
