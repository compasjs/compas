import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";

export function init() {
  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}

/**
 *
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<void>}
 */
export async function preGenerate(app, { options }) {
  if (!options.useTypescript) {
    throw new Error("ReactQuery generator requires `useTypescript` to be true");
  }

  if (options.enabledGenerators.indexOf("apiClient") === -1) {
    throw new Error("ReactQuery plugin depends on the apiClient plugin");
  }
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, input) {
  return {
    path: "./reactQueries.ts",
    source: executeTemplate("reactQueryFile", input),
  };
}
