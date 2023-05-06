import { mainTestFn, test } from "@compas/cli";
import { testTemporaryDirectory } from "../../../../src/testing.js";
import { testExperimentalGenerateFiles } from "../testing.js";

mainTestFn(import.meta);

test("code-gen/router/generator", (t) => {
  t.test("routerGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: `${testTemporaryDirectory}/router`,
        generators: {
          structure: {},
          router: {
            target: {
              library: "koa",
            },
            exposeApiStructure: true,
          },
          apiClient: {
            target: {
              library: "axios",
              targetRuntime: "node.js",
            },
            responseValidation: {
              looseObjectValidation: false,
            },
          },
          openApi: {},
        },
        targetLanguage: "js",
      });

      t.pass();
    });
  });
});
