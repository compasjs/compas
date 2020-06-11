import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { compileDynamicTemplates } from "../../utils.js";
import { generatorTemplates } from "../templates.js";

export async function init() {
  generatorTemplates.globals.quote = (x) => `"${x}"`;
  await compileTemplateDirectory(
    generatorTemplates,
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
  await compileValidatorExec(options);
  return {
    path: "./validators.js",
    source: executeTemplate(generatorTemplates, "validatorsFile", {
      ...data,
      options,
    }),
  };
}

/**
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
async function compileValidatorExec(options) {
  compileDynamicTemplates(generatorTemplates, options, "validator", {
    fnStringStart: `{{ let result = ''; }}`,
    fnStringAdd: (type, templateName) =>
      `{{ if (it.type === "${type.name}") { }}{{ result = ${templateName}(it); }}{{ } }}\n`,
    fnStringEnd: `
   {{= result.trim() }} 
  `,
  });
}
