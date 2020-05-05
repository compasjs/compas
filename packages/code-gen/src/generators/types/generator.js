import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { compileDynamicTemplates } from "../../utils.js";

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
    path: options.useTypescript ? "types.ts" : "types.js",
    source: executeTemplate(app.templateContext, "typesFile", {
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
    path: options.useTypescript ? "types.ts" : "types.js",
    source: executeTemplate(app.templateContext, "typesFile", {
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
  const key = options.useTypescript ? "tsType" : "jsType";
  compileDynamicTemplates(
    tc,
    options,
    "type",
    {
      fnStringStart: `{{ let result = ''; }}`,
      fnStringAdd: (type, templateName) =>
        `{{ if (it.type === "${type.name}") { }}{{ result = ${templateName}(it); }}{{ } }}\n`,
      fnStringEnd: `
   {{ if (it.isInputType) { }}
     {{ if (it.model && it.model.isOptional) { }}
       {{ result += "|undefined"; }}
     {{ } }}
   {{ } else { }}
     {{ if (it.model.isOptional && it.model.defaultValue === undefined) { }}
       {{ result += "|undefined"; }}       
     {{ } }}
   {{ } }}
   {{= result.trim().replace(/\\s+/g, " ") }} 
  `,
    },
    key,
  );

  await compileTemplateDirectory(
    tc,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}
