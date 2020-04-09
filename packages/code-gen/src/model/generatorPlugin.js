import {
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

async function init(_, app) {
  await compileTemplateDirectory(
    app.templateContext,

    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );

  app.templateContext.globals["generateJsDoc"] = generateJsDoc;
  app.templateContext.globals["generateTsType"] = generateTsType;
}

function generate(opts, app, data) {
  return {
    path: opts.emitTypescriptTypes ? "./types.ts" : "./types.js",
    content: executeTemplate(app.templateContext, "typesFile", {
      ...data,
      opts,
    }),
  };
}
