import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

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

  if (!app.generators.has("apiClient")) {
    throw new Error("ReactQuery plugin depends on the apiClient plugin");
  }

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
  return {
    path: "./reactQueries.ts",
    source: executeTemplate(app.templateContext, "reactQueryFile", {
      ...data,
      options,
    }),
  };
}
