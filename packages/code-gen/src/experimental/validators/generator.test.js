import { mainTestFn, test } from "@compas/cli";
import { testTemporaryDirectory } from "../../../../../src/testing.js";
import { testExperimentalGenerateFiles } from "../testing.js";

mainTestFn(import.meta);

test("code-gen/experimental/validators/generator", (t) => {
  t.test("validatorGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: `${testTemporaryDirectory}/validators`,
        generators: {
          structure: {},
          validators: {
            includeBaseTypes: true,
          },
        },
        targetLanguage: "js",
      });

      t.pass();
    });

    t.test("test - ts", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: `${testTemporaryDirectory}/validators-ts`,
        generators: {
          structure: {},
          validators: {
            includeBaseTypes: true,
          },
        },
        targetLanguage: "ts",
      });

      t.pass();
    });
  });
});
