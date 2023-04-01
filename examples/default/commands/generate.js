import { Generator } from "@compas/code-gen/experimental";
import { spawn } from "@compas/stdlib";
import { storeGetStructure } from "@compas/store";
import { extendWithDatabase } from "../gen/database.js";
import { extendWithPost } from "../gen/post.js";

/**
 * Docs: https://compasjs.com/features/extending-the-cli.html#cli-definition
 *
 * @type {CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "generate",
  shortDescription: "Execute the code-generators",
  subCommands: [
    {
      name: "application",
      shortDescription: "Generate repo specific types",
    },
  ],
  flags: [
    {
      name: "skipLint",
      rawName: "--skip-lint",
      description: "Skip running the linter",
    },
  ],
  executor: cliExecutor,
};

/**
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("@compas/cli").CliExecutorState} state
 * @returns {Promise<import("@compas/cli").CliResult>}
 */
async function cliExecutor(logger, state) {
  // No subcommand given, so we generate all targets
  const generateAllTargets = state.command.at(-1) === "generate";

  const steps = [];

  if (state.flags.skipLint !== true) {
    steps.push(executeLinter);
  }

  if (generateAllTargets) {
    steps.unshift(generateApplication /* add other generate targets here */);
  } else {
    // We only need to generate for the specified sub command.
    const subCommand = state.command.at(-1);
    if (subCommand === "generate") {
      steps.unshift(generateApplication);
    }
  }

  for (let stepIndex = 0; stepIndex < steps.length; ++stepIndex) {
    const stepFn = steps[stepIndex];
    logger.info(
      `[${stepIndex + 1}/${steps.length}] Running '${stepFn.name}'...`,
    );

    const result = await stepFn(logger);

    if (result && result.exitStatus) {
      return {
        exitStatus: result.exitStatus,
      };
    }
  }

  return {
    exitStatus: "passed",
  };
}

/**
 * Generate a router, validators, sql queries and an api client to test it all.
 * It also generates an SVG structure of the database schema.
 *
 * @param {import("@compas/stdlib").Logger} logger
 */
function generateApplication(logger) {
  const generator = new Generator(logger);

  generator.addStructure(storeGetStructure());
  extendWithDatabase(generator);
  extendWithPost(generator);

  generator.generate({
    outputDirectory: "./src/generated/application",
    targetLanguage: "js",
    generators: {
      router: {
        target: {
          library: "koa",
        },
        exposeApiStructure: true,
      },
      database: {
        target: {
          dialect: "postgres",
          includeDDL: true,
        },
        includeEntityDiagram: true,
      },
      structure: {},
      apiClient: {
        target: {
          library: "axios",
          targetRuntime: "node.js",
        },
      },
    },
  });
}

/**
 *
 * @returns {Promise<import("@compas/cli").CliResult|undefined>}
 */
async function executeLinter() {
  const { exitCode } = await spawn(`npx`, ["compas", "lint"]);

  if (exitCode !== 0) {
    return {
      exitStatus: "failed",
    };
  }
}
