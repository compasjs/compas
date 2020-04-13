import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { decorateModels } from "./decorateModels.js";
import { mockForType } from "./js-templates/mockForType.js";

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function init(app) {
  await compileTemplateDirectory(
    app.templateContext,

    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
  app.templateContext.globals["mockForType"] = mockForType;

  decorateModels();
}

/**
 * @param {App} app
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data) {
  return {
    path: "./mocks.js",
    source: executeTemplate(app.templateContext, "mocksFile", {
      ...data,
      opts: app.options,
    }),
  };
}
