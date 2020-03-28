import {
  addToTemplateContext,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { generateJsDoc } from "./js-templates/generateJsDoc.js";
import { generateTsType } from "./js-templates/generateTsType.js";

/**
 * Generate JsDoc types for validators & routes
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 * @param {boolean} [opts.emitTypescriptTypes] Generate a .ts file instead of a .js file
 */
export function getTypesPlugin(opts = {}) {
  return {
    name: "types",
    init: init.bind(undefined, opts),
    generate: generate.bind(undefined, opts),
  };
}

async function init() {
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
  addToTemplateContext("generateJsDoc", generateJsDoc);
  addToTemplateContext("generateTsType", generateTsType);
}

function generate(opts, data) {
  return {
    path: opts.emitTypescriptTypes ? "./types.ts" : "./types.js",
    content: executeTemplate("typesFile", { ...data, opts }),
  };
}
