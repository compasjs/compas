import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { TypeBuilder } from "../../types/index.js";
import { mockForType } from "./js-templates/mockForType.js";

/**
 * @name TypeBuilder#mock
 * @param {string} mockFn Raw mock string that is inserted. Use _mocker or __ to access
 *   the Chance instance
 * @return {TypeBuilder}
 */
TypeBuilder.prototype.mock = function (mockFn) {
  if (!this.data.mocks) {
    this.data.mocks = {};
  }
  this.data.mocks = mockFn.replace(/__/g, "_mocker");

  return this;
};

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
