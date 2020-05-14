import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { compileDynamicTemplates } from "../../utils.js";

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function init(app) {
  app.templateContext.globals.quote = (x) => `"${x}"`;
}

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
    path: "./validators.js",
    source: executeTemplate(app.templateContext, "validatorsFile", {
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
  compileDynamicTemplates(tc, options, "validator", {
    fnStringStart: `{{ let result = ''; }}`,
    fnStringAdd: (type, templateName) =>
      `{{ if (it.type === "${type.name}") { }}{{ result = ${templateName}(it); }}{{ } }}\n`,
    fnStringEnd: `
   {{= result.trim() }} 
  `,
  });

  await compileTemplateDirectory(
    tc,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}
