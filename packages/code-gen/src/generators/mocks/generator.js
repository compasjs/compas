import {
  compileTemplate,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { TypeBuilder } from "../../types/index.js";

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
  collectTypes(app);

  await compileTemplateDirectory(
    app.templateContext,

    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
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

/**
 * @param {App} app
 */
function collectTypes(app) {
  let fnString = `
  {{ if (it.model && it.model.mocks && it.model.mocks.rawMock) { }}
     {{= it.model.mocks.rawMock }}
   {{ } }}
  {{ let result = ''; }}`;

  for (const type of app.types) {
    if ("mock" in type) {
      const templateName = `${type.name}Mock`;
      compileTemplate(app.templateContext, templateName, type.mock());

      fnString += `{{ if (it.type === "${type.name}") { }}{{ result += ${templateName}({ ...it }); }}{{ } }}\n`;
    }
  }

  fnString += `
    {{ if (it.model && it.model.isOptional) { }}
      {{ if (model.defaultValue !== undefined && !it.ignoreDefaults) { }}
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
  `;

  compileTemplate(app.templateContext, "mockExec", fnString);
}
