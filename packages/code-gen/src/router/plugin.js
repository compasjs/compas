const { buildTrie } = require("./trie");
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

const transformData = ({ data }) => {
  data.routeTrie = buildTrie(data.routes);
  data.tags = extractTags(data.routes);
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
const getPlugin = () => ({
  name: "router",
  init,
  transformData,
  generate,
});

module.exports = {
  getPlugin,
};

function extractTags(routes) {
  const set = new Set();

  for (const r of routes) {
    for (const t of r.tags) {
      set.add(t);
    }
  }

  return [...set];
}
