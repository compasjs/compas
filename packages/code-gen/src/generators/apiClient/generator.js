import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { executeTemplate, compileTemplateDirectory } from "../../template.js";

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
  const template = "apiClientFile";
  const path = "./apiClient.js";

  return {
    path,
    source: executeTemplate(template, {
      structure,
      options,
    }),
  };
}
