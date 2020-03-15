import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

const init = async () => {
  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
    {
      debug: false,
    },
  );
};

const generate = (opts, data) => ({
  path: "./types.js",
  content: executeTemplate("typesFile", { ...data, opts }),
});

/**
 * Generate JsDoc types for validators & routes
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 */
export const getTypesPlugin = (opts = {}) => ({
  name: "types",
  init: init.bind(undefined, opts),
  generate: generate.bind(undefined, opts),
});
