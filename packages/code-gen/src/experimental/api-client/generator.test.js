import { readFileSync } from "fs";
import { mainTestFn, test } from "@compas/cli";
import { testTemporaryDirectory } from "../../../../../src/testing.js";
import { loadApiStructureFromOpenAPI } from "../../loaders.js";
import { testExperimentalGenerateFiles } from "../testing.js";

mainTestFn(import.meta);

test("code-gen/experimental/api-client/generator", (t) => {
  t.test("apiClientGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: `${testTemporaryDirectory}/api-client`,
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
        outputDirectory: `${testTemporaryDirectory}/api-client-ts`,
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

    t.test("test - ts - fetch", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: `${testTemporaryDirectory}/api-client-fetch`,
        generators: {
          structure: {},
          apiClient: {
            target: {
              targetRuntime: "node.js",
              library: "fetch",
              globalClient: true,
            },
          },
        },
        targetLanguage: "js",
      });

      t.pass();
      process.exit(1);
    });

    t.test("test - openapi.json", (t) => {
      testExperimentalGenerateFiles(
        t,
        {
          outputDirectory: `${testTemporaryDirectory}/api-client-open-api`,
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
        },
        loadApiStructureFromOpenAPI(
          "pet",
          JSON.parse(
            readFileSync("./__fixtures__/code-gen/openapi.json", "utf-8"),
          ),
        ),
      );

      t.pass();
    });
  });
});
