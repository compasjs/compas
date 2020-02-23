#!/usr/bin/env node

const { mainFn } = require("@lbu/stdlib");
const { logger } = require("./logger");
const { execScript } = require("./exec");

mainFn(module, require, logger, logger => {
  const [cmd, ...args] = process.argv.slice(2);
  return execScript(logger, cmd, args);
});
