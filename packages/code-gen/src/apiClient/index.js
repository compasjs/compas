import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

const init = async (opts, { hasPlugin }) => {
  opts.enableMocks = hasPlugin("mocks");

  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
};

const generate = (opts, data) => ({
  path: "./apiClient.js",
  content: executeTemplate("apiClientFile", { ...data, opts }),
});

/**
 * Generate an Axios api client
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 * @param {boolean} [opts.enableMocks] Will try to return mocked value when a 405 error occurs
 */
export const getApiClientPlugin = (opts = {}) => ({
  name: "apiClient",
  init: init.bind(undefined, opts),
  generate: generate.bind(undefined, opts),
});
