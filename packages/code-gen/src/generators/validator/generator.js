import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";
import { compileDynamicTemplates } from "../../utils.js";

export function init() {
  compileTemplateDirectory(
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
    source: executeTemplate("validatorsFile", {
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
  compileDynamicTemplates(options, "validator", {
    fnStringStart: `{{ let result = ''; }}`,
    fnStringAdd: (type, templateName) =>
      `{{ if (it.type === "${type.name}") { }}{{ result = ${templateName}(it); }}{{ } }}\n`,
    fnStringEnd: `
   {{= result.trim() }} 
  `,
  });
}
