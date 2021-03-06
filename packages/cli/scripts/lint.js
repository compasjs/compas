import { mainFn, spawn, environment } from "@compas/stdlib";

mainFn(import.meta, async () => {
  const [arg] = process.argv.slice(2);
  const jsdocEnabled = arg === "--jsdoc";
  const eslintOptions = jsdocEnabled
    ? {
        env: {
          ...environment,
          LINT_JSDOC: true,
        },
      }
    : {};

  const { exitCode: lint } = await spawn(
    "./node_modules/.bin/eslint",
    [
      "./**/*.js",
      "--ignore-pattern",
      "node_modules",
      "--fix",
      "--no-error-on-unmatched-pattern",
    ],
    eslintOptions,
  );

  const prettierCommand =
    environment.CI === "true" ? ["--check"] : ["--write", "--list-different"];

  const { exitCode: pretty } = await spawn("./node_modules/.bin/prettier", [
    ...prettierCommand,
    "--ignore-unknown",
    "--no-error-on-unmatched-pattern",
    ".",
  ]);

  process.exit(lint || pretty || 0);
});
