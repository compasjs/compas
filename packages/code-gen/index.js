const { runCodeGen } = require("./src/core");
const { FluentApp, V } = require("./src/fluent");

const { getPlugin: getValidatorsPlugin } = require("./src/validators");
const { getPlugin: getRouterPlugin } = require("./src/router");

module.exports = {
  runCodeGen,

  V,
  FluentApp,

  getValidatorsPlugin,
  getRouterPlugin,
};
