const { mainFn, spawn } = require("@lbu/stdlib");
const { logger } = require("../src/logger");

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
    "./**/**.{js,json}",
  ]);
});
