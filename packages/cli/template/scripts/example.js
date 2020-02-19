const { mainFn } = require("@lbu/cli");
const { log } = require("@lbu/insight");

mainFn(module, require, log, logger => {
  logger.info("Hello from custom script!");
});
