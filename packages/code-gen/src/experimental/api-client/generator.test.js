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
              globalClient: false,
            },
          },
        },
        targetLanguage: "js",
      });

      t.pass();
    });

    t.test("test - ts", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: "./.cache/experimental/api-client-ts",
        generators: {
          structure: {},

          apiClient: {
            target: {
              targetRuntime: "browser",
              library: "axios",
              globalClient: true,
              includeWrapper: "react-query",
            },
          },
        },
        targetLanguage: "ts",
      });

      t.pass();
    });
  });
});
