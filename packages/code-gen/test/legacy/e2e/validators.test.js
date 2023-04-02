/* eslint-disable import/no-unresolved */
import { pathToFileURL } from "url";
import { mainTestFn, test } from "@compas/cli";
import { isNil, isPlainObject, pathJoin } from "@compas/stdlib";
import { TypeCreator } from "../../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

/**
 * @template T
 * @param {TestRunner} t
 * @param {{
 *   errorLength?: number,
 *   errorKey?: string,
 *   errorObjectKey?: (string)|(string|number)[],
 *   expected?: *,
 *   input?: *
 * }[]} cases
 * @param {(value: any) => Either<T>} fn
 */
const assertAll = (t, cases, fn) => {
  for (const item of cases) {
    const { value, error } = fn(item.input);

    if (!isNil(error)) {
      if (!isNil(item.errorLength)) {
        t.equal(Object.keys(error.info).length, item.errorLength);
      }
      if (Array.isArray(item.errorObjectKey)) {
        let actual = error.info;
        let i = 0;
        while (i < item.errorObjectKey.length) {
          actual = actual[item.errorObjectKey[i]];
          i++;
        }

        t.equal(
          actual?.key,
          item.errorKey,
          JSON.stringify(error.toJSON(), null, 2),
        );
      } else {
        t.equal(
          error.info[item.errorObjectKey]?.key,
          item.errorKey,
          JSON.stringify(error.toJSON(), null, 2),
        );
      }
    } else {
      if (
        isNil(item.expected) ||
        ["number", "string", "boolean"].indexOf(typeof item.expected) !== -1
      ) {
        t.equal(value, item.expected, fn.name);
      } else {
        if (isPlainObject(item.expected)) {
          // Quick hack, so we can test objects created by the validators
          item.expected = Object.assign(Object.create(null), item.expected);
        }
        t.deepEqual(value, item.expected);
      }
    }
  }
};

test("code-gen/e2e/validators", async (t) => {
  const T = new TypeCreator("validator");
  const { exitCode, generatedDirectory, cleanupGeneratedDirectory } =
    await codeGenToTemporaryDirectory(
      [
        // AnyOf
        T.anyOf("anyOf").values(T.bool(), T.number(), T.bool()),

        // Array
        T.array("array").values(T.bool()),
        T.array("arrayConvert").values(T.bool()).convert(),
        T.array("arrayMinMax").values(T.bool()).min(1).max(10),

        // Bool
        T.bool("bool"),
        T.bool("boolOneOf").oneOf(true),
        T.bool("boolConvert").convert(),
        T.bool("boolOptional").optional(),
        T.bool("boolDefault").default("true"),
        T.bool("boolAllowNull").allowNull(),

        // Date
        T.date("date"),
        T.date("dateOptional").optional(),
        T.date("dateAllowNull").allowNull(),
        T.date("dateMin").min(new Date(2020, 0, 0, 0, 0, 0, 0)),
        T.date("dateMax").max(new Date(2020, 0, 0, 0, 0, 0, 0)),
        T.date("datePast").inThePast(),
        T.date("dateFuture").inTheFuture(),

        // Generic
        T.generic("generic").keys(T.number().convert()).values(T.bool()),

        // String
        T.string("stringAllowNull").allowNull(),
        T.string("stringDisallowedCharacters")
          .disallowCharacters([">", "<", "\\\\"])
          .max(10),

        // Object
        T.object("object").keys({
          bool: T.bool(),
          string: T.string(),
        }),
        T.object("objectWithOptionalReference").keys({
          ref: T.optional().value(T.reference("validator", "object")),
        }),
      ],
      {
        enabledGroups: ["validator"],
        isNode: true,
        dumpStructure: true,
      },
    );

  t.equal(exitCode, 0);

  const validators = await import(
    pathToFileURL(pathJoin(generatedDirectory, "validator/validators.js"))
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
          errorObjectKey: ["$", 0],
          errorKey: "validator.boolean.type",
        },
        {
          input: "Foo",
          errorLength: 1,
          errorObjectKey: ["$", 1],
          errorKey: "validator.number.type",
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
          errorObjectKey: "$",
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
          errorObjectKey: "$",
          errorKey: "validator.array.min",
        },
        {
          input: [true, true],
          expected: [true, true],
        },
        {
          // Checks min/max first before the values
          input: "1234567891011".split(""),
          errorObjectKey: "$",
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
          errorObjectKey: "$",
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
          errorObjectKey: "$",
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
          errorObjectKey: "$",
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
          errorObjectKey: "$",
          errorKey: "validator.date.invalid",
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

  t.test("dateMin", (t) => {
    const date = new Date();
    const belowMin = new Date(1900, 0, 0, 0, 0, 0, 0);

    assertAll(
      t,
      [
        {
          input: date,
          expected: date,
        },
        {
          input: belowMin,
          errorObjectKey: "$",
          errorKey: "validator.date.dateMin",
        },
      ],
      validators.validateValidatorDateMin,
    );
  });

  t.test("dateMax", (t) => {
    const date = new Date(2000, 0, 0, 0, 0, 0, 0);
    const afterMax = new Date(2900, 0, 0, 0, 0, 0, 0);

    assertAll(
      t,
      [
        {
          input: date,
          expected: date,
        },
        {
          input: afterMax,
          errorObjectKey: "$",
          errorKey: "validator.date.dateMax",
        },
      ],
      validators.validateValidatorDateMax,
    );
  });

  t.test("datePast", (t) => {
    const datePast = new Date();
    datePast.setSeconds(datePast.getSeconds() - 1);
    const dateFuture = new Date();
    dateFuture.setSeconds(dateFuture.getSeconds() + 1);

    assertAll(
      t,
      [
        {
          input: datePast,
          expected: datePast,
        },
        {
          input: dateFuture,
          errorObjectKey: "$",
          errorKey: "validator.date.past",
        },
      ],
      validators.validateValidatorDatePast,
    );
  });

  t.test("dateFuture", (t) => {
    const datePast = new Date();
    datePast.setSeconds(datePast.getSeconds() - 1);
    const dateFuture = new Date();
    dateFuture.setSeconds(dateFuture.getSeconds() + 1);

    assertAll(
      t,
      [
        {
          input: dateFuture,
          expected: dateFuture,
        },
        {
          input: datePast,
          errorObjectKey: "$",
          errorKey: "validator.date.future",
        },
      ],
      validators.validateValidatorDateFuture,
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
          errorObjectKey: "$.$key[foo]",
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

  t.test("stringDisallowCharacters", (t) => {
    assertAll(
      t,
      [
        {
          input: "foo",
          expected: "foo",
        },
        {
          input: "fo>",
          errorObjectKey: "$",
          errorKey: "validator.string.disallowedCharacter",
        },
        {
          input: "fo\\",
          errorObjectKey: "$",
          errorKey: "validator.string.disallowedCharacter",
        },
        {
          input: "fobarff>asdf",
          errorObjectKey: "$",
          errorKey: "validator.string.max",
        },
        {
          input: "Foo&gt;",
          expected: "Foo&gt;",
        },
      ],
      validators.validateValidatorStringDisallowedCharacters,
    );
  });

  t.test("objectWithOptionalReference", (t) => {
    assertAll(
      t,
      [
        {
          input: {},
          expected: {
            ref: undefined,
          },
        },
        {
          input: {
            ref: {
              bool: true,
              string: "str",
            },
          },
          expected: {
            ref: Object.assign(Object.create(null), {
              bool: true,
              string: "str",
            }),
          },
        },
        {
          input: {
            ref: {
              bool: true,
            },
          },
          errorObjectKey: "$.ref.string",
          errorKey: "validator.string.undefined",
        },
      ],
      validators.validateValidatorObjectWithOptionalReference,
    );
  });

  t.test("teardown", async (t) => {
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
