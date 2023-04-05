import { mainTestFn, test } from "@compas/cli";
import {
  testGeneratorError,
  testGeneratorStaticOutput,
  testGeneratorType,
} from "../../../test/testing.js";

mainTestFn(import.meta);

test("code-gen/processors/any-of", (t) => {
  t.test("nested anyOf isOptional is propagated", (t) => {
    testGeneratorStaticOutput(
      t,
      {
        relativePath: "app/validators.js",
        partialValue: "value === null || value === undefined",
      },
      (T) => [T.anyOf("anyOf").values(T.bool(), T.string().optional())],
    );
  });

  t.test(
    "nested anyOf isOptional is not propagated when not present",
    async (t) => {
      const { error } = await testGeneratorType(
        t,
        {
          group: "app",
          validatorInput: null,
          validatorName: "validateAppAnyOf",
        },
        (T) => [T.anyOf("anyOf").values(T.bool())],
      );

      t.equal(error.$.key, "validator.undefined");
    },
  );

  t.test("nested anyOf allowNull is propagated", (t) => {
    testGeneratorStaticOutput(
      t,
      {
        relativePath: "app/validators.js",
        partialValue: "value === null || value === undefined",
      },
      (T) => [T.anyOf("anyOf").values(T.bool(), T.string().allowNull())],
    );
  });

  t.test(
    "nested anyOf allowNull is not propagated when not present",
    async (t) => {
      const { error } = await testGeneratorType(
        t,
        {
          group: "app",
          validatorInput: null,
          validatorName: "validateAppAnyOf",
        },
        (T) => [T.anyOf("anyOf").values(T.bool())],
      );

      t.equal(error.$.key, "validator.undefined");
    },
  );

  t.test("anyOf discriminant fails if non-objects are found", (t) => {
    testGeneratorError(
      t,
      {
        partialError: "can only be used if all values are an object",
      },
      (T) => [T.anyOf("anyOf").values(T.bool()).discriminant("type")],
    );
  });

  t.test("anyOf discriminant fails if non-object references are found", (t) => {
    testGeneratorError(
      t,
      {
        partialError: "can only be used if all values are an object",
      },
      (T) => [T.anyOf("anyOf").values(T.bool("bool")).discriminant("type")],
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

  t.test(
    "anyOf discriminant checks the uniqueness of the discriminant",
    (t) => {
      testGeneratorError(
        t,
        {
          partialError: "or is not unique on",
        },
        (T) => [
          T.anyOf("anyOf")
            .values(
              {
                type: "foo",
              },
              {
                type: "foo",
                key: 1,
              },
            )
            .discriminant("type"),
        ],
      );
    },
  );

  t.test(
    "anyOf discriminant does not allow strings with more than one 'oneOf'",
    (t) => {
      testGeneratorError(
        t,
        {
          partialError: "or is not unique on",
        },
        (T) => [
          T.anyOf("anyOf")
            .values(
              {
                type: T.string().oneOf("foo", "bar"),
              },
              {
                type: "foo",
              },
            )
            .discriminant("type"),
        ],
      );
    },
  );
});
