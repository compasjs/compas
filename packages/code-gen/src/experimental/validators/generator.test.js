import { mainTestFn, test } from "@compas/cli";
import { testExperimentalGenerateFiles } from "../testing.js";

mainTestFn(import.meta);

test("code-gen/experimental/validators/generator", (t) => {
  t.test("validatorGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: "./.cache/experimental",
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
  });
});
