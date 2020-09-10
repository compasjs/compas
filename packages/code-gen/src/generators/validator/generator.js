import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  pathJoin,
} from "@lbu/stdlib";
import { compileDynamicTemplates } from "../../utils.js";
import { generatorTemplates } from "../templates.js";

export async function init() {
  generatorTemplates.globals.quote = (x) => `"${x}"`;
  await compileTemplateDirectory(
    generatorTemplates,
    pathJoin(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, { structure, options }) {
  await compileValidatorExec(options);
  return {
    path: "./validators.js",
    source: executeTemplate(generatorTemplates, "validatorsFile", {
      structure,
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
