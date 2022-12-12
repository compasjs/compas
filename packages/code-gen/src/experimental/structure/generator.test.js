import { mainTestFn, test } from "@compas/cli";
import {
  fileContextFinalizeGenerateFile,
  fileContextGet,
} from "../file/context.js";
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

      t.equal(generateContext.files.size, 0);
    });

    t.test("creates a file if enabled", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {
          structure: {},
        },
        targetLanguage: "js",
      });

      structureGenerator(generateContext);

      t.equal(generateContext.files.size, 1);
      t.ok(fileContextGet(generateContext, "common/structure.json"));
    });

    t.test("dumps the structure", (t) => {
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {
          structure: {},
        },
        targetLanguage: "js",
      });

      structureGenerator(generateContext);

      const file = fileContextGet(generateContext, "common/structure.json");
      const contents = fileContextFinalizeGenerateFile(file);
      const parsedContents = JSON.parse(contents);

      t.equal(parsedContents.basic.boolRequired.type, "boolean");
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
