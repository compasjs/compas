import { mainTestFn, test } from "@compas/cli";
import { isNil, isPlainObject } from "@compas/stdlib";

mainTestFn(import.meta);

/**
 *
 * @param {TestRunner} t
 * @param {{
 *   errorLength?: number,
 *   errorKey?: string,
 *   expected?: *,
 *   input?: *
 * }[]} cases
 * @param {function} fn
 */
const assertAll = (t, cases, fn) => {
  for (const item of cases) {
    const { data, errors } = fn(item.input);

    if (!isNil(errors)) {
      if (!isNil(item.errorLength)) {
        t.equal(errors.length, item.errorLength);
      }
      t.equal(errors[0].key, item.errorKey);
    } else {
      if (
        isNil(item.expected) ||
        ["number", "string", "boolean"].indexOf(typeof item.expected) !== -1
      ) {
        t.equal(data, item.expected, fn.name);
      } else {
        if (isPlainObject(item.expected)) {
          // Quick hack, so we can test objects created by the validators
          item.expected = Object.assign(Object.create(null), item.expected);
        }
        t.deepEqual(data, item.expected);
      }
    }
  }
};

test("code-gen/validators", async (t) => {
  const validators = await import(
    "../../../generated/testing/validators/validators.js"
  );
  t.test("anyOf", (t) => {
    assertAll(
      t,
      [
        {
          input: true,
          expected: true,
        },
        {
          input: false,
          expected: false,
        },
        {
          input: 5,
          expected: 5,
        },
        {
          input: "Foo",
          errorLength: 1,
          errorKey: "validator.anyOf.type",
        },
      ],
      validators.validateValidatorAnyOf,
    );
  });

  t.test("array", (t) => {
    assertAll(
      t,
      [
        {
          input: [],
          expected: [],
        },
        {
          input: [true],
          expected: [true],
        },
        {
          input: [true, false],
          expected: [true, false],
        },
        {
          input: true,
          errorKey: "validator.array.type",
        },
      ],
      validators.validateValidatorArray,
    );
  });

  t.test("arrayConvert", (t) => {
    assertAll(
      t,
      [
        {
          input: true,
          expected: [true],
        },
      ],
      validators.validateValidatorArrayConvert,
    );
  });

  t.test("arrayMinMax", (t) => {
    assertAll(
      t,
      [
        {
          input: [],
          errorKey: "validator.array.min",
        },
        {
          input: [true, true],
          expected: [true, true],
        },
        {
          // Checks min/max first before the values
          input: "1234567891011".split(""),
          errorKey: "validator.array.max",
        },
      ],
      validators.validateValidatorArrayMinMax,
    );
  });

  t.test("bool", (t) => {
    assertAll(
      t,
      [
        {
          input: true,
          expected: true,
        },
        {
          input: false,
          expected: false,
        },
        {
          input: undefined,
          errorLength: 1,
          errorKey: "validator.boolean.undefined",
        },
      ],
      validators.validateValidatorBool,
    );
  });

  t.test("boolOneOf", (t) => {
    assertAll(
      t,
      [
        {
          input: true,
          expected: true,
        },
        {
          input: false,
          errorKey: "validator.boolean.oneOf",
        },
      ],
      validators.validateValidatorBoolOneOf,
    );
  });

  t.test("boolConvert", (t) => {
    assertAll(
      t,
      [
        {
          input: "true",
          expected: true,
        },
        {
          input: "false",
          expected: false,
        },
        {
          input: 0,
          expected: false,
        },
        {
          input: 1,
          expected: true,
        },
        {
          input: true,
          expected: true,
        },
        {
          input: "foo",
          errorKey: "validator.boolean.type",
        },
      ],
      validators.validateValidatorBoolConvert,
    );
  });

  t.test("boolOptional", (t) => {
    assertAll(
      t,
      [
        {
          input: undefined,
          expected: undefined,
        },
        {
          input: true,
          expected: true,
        },
      ],
      validators.validateValidatorBoolOptional,
    );
  });

  t.test("boolDefault", (t) => {
    assertAll(
      t,
      [
        {
          input: undefined,
          expected: true,
        },
        {
          input: true,
          expected: true,
        },
      ],
      validators.validateValidatorBoolDefault,
    );
  });

  t.test("boolAllowNull", (t) => {
    assertAll(
      t,
      [
        {
          input: undefined,
          expected: undefined,
        },
        {
          input: null,
          expected: null,
        },
        {
          input: true,
          expected: true,
        },
      ],
      validators.validateValidatorBoolAllowNull,
    );
  });

  t.test("date", (t) => {
    const date = new Date();
    const str = date.toISOString();
    const invalidFormat = "1221-10-13TAA:47:26.526Z";
    const time = date.getTime();

    assertAll(
      t,
      [
        {
          input: date,
          expected: date,
        },
        {
          input: str,
          expected: date,
        },
        {
          input: time,
          expected: date,
        },
        {
          input: "foo",
          errorKey: "validator.date.min",
        },
        {
          input: invalidFormat,
          errorKey: "validator.date.pattern",
        },
      ],
      validators.validateValidatorDate,
    );
  });

  t.test("dateOptional", (t) => {
    const date = new Date();

    assertAll(
      t,
      [
        {
          input: date,
          expected: date,
        },
        {
          input: "",
          expected: undefined,
        },
        {
          input: undefined,
          expected: undefined,
        },
      ],
      validators.validateValidatorDateOptional,
    );
  });

  t.test("dateAllowNull", (t) => {
    const date = new Date();

    assertAll(
      t,
      [
        {
          input: date,
          expected: date,
        },
        {
          input: "",
          expected: null,
        },
        {
          input: undefined,
          expected: undefined,
        },
        {
          input: null,
          expected: null,
        },
      ],
      validators.validateValidatorDateAllowNull,
    );
  });

  t.test("generic", (t) => {
    assertAll(
      t,
      [
        {
          input: {
            foo: true,
            bar: false,
          },
          errorKey: "validator.number.type",
        },
        {
          input: {
            5: true,
          },
          expected: {
            5: true,
          },
        },
      ],
      validators.validateValidatorGeneric,
    );
  });

  t.test("stringAllowNull", (t) => {
    assertAll(
      t,
      [
        {
          input: "foo",
          expected: "foo",
        },
        {
          input: "",
          expected: null,
        },
        {
          input: undefined,
          expected: undefined,
        },
        {
          input: null,
          expected: null,
        },
      ],
      validators.validateValidatorStringAllowNull,
    );
  });

  // TODO:
  // - number, object, string
});
