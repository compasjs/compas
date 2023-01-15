import { mainTestFn, test } from "@compas/cli";
import { testExperimentalGenerateFiles } from "../testing.js";

mainTestFn(import.meta);

test("code-gen/experimental/api-client/generator", (t) => {
  t.test("apiClientGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: "./.cache/experimental/api-client",
        generators: {
          structure: {},

          apiClient: {
            target: {
              targetRuntime: "node.js",
              library: "axios",
              globalClient: true,
            },
          },
        },
        targetLanguage: "js",
      });

      t.pass();
    });
  });
});
