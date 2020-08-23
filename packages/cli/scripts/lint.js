import { mainFn, spawn } from "@lbu/stdlib";

mainFn(import.meta, async () => {
  const { exitCode: lint } = await spawn("./node_modules/.bin/eslint", [
    "./**/*.js",
    "--ignore-pattern",
    "node_modules",
    "--fix",
  ]);
  const { exitCode: pretty } = await spawn("./node_modules/.bin/prettier", [
    "--write",
    "--list-different",
    ".",
  ]);

  process.exit(lint || pretty || 0);
});
