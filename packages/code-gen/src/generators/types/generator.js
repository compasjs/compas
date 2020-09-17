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
 * @returns {Promise<void>}
 */
export async function preGenerate(app, { options }) {
  await compileTypeExec(options);
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, { structure, options }) {
  await compileTypeExec(options);
  return {
    path: options.useTypescript ? "types.ts" : "types.js",
    source: executeTemplate("typesFile", {
      structure,
      options,
    }),
  };
}

/**
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
async function compileTypeExec(options) {
  const key = options.useTypescript ? "tsType" : "jsType";
  compileDynamicTemplates(
    options,
    "type",
    {
      fnStringStart: `{{ let result = ''; }}`,
      fnStringAdd: (type, templateName) =>
        `{{ if (it.type === "${type.name}") { }}{{ result = ${templateName}(it); }}{{ } }}\n`,
      fnStringEnd: `
   {{ if (it.isInputType) { }}
     {{ if (it.item && it.item.isOptional) { }}
       {{ result += "|undefined"; }}
     {{ } }}
   {{ } else { }}
     {{ if (it.item.isOptional && it.item.defaultValue === undefined) { }}
       {{ result += "|undefined"; }}       
     {{ } }}
   {{ } }}
   {{= result.trim().replace(/\\s+/g, " ") }} 
  `,
    },
    key,
  );
}
