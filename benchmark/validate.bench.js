import { readFileSync } from "node:fs";
import { testTemporaryDirectory } from "../src/testing.js";
import { bench, mainBenchFn } from "@compas/cli";
import { Generator } from "@compas/code-gen";
import { AppError, mainFn, pathJoin } from "@compas/stdlib";

mainFn(import.meta, main);

async function main(logger) {
  const baseDir = pathJoin(testTemporaryDirectory, `./bench-validate/`);

  const generator = new Generator(logger);
  generator.addStructure("./packages/code-gen/src/generated");

  generator.generate({
    targetLanguage: "js",
    generators: {
      validators: {
        includeBaseTypes: true,
      },
    },
    outputDirectory: baseDir,
  });

  const { validateStructureStructure } = await import(
    pathJoin(process.cwd(), baseDir, "./structure/validators.js")
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
        "./packages/code-gen/src/generated/common/structure.json",
        "utf-8",
      ),
    ),
  ];

  console.time("warmup");

  for (let i = 0; i < 100; ++i) {
    for (const str of structures) {
      const { error } = validateStructureStructure(str);
      if (error) {
        throw AppError.validationError("validator.error", error);
      }
    }
  }

  console.timeEnd("warmup");

  bench("store structure", (b) => {
    for (let i = 0; i < b.N; ++i) {
      validateStructureStructure(structures[0]);
    }
  });

  bench("code-gen experimental structure", (b) => {
    for (let i = 0; i < b.N; ++i) {
      validateStructureStructure(structures[1]);
    }
  });

  mainBenchFn(import.meta);
}
