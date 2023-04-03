import { mainTestFn, test } from "@compas/cli";
import { AppError } from "@compas/stdlib";
import { structureNameChecksForObject } from "./structure-name-checks.js";

mainTestFn(import.meta);

test("code-gen/experimental/processors/structure-name-checks", (t) => {
  t.test("structureNameChecksForObject", (t) => {
    t.test("formats typeStack", (t) => {
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
