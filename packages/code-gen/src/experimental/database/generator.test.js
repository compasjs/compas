import { mainTestFn, test } from "@compas/cli";
import { testExperimentalGenerateFiles } from "../testing.js";

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
