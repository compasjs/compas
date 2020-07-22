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
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
  let template = options.useStubGenerators
    ? "apiClientStubsJsFile"
    : "apiClientFile";
  let path = "./apiClient.js";

  if (options.useTypescript && options.useStubGenerators) {
    template = "apiClientStubsTsFile";
    path = "./apiClient.ts";
  }

  return {
    path,
    source: executeTemplate(generatorTemplates, template, {
      ...data,
      options,
    }),
  };
}
