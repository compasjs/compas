const { App, runCodeGen } = require("./src/core");
const { M } = require("./src/model");
const { getPlugin: getValidatorPlugin } = require("./src/validators");
const { R, getPlugin: getRouterPlugin } = require("./src/router");

module.exports = {
  runCodeGen,

  App,
  M,
  R,

  getValidatorPlugin,
  getRouterPlugin,
};
