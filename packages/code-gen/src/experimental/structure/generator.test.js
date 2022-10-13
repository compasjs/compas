import { mainTestFn, test } from "@compas/cli";
import { testExperimentalGenerateContext } from "../testing.js";
import { structureGenerator, structureIsEnabled } from "./generator.js";

mainTestFn(import.meta);

test("code-gen/experimental/structure/generator", (t) => {
  t.test("structureGenerator", (t) => {
    t.test("does nothing when structure is not enabled", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {},
        targetLanguage: "js",
      });

      structureGenerator(generateContext);

      t.equal(generateContext.outputFiles.length, 0);
    });

    t.test("creates a file if enabled", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {
          structure: {},
        },
        targetLanguage: "js",
      });

      structureGenerator(generateContext);

      t.equal(generateContext.outputFiles.length, 1);
      t.equal(
        generateContext.outputFiles[0].relativePath,
        "common/structure.json",
      );
    });

    t.test("includes the provided options in the output", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {
          structure: {},
          types: {
            useGlobalTypes: true,
          },
        },
        targetLanguage: "js",
      });

      structureGenerator(generateContext);

      const contents = JSON.parse(generateContext.outputFiles[0].contents);

      t.equal(contents.compas.$options.generators.types.useGlobalTypes, true);
    });

    t.test("dumps the structure", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {
          structure: {},
        },
        targetLanguage: "js",
      });

      structureGenerator(generateContext);

      const contents = JSON.parse(generateContext.outputFiles[0].contents);

      t.equal(contents.basic.boolRequired.type, "boolean");
    });
  });

  t.test("structureIsEnabled", (t) => {
    t.test("enabled", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {
          structure: {},
        },
        targetLanguage: "js",
      });

      const result = structureIsEnabled(generateContext);

      t.equal(result, true);
    });

    t.test("disabled", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {},
        targetLanguage: "js",
      });

      const result = structureIsEnabled(generateContext);

      t.equal(result, false);
    });
  });
});
