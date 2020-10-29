import { mainFn, spawn, environment } from "@lbu/stdlib";

mainFn(import.meta, async () => {
  const { exitCode: lint } = await spawn("./node_modules/.bin/eslint", [
    "./**/*.js",
    "--ignore-pattern",
    "node_modules",
    "--fix",
  ]);

  const prettierCommand =
    environment.CI === "true" ? ["--check"] : ["--write", "--list-different"];

  const { exitCode: pretty } = await spawn("./node_modules/.bin/prettier", [
    ...prettierCommand,
    ".",
  ]);

  process.exit(lint || pretty || 0);
});
