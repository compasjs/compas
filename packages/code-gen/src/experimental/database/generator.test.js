import { mainTestFn, test } from "@compas/cli";
import { Generator } from "../generator.js";
import {
  testExperimentalGenerateContext,
  testExperimentalGenerateFiles,
} from "../testing.js";

mainTestFn(import.meta);

test("code-gen/experimental/database/generator", (t) => {
  t.test("databaseGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: "./.cache/experimental/database",
        generators: {
          structure: {},
          database: {
            target: {
              dialect: "postgres",
              includeDDL: true,
            },
            includeEntityDiagram: true,
          },
        },
        targetLanguage: "js",
      });

      t.pass();
    });

    t.test("test regenerate on same structure", (t) => {
      const context = testExperimentalGenerateContext(t, {});
      const generator = new Generator(t.log);
      generator.internalStructure = context.structure;

      generator.generate({
        generators: {
          structure: {},
          apiClient: {
            target: {
              targetRuntime: "node.js",
              library: "axios",
            },
          },
          router: {
            target: { library: "koa" },
            exposeApiStructure: true,
          },
          database: {
            target: {
              dialect: "postgres",
              includeDDL: true,
            },
            includeEntityDiagram: true,
          },
        },
        targetLanguage: "js",
      });

      generator.generate({
        generators: {
          structure: {},
          apiClient: {
            target: {
              targetRuntime: "node.js",
              library: "axios",
            },
          },
          router: {
            target: { library: "koa" },
            exposeApiStructure: true,
          },
          database: {
            target: {
              dialect: "postgres",
              includeDDL: true,
            },
            includeEntityDiagram: true,
          },
        },
        targetLanguage: "js",
      });

      t.pass();
    });
  });
});
