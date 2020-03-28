import {
  addToTemplateContext,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { mockForType } from "./js-templates/mockForType.js";

/**
 * Generate mocks
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 */
export function getMocksPlugin(opts = {}) {
  return {
    name: "mocks",
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
  addToTemplateContext("mockForType", mockForType);
}

function generate(opts, data) {
  const mocksContent = executeTemplate("mocksFile", { ...data, opts });

  return [
    {
      path: "./mocks.js",
      content: mocksContent,
    },
  ];
}
