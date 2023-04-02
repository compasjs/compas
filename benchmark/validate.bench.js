import { readFileSync } from "fs";
import { bench, mainBenchFn } from "@compas/cli";
import { Generator } from "@compas/code-gen/experimental";
import { AppError, mainFn, pathJoin } from "@compas/stdlib";
import { testTemporaryDirectory } from "../src/testing.js";

mainFn(import.meta, main);

async function main(logger) {
  const baseDir = pathJoin(testTemporaryDirectory, `./bench-validate/`);

  const generator = new Generator(logger);
  generator.addStructure("./packages/code-gen/src/experimental/generated");

  generator.generate({
    targetLanguage: "js",
    generators: {
      validators: {
        includeBaseTypes: true,
      },
    },
    outputDirectory: baseDir,
  });

  const { validateExperimentalStructure } = await import(
    pathJoin(process.cwd(), baseDir, "./experimental/validators.js")
  );

  const structures = [
    JSON.parse(
      readFileSync(
        "./packages/store/src/generated/common/structure.json",
        "utf-8",
      ),
    ),
    JSON.parse(
      readFileSync(
        "./packages/code-gen/src/experimental/generated/common/structure.json",
        "utf-8",
      ),
    ),
  ];

  console.time("warmup");

  for (let i = 0; i < 100; ++i) {
    for (const str of structures) {
      const { error } = validateExperimentalStructure(str);
      if (error) {
        throw AppError.validationError("validator.error", error);
      }
    }
  }

  console.timeEnd("warmup");

  bench("store structure", (b) => {
    for (let i = 0; i < b.N; ++i) {
      validateExperimentalStructure(structures[0]);
    }
  });

  bench("code-gen experimental structure", (b) => {
    for (let i = 0; i < b.N; ++i) {
      validateExperimentalStructure(structures[1]);
    }
  });

  mainBenchFn(import.meta);
}
