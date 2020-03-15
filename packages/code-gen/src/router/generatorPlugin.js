import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { buildTrie } from "./trie.js";

const init = async (opts, { hasPlugin }) => {
  if (!hasPlugin("validator")) {
    throw new Error(
      "The validators plugin is required for this plugin to produce valid code.",
    );
  }

  await compileTemplateDirectory(
    join(dirnameForModule(import.meta), "templates"),
    ".tmpl",
    { debug: false },
  );
};

const generate = (opts, data) => {
  data.stringified = JSON.stringify(data);
  data.routeTrie = buildTrie(data.routes);
  return {
    path: "./router.js",
    content: executeTemplate("routerFile", { ...data, opts }),
  };
};

/**
 * Generate a router with params and wildcard support, running validators whenever they
 * are available
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 */
export const getRouterPlugin = (opts = {}) => ({
  name: "router",
  init: init.bind(undefined, opts),
  generate: generate.bind(undefined, opts),
});
