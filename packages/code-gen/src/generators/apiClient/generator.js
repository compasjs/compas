import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function init(app) {
  app.options.enableMocks = app.generators.has("mock");

  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data) {
  return {
    path: "./apiClient.js",
    source: executeTemplate(app.templateContext, "apiClientFile", {
      ...data,
      opts: app.options,
    }),
  };
}
