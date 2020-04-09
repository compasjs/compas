import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { buildTrie } from "./trie.js";

/**
 * Generate a router with params and wildcard support, running validators whenever they
 * are available
 * @param {Object} [opts]
 * @param {string} [opts.header] Useful for setting extra imports
 */
export function getRouterPlugin(opts = {}) {
  return {
    name: "router",
    init: init.bind(undefined, opts),
    generate: generate.bind(undefined, opts),
  };
}

async function init(opts, app, { hasPlugin }) {
  if (!hasPlugin("validator")) {
    throw new Error(
      "The validators plugin is required for this plugin to produce valid code.",
    );
  }

  await compileTemplateDirectory(
    app.templateContext,

    join(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );
}

function generate(opts, app, data) {
  data.stringified = JSON.stringify(data);
  data.routeTrie = buildTrie(data.routes);

  return {
    path: "./router.js",
    content: executeTemplate(app.templateContext, "routerFile", {
      ...data,
      opts,
    }),
  };
}
