const { runCodeGen } = require("./src/core");
const { getPlugin: getValidatorsPlugin } = require("./src/validators");
const { getPlugin: getRouterPlugin } = require("./src/router");

module.exports = {
  getValidatorsPlugin,
  getRouterPlugin,
  runCodeGen,
};
