import { readdir, readFile } from "node:fs/promises";
import { applyCliStructure } from "../gen/cli.js";
import { extendWithCodeGen } from "../gen/code-gen.js";
import { applyStoreStructure } from "../gen/store.js";
import { Generator } from "@compas/code-gen";
import { AppError, exec } from "@compas/stdlib";

export function generateCli(logger) {
  const generator = new Generator(logger);

  applyCliStructure(generator);

  generator.generate({
    targetLanguage: "js",
    outputDirectory: "./packages/cli/src/generated",
    generators: {
      structure: {},
      types: {},
      validators: {
        includeBaseTypes: true,
      },
    },
  });
}

export function generateCodeGen(logger) {
  const generator = new Generator(logger);

  extendWithCodeGen(generator);

  generator.generate({
    targetLanguage: "js",
    outputDirectory: "packages/code-gen/src/generated",
    generators: {
      structure: {},
      validators: {
        includeBaseTypes: true,
      },
    },
  });
}

/**
 * @param {import("@compas/stdlib").Logger} logger
 * @returns {void}
 */
export function generateStore(logger) {
  const generator = new Generator(logger);

  applyStoreStructure(generator);

  generator.generate({
    targetLanguage: "js",
    outputDirectory: "packages/store/src/generated",
    generators: {
      structure: {},
      validators: {
        includeBaseTypes: true,
      },
      database: {
        target: {
          dialect: "postgres",
          includeDDL: true,
        },
      },
    },
  });
}

/**
 * @param {import("@compas/stdlib").Logger} logger
 * @param {CliExecutorState} state
 * @returns {Promise<void>}
 */
export async function generateExamples(logger, state) {
  logger.info("Collecting examples to regenerate...");
  const examples = await readdir("./examples");

  const configs = (
    await Promise.all(
      examples.map(async (example) => {
        const packageJson = JSON.parse(
          await readFile(`./examples/${example}/package.json`, "utf-8"),
        );

        packageJson.exampleMetadata = packageJson.exampleMetadata ?? {};
        packageJson.exampleMetadata.path = `./examples/${example}`;

        if (!packageJson.exampleMetadata.generating) {
          return undefined;
        }

        return packageJson;
      }),
    )
  ).filter((it) => !!it);

  logger.info(`Regenerating ${configs.length} examples...`);

  await Promise.all(
    configs.map(async (config) => {
      const cmd = config.exampleMetadata.generating;
      const parts = cmd.split(" ");
      if (parts[0] === "compas") {
        parts[0] = "../../node_modules/.bin/compas";
      }

      if (state.flags.skipLint && !cmd.includes(" run ")) {
        parts.push("--skip-lint");
      }

      const { exitCode, stdout, stderr } = await exec(parts.join(" "), {
        cwd: config.exampleMetadata.path,
      });

      if (exitCode !== 0) {
        throw AppError.serverError({
          message: "One of the examples failed to generate",
          stdout,
          stderr,
          path: config.exampleMetadata.path,
        });
      }
    }),
  );
}
