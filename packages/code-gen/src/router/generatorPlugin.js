import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";

const init = async ({ hasPlugin }) => {
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

const generate = data => {
  return {
    path: "./router.js",
    content: executeTemplate("routerFile", data),
  };
};

/**
 * Generate a router with params and wildcard support, running validators whenever they
 * are available
 */
export const getRouterPlugin = () => ({
  name: "router",
  init,
  generate,
});
