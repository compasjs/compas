const { spawn } = require("@lbu/stdlib");
const { logger } = require("../src/logger");
const { mainFn } = require("../src/utils");

mainFn(module, require, logger, async () => {
  await spawn("./node_modules/.bin/eslint", [
    "./**/*.js",
    "--ignore-pattern",
    "*/node_modules/*",
    "--fix",
  ]);
  await spawn("./node_modules/.bin/prettier", [
    "--write",
    "--list-different",
    "*/!(node_modules)/**.{js,json}",
  ]);
});
