import { mainFn, spawn } from "@lbu/stdlib";

mainFn(import.meta, async () => {
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
