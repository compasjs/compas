import { mainTestFn, test } from "@compas/cli";
import { testGeneratorError } from "../../../test/testing.js";

mainTestFn(import.meta);

test("code-gen/processors/any-of", (t) => {
  t.test("anyOf discriminant fails if non-objects are found", (t) => {
    testGeneratorError(
      t,
      {
        partialError: "can only be used if all values are an object",
      },
      (T) => [T.anyOf("anyOf").values(T.bool()).discriminant("type")],
    );
  });

  t.test("anyOf discriminant allows objects", (t) => {
    testGeneratorError(
      t,
      {
        pass: true,
      },
      (T) => [
        T.anyOf("anyOf")
          .values(
            T.object().keys({
              type: "foo",
            }),
          )
          .discriminant("type"),
      ],
    );
  });
});
