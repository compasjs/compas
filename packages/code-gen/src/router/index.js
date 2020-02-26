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

const generate = ({ data }) => {
  const templateInput = {
    routes: data.routes,
    routeTrie: buildTrie(data.routes),
    tags: extractTags(data.routes),
  };

  console.log(templateInput.tags);

  return {
    path: "./router.js",
    content: executeTemplate("routerFile", templateInput),
  };
};

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

function extractTags(routes) {
  const set = new Set();

  for (const r of routes) {
    for (const t of r.tags) {
      set.add(t);
    }
  }

  return [...set];
}
