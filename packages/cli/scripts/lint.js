import { mainFn, spawn } from "@lbu/stdlib";
import { logger } from "../src/logger.js";

mainFn(import.meta, logger, async () => {
  await spawn("./node_modules/.bin/eslint", [
    "./**/*.js",
    "--ignore-pattern",
    "node_modules",
    "--fix",
  ]);
  await spawn("./node_modules/.bin/prettier", [
    "--write",
    "--list-different",
    ".",
  ]);
});
