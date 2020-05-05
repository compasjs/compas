import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { TypeBuilder } from "../../types/index.js";
import { compileDynamicTemplates } from "../../utils.js";

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
 * @param {GenerateOptions} options
 * @return {Promise<void>}
 */
export async function preGenerate(app, options) {
  await compileTemplates(app.templateContext, options);
}

/**
 * @param {App} app
 * @param {GenerateOptions} options
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, options, data) {
  return {
    path: "./mocks.js",
    source: executeTemplate(app.templateContext, "mocksFile", {
      ...data,
      options,
    }),
  };
}

/**
 * @param {App} app
 * @param {GenerateStubsOptions} options
 * @return {Promise<void>}
 */
export async function preGenerateStubs(app, options) {
  await compileTemplates(app.templateContext, options);
}

/**
 * @param {App} app
 * @param {GenerateStubsOptions} options
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generateStubs(app, options, data) {
  return {
    path: "./mocks.js",
    source: executeTemplate(app.templateContext, "mocksFile", {
      ...data,
      options,
    }),
  };
}

/**
 * @param {TemplateContext} tc
 * @param {GenerateOptions} options
 * @return {Promise<void>}
 */
async function compileTemplates(tc, options) {
  compileDynamicTemplates(tc, options, "mock", {
    fnStringStart: `
  {{ if (it.model && it.model.mocks && it.model.mocks.rawMock) { }}
     {{= it.model.mocks.rawMock }}
   {{ } }}
  {{ let result = ''; }}`,
    fnStringAdd: (type, templateName) =>
      `{{ if (it.type === "${type.name}") { }}{{ result += ${templateName}({ ...it }); }}{{ } }}\n`,
    fnStringEnd: `
    {{ if (it.model && it.model.isOptional) { }}
      {{ if (model.defaultValue !== undefined && !it.isInputType) { }}
        {{ result += model.defaultValue + ","; }}
      {{ } else { }}
        {{ result += "undefined,"; }}
      {{ } }}
    {{ } }}
    
  
  {{ if (result.split(",\\n").length === 1) { }}
  {{= result.trim().replace(/\\s+/g, " ") }}
  {{ } else { }}
   _mocker.pickone([ {{= result.trim().replace(/\\s+/g, " ") }} ])
   {{ } }} 
  `,
  });

  await compileTemplateDirectory(
    tc,

    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
}
