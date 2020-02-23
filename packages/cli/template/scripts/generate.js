const { mainFn } = require("@lbu/stdlib");
const {
  getRouterPlugin,
  getValidatorsPlugin,
  runCodeGen,
} = require("@lbu/code-gen");
const { log } = require("@lbu/insight");

const main = async logger => {
  await runCodeGen(logger, () => {
    return {
      validators: [],
      routes: [],
      routeTrie: {
        children: [],
      },
    };
  }).build({
    plugins: [getValidatorsPlugin(), getRouterPlugin()],
    outputDir: "./src/generated",
  });
};

mainFn(module, require, log, main);

module.exports = {
  nodemonArgs: "--ignore src/generated",
};
