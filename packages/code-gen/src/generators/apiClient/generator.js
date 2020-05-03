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
 * @param {GenerateStubsOptions} options
 * @return {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
export async function preGenerateStubs(app, options) {
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

/**
 * @param {App} app
 * @param {GenerateStubsOptions} options
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generateStubs(app, options, data) {
  return {
    path: options.useTypescript ? "./apiClient.ts" : "./apiClient.js",
    source: executeTemplate(
      app.templateContext,
      options.useTypescript ? "apiClientStubsTsFile" : "apiClientStubsJsFile",
      {
        ...data,
        options,
      },
    ),
  };
}
