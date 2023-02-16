import { spawn } from "@compas/stdlib";
import {
  generateCli,
  generateCodeGen,
  generateExamples,
  generateStore,
} from "../src/generate.js";

/**
 * @type {CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "generate",
  shortDescription: "Run internal code-gen and generate types",
  watchSettings: {
    extensions: ["js"],
    ignorePatterns: ["generated"],
  },
  modifiers: {
    isWatchable: true,
  },
  flags: [
    {
      name: "skipTypescript",
      rawName: "--skip-tsc",
      description: "Skip running Typescript",
    },
    {
      name: "skipLint",
      rawName: "--skip-lint",
      description: "Skip running the linter",
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {Logger} logger
 * @param {CliExecutorState} state
 * @returns {Promise<CliResult>}
 */
async function cliExecutor(logger, state) {
  generateCli(logger);
  await generateCodeGen();
  generateStore(logger);
  await generateExamples(logger, state);

  if (state.flags.skipTypescript !== true) {
    logger.info("Running tsc...");
    await spawn("compas", ["run", "types"]);
  }
  if (state.flags.skipLint !== true) {
    await spawn("compas", ["lint"]);
  }
}
