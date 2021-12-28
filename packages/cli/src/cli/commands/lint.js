import { environment, spawn } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "lint",
  shortDescription: "Run Prettier and ESLint on all files",
  flags: [
    {
      name: "jsdoc",
      rawName: "--jsdoc",
    },
  ],
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../types").CliExecutorState} state
 * @returns {Promise<import("../types").CliResult>}
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
