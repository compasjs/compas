const { App, runCodeGen } = require("./src/core");
const { M } = require("./src/model");
const { getPlugin: getValidatorPlugin } = require("./src/validators");
const { R, getPlugin: getRouterPlugin } = require("./src/router");
const { getPlugin: getTypescriptPlugin } = require("./src/typescript");

module.exports = {
  runCodeGen,

  App,
  M,
  R,

  getValidatorPlugin,
  getRouterPlugin,
  getTypescriptPlugin,
};
