import { mainTestFn, test } from "@compas/cli";
import { AppError } from "@compas/stdlib";
import { testExperimentalGenerateContext } from "../testing.js";
import {
  structureNameChecks,
  structureNameChecksForObject,
} from "./structure-name-checks.js";

mainTestFn(import.meta);

test("code-gen/experimental/processors/structure-name-checks", (t) => {
  t.test("structureNameChecks", (t) => {
    t.test("throws on invalid group name", (t) => {
      const generateContext = testExperimentalGenerateContext(
        t,
        {
          generators: {},
          targetLanguage: "js",
        },
        {
          protected: {},
        },
      );

      try {
        structureNameChecks(generateContext);
      } catch (e) {
        t.ok(AppError.instanceOf(e));

        t.deepEqual(e.info.messages, [
          "Group name 'protected' is a reserved group name. Please use a different group name.",
        ]);
      }
    });

    t.test("throws on an invalid object key", (t) => {
      const generateContext = testExperimentalGenerateContext(
        t,
        {
          generators: {},
          targetLanguage: "js",
        },
        {
          foo: {
            bar: {
              type: "object",
              keys: {
                $append: {
                  type: "boolean",
                },
              },
            },
          },
        },
      );

      try {
        structureNameChecks(generateContext);
      } catch (e) {
        t.ok(AppError.instanceOf(e));

        t.deepEqual(e.info.messages, [
          "Object (object) is using a reserved key '$append'. Found via ",
        ]);
      }
    });
  });

  t.test("structureNameChecksForObject", (t) => {
    t.test("formats typeStack", (t) => {
      const generateContext = testExperimentalGenerateContext(
        t,
        {
          generators: {},
          targetLanguage: "js",
        },
        {
          foo: {
            bar: {
              type: "object",
              keys: {
                $append: {
                  type: "boolean",
                },
              },
            },
          },
        },
      );

      try {
        structureNameChecksForObject(
          {
            type: "object",
            keys: {
              $append: {},
            },
          },
          ["(object)", "(anyOf)"],
        );
      } catch (e) {
        t.ok(AppError.instanceOf(e));

        t.deepEqual(
          e.info.message,
          "Object (object) is using a reserved key '$append'. Found via (object) -> (anyOf)",
        );
      }
    });
  });
});
