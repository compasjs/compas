import { mainTestFn, test } from "@lbu/cli";
import { isNil, isPlainObject } from "@lbu/stdlib";

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
  const { validatorValidators } = await import(
    "../../../generated/testing/validators/index.js"
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
      validatorValidators.anyOf,
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
      validatorValidators.array,
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
      validatorValidators.arrayConvert,
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
      validatorValidators.arrayMinMax,
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
      validatorValidators.bool,
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
      validatorValidators.boolOneOf,
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
      validatorValidators.boolConvert,
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
      validatorValidators.boolOptional,
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
      validatorValidators.boolDefault,
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
      validatorValidators.boolAllowNull,
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
      validatorValidators.date,
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
      validatorValidators.generic,
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
      validatorValidators.stringAllowNull,
    );
  });

  // TODO:
  // - number, object, string
});
