import { mainTestFn, test } from "@compas/cli";
import { testTemporaryDirectory } from "../../../../../src/testing.js";
import { testExperimentalGenerateFiles } from "../testing.js";

mainTestFn(import.meta);

test("code-gen/experimental/database/generator", (t) => {
  t.test("databaseGenerator", (t) => {
    t.test("test", (t) => {
      testExperimentalGenerateFiles(t, {
        outputDirectory: `${testTemporaryDirectory}/database`,
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
  });
});
