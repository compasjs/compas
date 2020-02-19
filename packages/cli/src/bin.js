#!/usr/bin/env node

const { logger } = require("./logger");
const { mainFn } = require("./utils");
const { execScript } = require("./exec");

mainFn(module, require, logger, logger => {
  const [cmd, ...args] = process.argv.slice(2);
  return execScript(logger, cmd, args);
});
