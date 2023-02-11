import { mainTestFn, test } from "@compas/cli";
import { testExperimentalGenerateFiles } from "../testing.js";

mainTestFn(import.meta);

test("code-gen/experimental/router/generator", (t) => {
  t.test("routerGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: "./.cache/experimental/router",
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
          },
          openApi: {},
        },
        targetLanguage: "js",
      });

      t.pass();
    });
  });
});
