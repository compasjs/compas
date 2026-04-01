import { applyCliStructure } from "../gen/cli.js";
import { extendWithCodeGen } from "../gen/code-gen.js";
import { applyStoreStructure } from "../gen/store.js";
import { Generator } from "@compas/code-gen";

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
