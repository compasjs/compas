import { mainFn, spawn } from "@lbu/stdlib";
import { cliLogger } from "../index.js";

mainFn(import.meta, cliLogger, async () => {
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
