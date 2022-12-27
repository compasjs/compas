import { readFile } from "fs/promises";
import { readdir } from "node:fs/promises";
import { Generator } from "@compas/code-gen/experimental";
import { AppError, exec, newLogger } from "@compas/stdlib";
import { applyCliStructure } from "../gen/cli.js";
import { extendWithCodeGenExperimental } from "../gen/code-gen-experimental.js";
import { applyCodeGenStructure } from "../gen/code-gen.js";
import { applyStoreStructure } from "../gen/store.js";
import { App } from "../packages/code-gen/index.js";

export async function generateTypes() {
  const app = new App({
    verbose: true,
  });

  await app.generateTypes({
    outputDirectory: "./types/generated",
    inputPaths: ["./packages/store/src/generated"],
    dumpCompasTypes: true,
  });
}

export async function generateCli() {
  const app = new App({
    verbose: true,
  });

  applyCliStructure(app);

  await app.generate({
    outputDirectory: `packages/cli/src/generated`,
    enabledGroups: ["cli"],
    isNode: true,
    enabledGenerators: ["validator", "type"],
    dumpStructure: true,
    declareGlobalTypes: false,
  });
}

export async function generateCodeGen() {
  const app = new App({
    verbose: true,
  });

  applyCodeGenStructure(app);

  await app.generate({
    outputDirectory: `packages/code-gen/src/generated`,
    enabledGroups: ["codeGen"],
    isNode: true,
    enabledGenerators: ["validator", "type"],
    dumpStructure: true,
    declareGlobalTypes: false,
  });

  const generator = new Generator(newLogger());

  extendWithCodeGenExperimental(generator);

  generator.generate({
    targetLanguage: "js",
    outputDirectory: "packages/code-gen/src/experimental/generated",
    generators: {
      structure: {},
      validators: {
        includeBaseTypes: true,
      },
    },
  });
}

export async function generateStore() {
  const app = new App({
    verbose: true,
  });

  applyStoreStructure(app);

  await app.generate({
    outputDirectory: `packages/store/src/generated`,
    enabledGroups: ["store"],
    enabledGenerators: ["sql", "validator"],
    isNode: true,
    dumpStructure: true,
    dumpApiStructure: false,
    dumpPostgres: true,
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

  for (const config of configs) {
    const cmd = config.exampleMetadata.generating;
    const parts = cmd.split(" ");
    if (parts[0] === "compas") {
      parts[0] = "../../node_modules/.bin/compas";
    }

    if (state.flags.skipLint) {
      parts.push("--skip-lint");
    }

    const { exitCode, stdout } = await exec(parts.join(" "), {
      cwd: config.exampleMetadata.path,
    });

    if (exitCode !== 0) {
      throw AppError.serverError({
        message: "One of the examples failed to generate",
        stdout,
        path: config.exampleMetadata.path,
      });
    }
  }
}
