import { environment, spawn } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "lint",
  shortDescription: "Lint all project files.",
  longDescription: `Uses Prettier and ESLint to lint project files.
  
ESLint is used for all JavaScript files and Prettier runs on JavaScript, JSON, Markdown, and YAML files.
The default configuration can be initialized via 'compas init --lint-config'.
`,
  flags: [
    {
      name: "jsdoc",
      rawName: "--jsdoc",
      description:
        "Run ESLint with JSDoc rules enabled. This could degrade performance on big projects.",
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  const eslintOptions = state.flags.jsdoc
    ? {
        env: {
          ...environment,
          LINT_JSDOC: "true",
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

  if (lint === 0 && pretty === 0) {
    return {
      exitStatus: "passed",
    };
  }

  return {
    exitStatus: "failed",
  };
}
