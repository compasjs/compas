import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  pathJoin,
} from "@lbu/stdlib";
import { compileDynamicTemplates } from "../../utils.js";
import { generatorTemplates } from "../templates.js";

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
  await compileTypeExec(options);
  return {
    path: options.useTypescript ? "types.ts" : "types.js",
    source: executeTemplate(generatorTemplates, "typesFile", {
      ...data,
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
    generatorTemplates,
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
}
