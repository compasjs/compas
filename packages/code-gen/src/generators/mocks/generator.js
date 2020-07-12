import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  pathJoin,
} from "@lbu/stdlib";
import { TypeBuilder } from "../../types/index.js";
import { compileDynamicTemplates } from "../../utils.js";
import { generatorTemplates } from "../index.js";

/**
 * @name TypeBuilder#mock
 * @param {string} mockFn Raw mock string that is inserted. Use _mocker or __ to access
 *   the Chance instance
 * @returns {TypeBuilder}
 */
TypeBuilder.prototype.mock = function (mockFn) {
  if (!this.data.mocks) {
    this.data.mocks = {};
  }
  this.data.mocks.rawMock = mockFn.replace(/__/g, "_mocker");

  return this;
};

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
  await compileMockExec(options);

  return {
    path: "./mocks.js",
    source: executeTemplate(generatorTemplates, "mocksFile", {
      ...data,
      options,
    }),
  };
}

/**
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
async function compileMockExec(options) {
  compileDynamicTemplates(generatorTemplates, options, "mock", {
    fnStringStart: `
  {{ if (it.model && it.model.mocks && it.model.mocks.rawMock) { }}
     {{= it.model.mocks.rawMock }}
   {{ } else { }}
  {{ let result = ''; }}
  {{ if (false) { }}
  `,
    fnStringAdd: (type, templateName) =>
      `{{ } else if (it.type === "${type.name}") { }}{{ result += ${templateName}({ ...it }); }}\n`,
    fnStringEnd: `
    {{ } else { }}
    {{ result += "_mocker.falsy()"; }}
    {{ } }}
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
  {{ } }}
  `,
  });
}
