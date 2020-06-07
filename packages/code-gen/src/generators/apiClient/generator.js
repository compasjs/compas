import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
export async function preGenerate(app, data, options) {
  options.enableMocks = app.generators.has("mock");

  await compileTemplateDirectory(
    app.templateContext,
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
    source: executeTemplate(app.templateContext, template, {
      ...data,
      options,
    }),
  };
}
