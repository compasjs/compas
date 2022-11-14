import { mainTestFn, test } from "@compas/cli";
import { testExperimentalGenerateContext } from "../testing.js";
import { typesGeneratorFinalize, typesGeneratorInit } from "./generator.js";

mainTestFn(import.meta);

test("code-gen/experimental/types/generator", (t) => {
  t.test("typesGenerator", (t) => {
    t.test("test", (t) => {
      // TODO: more tests
      const generateContext = testExperimentalGenerateContext(t, {
        generators: {
          structure: {},
          types: {
            useGlobalTypes: true,
            includeBaseTypes: true,
          },
        },
        targetLanguage: "js",
      });

      typesGeneratorInit(generateContext);
      typesGeneratorFinalize(generateContext);

      // for (const entry of generateContext.files.entries()) {
      //   t.log.error({
      //     entry,
      //   });
      // }

      t.pass();
    });
  });
});
