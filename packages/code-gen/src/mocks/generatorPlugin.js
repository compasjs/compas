import {
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

async function init(_, app) {
  await compileTemplateDirectory(
    app.templateContext,

    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
  app.templateContext.globals["mockForType"] = mockForType;
}

function generate(opts, app, data) {
  const mocksContent = executeTemplate(app.templateContext, "mocksFile", {
    ...data,
    opts,
  });

  return [
    {
      path: "./mocks.js",
      content: mocksContent,
    },
  ];
}
