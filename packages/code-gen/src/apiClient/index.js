import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

/**
 * Generate an Axios api client
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 * @param {boolean} [opts.enableMocks] Will try to return mocked value when a 405 error
 *   occurs
 */
export function getApiClientPlugin(opts = {}) {
  return {
    name: "apiClient",
    init: init.bind(undefined, opts),
    generate: generate.bind(undefined, opts),
  };
}

async function init(opts, app, { hasPlugin }) {
  opts.enableMocks = hasPlugin("mocks");

  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
}

function generate(opts, app, data) {
  return {
    path: "./apiClient.js",
    content: executeTemplate(app.templateContext, "apiClientFile", {
      ...data,
      opts,
    }),
  };
}
