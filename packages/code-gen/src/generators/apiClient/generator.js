import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { generatorTemplates } from "../index.js";

export async function init() {
  await compileTemplateDirectory(
    generatorTemplates,
    join(dirnameForModule(import.meta), "./templates"),
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
  options.enableMocks = options.enabledGenerators.indexOf("mock") !== -1;

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
