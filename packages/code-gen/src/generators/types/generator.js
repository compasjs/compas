import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { compileDynamicTemplates } from "../../utils.js";

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @return {Promise<void>}
 */
export async function preGenerate(app, data, options) {
  await compileTemplates(app.templateContext, options);
}

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
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
 * @param {GenerateOpts} options
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
