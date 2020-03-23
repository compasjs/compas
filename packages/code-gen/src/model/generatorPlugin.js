import {
  addToTemplateContext,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { generateJsDoc } from "./js-templates/generateJsDoc.js";
import { generateTsType } from "./js-templates/generateTsType.js";

const init = async () => {
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
  addToTemplateContext("generateJsDoc", generateJsDoc);
  addToTemplateContext("generateTsType", generateTsType);
};

const generate = (opts, data) => ({
  path: opts.emitTypescriptTypes ? "./types.ts" : "./types.js",
  content: executeTemplate("typesFile", { ...data, opts }),
});

/**
 * Generate JsDoc types for validators & routes
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 * @param {boolean} [opts.emitTypescriptTypes] Generate a .ts file instead of a .js file
 */
export const getTypesPlugin = (opts = {}) => ({
  name: "types",
  init: init.bind(undefined, opts),
  generate: generate.bind(undefined, opts),
});
