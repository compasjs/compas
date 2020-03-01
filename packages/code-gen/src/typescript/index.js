const { compileTemplateDirectory, executeTemplate } = require("@lbu/stdlib");
const path = require("path");

const init = async () => {
  await compileTemplateDirectory(path.join(__dirname, "./templates"), ".tmpl", {
    debug: false,
  });
};

const generate = data => ({
  path: "./types.d.ts",
  content: executeTemplate("typescriptFile", data),
});

/**
 * Generate Typescript types for validators & routes
 */
const getPlugin = () => ({
  name: "typescript",
  init,
  generate,
});

module.exports = {
  getPlugin,
};
