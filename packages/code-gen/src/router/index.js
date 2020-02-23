const { executeTemplate } = require("@lbu/stdlib");
const { compileTemplateDirectory } = require("@lbu/stdlib");

const init = async ({ hasPlugin }) => {
  if (!hasPlugin("validators")) {
    throw new Error(
      "The validators plugin is required for this plugin to produce valid code.",
    );
  }

  await compileTemplateDirectory(__dirname, ".tmpl", { debug: false });
};

const generate = ({ data }) => ({
  path: "./router.js",
  content: executeTemplate("routerFile", data),
});

/**
 * Generate a router with params and wildcard support, running validators whenever they
 * are available
 */
const getPlugin = () => ({
  name: "router",
  init,
  generate,
});

module.exports = {
  getPlugin,
};
