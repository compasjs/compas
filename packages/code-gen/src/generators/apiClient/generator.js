import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

/**
 * @param {App} app
 * @param {GenerateOptions} options
 * @return {Promise<void>}
 */
export async function preGenerate(app, options) {
  options.enableMocks = app.generators.has("mock");

  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param {GenerateOptions} options
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, options, data) {
  return {
    path: "./apiClient.js",
    source: executeTemplate(app.templateContext, "apiClientFile", {
      ...data,
      options,
    }),
  };
}
