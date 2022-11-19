/* eslint-disable import/no-unresolved */

import { pathToFileURL } from "url";
import { bench, mainBenchFn } from "@compas/cli";
import { TypeCreator } from "@compas/code-gen";
import { AppError, isNil, mainFn, pathJoin } from "@compas/stdlib";
import FastestValidator from "fastest-validator";
import * as yup from "yup";
import { codeGenToTemporaryDirectory } from "../packages/code-gen/test/utils.test.js";

const simpleInput = {
  foo: true,
  bar: 5,
  baz: "Ok ",
};

const nestedInput = {
  foo: true,
  bar: 5,
  nest: [
    {
      foo: true,
      bar: 15,
      baz: "Yes ",
    },
    {
      foo: true,
      bar: 15,
      baz: "Yes ",
    },
  ],
};

const nestedInput100 = {
  foo: true,
  bar: 5,
  nest: Array.from({ length: 50 })
    .map(() => [
      {
        foo: true,
        bar: 15,
        baz: "Yes ",
      },
      {
        foo: true,
        bar: 15,
        baz: "Yes ",
      },
    ])
    .flat(),
};

const objs = [
  {
    foo: false,
    bar: 10,
    baz: "hello worlds",
  },
  {
    foo: true,
    bar: 3361,
    baz: "xxxxx",
  },
  {
    foo: false,
    bar: -10,
    baz: "lorem ipsum thingie !",
  },
  {
    foo: false,
    bar: -1000,
    baz: "lorem ipsum thingie !\nFOOSOSDFO",
  },
];

const nestedInput1000 = {
  foo: true,
  bar: 5,
  nest: Array.from({ length: 1000 })
    .map(() => objs[Math.floor(Math.random() * 4)])
    .flat(),
};

const yupSimple = yup.object().shape({
  foo: yup.bool().required(),
  bar: yup.number().required().integer(),
  baz: yup.string().required().trim().lowercase(),
});

const yupNested = yup.object().shape({
  foo: yup.mixed().required().oneOf([true]),
  bar: yup.mixed().required().oneOf([5]),
  nest: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        foo: yup.bool().required(),
        bar: yup.number().required().integer(),
        baz: yup.string().required().trim().lowercase(),
      }),
    ),
});

const fastestValidator = new FastestValidator({});

const simpleFastestValidatorReusable = {
  foo: { type: "boolean" },
  bar: { type: "number", integer: true },
  baz: { type: "string", trim: true, lowercase: true },
};
const fastestValidatorSimple = fastestValidator.compile({
  ...simpleFastestValidatorReusable,
  $$strict: true,
});

const fastestValidatorNested = fastestValidator.compile({
  foo: {
    type: "equal",
    value: true,
    strict: true,
  },
  bar: {
    type: "equal",
    value: 5,
    strict: true,
  },
  nest: {
    type: "array",
    items: {
      type: "object",
      strict: true,
      props: simpleFastestValidatorReusable,
    },
  },
  $$strict: true,
});

mainFn(import.meta, main);

async function main() {
  const T = new TypeCreator("bench");

  const { exitCode, stdout, stderr, generatedDirectory } =
    await codeGenToTemporaryDirectory(
      [
        T.object("simple").keys({
          foo: T.bool(),
          bar: T.number(),
          baz: T.string().trim().lowerCase(),
        }),
        T.object("nested").keys({
          foo: true,
          bar: 5,
          nest: [T.reference("bench", "simple")],
        }),
      ],
      {
        isNodeServer: true,
        enabledGenerators: ["validator"],
        dumpStructure: true,
      },
    );

  if (exitCode !== 0) {
    throw AppError.serverError({
      exitCode,
      stdout,
      stderr,
    });
  }

  const { validateBenchSimple, validateBenchNested } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "bench/validators.js"))
  );

  bench("compas validator simple", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = validateBenchSimple(simpleInput);
    }
  });

  bench("yup validator simple", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = yupSimple.validateSync(simpleInput, {
        stripUnknown: true,
      });
    }
  });

  bench("fastest-validator validator simple", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = fastestValidatorSimple(simpleInput);
    }
  });

  bench("compas validator nested", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = validateBenchNested(nestedInput);
    }
  });

  bench("yup validator nested", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = yupNested.validateSync(nestedInput, {
        stripUnknown: true,
      });
    }
  });

  bench("fastest-validator validator nested", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = fastestValidatorNested(nestedInput);
    }
  });

  bench("compas validator nested - 100 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = validateBenchNested(nestedInput100);
    }
  });

  bench("yup validator nested - 100 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = yupNested.validateSync(nestedInput100, {
        stripUnknown: true,
      });
    }
  });

  bench("fastest-validator validator nested - 100 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = fastestValidatorNested(nestedInput100);
    }
  });

  bench("compas - one fn - 100 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = validateBenchNestedInline(nestedInput100);

      if (y.errors && y.errors.length) {
        throw y;
      }
    }
  });

  bench("compas validator nested - 1000 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = validateBenchNested(nestedInput1000);
    }
  });

  bench("yup validator nested - 1000 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = yupNested.validateSync(nestedInput1000, {
        stripUnknown: true,
      });
    }
  });

  bench("fastest-validator validator nested - 1000 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = fastestValidatorNested(nestedInput1000);
    }

    if (y !== true) {
      throw y;
    }
  });

  bench("compas - one fn - 1000 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = validateBenchNestedInline(nestedInput1000);

      if (y.errors && y.errors.length) {
        throw y;
      }
    }
  });

  mainBenchFn(import.meta);
}

function validateBenchNestedInline(value) {
  const errors = [];
  const result = {};

  const propertyPath = "foo.bar";

  if (isNil(value)) {
    errors.push({
      propertyPath,
      key: "validator.object.undefined",
      info: {},
    });
  }
  if (typeof value !== "object") {
    errors.push({
      propertyPath,
      key: "validator.object.type",
      info: {},
    });
  }

  for (const key of Object.keys(value)) {
    if (!key) {
      errors.push({
        propertyPath,
        key: "validator.object.strict",
        info: {
          expectedKeys: ["foo", "bar", "baz"],
          foundKeys: [...Object.keys(value)],
        },
      });
    }
  }

  {
    if (isNil(value.foo)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.boolean.undefined",
            info: {},
          },
        ],
      };
    }
    if (typeof value.foo !== "boolean") {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.boolean.type",
            info: {},
          },
        ],
      };
    }
    if (value.foo !== true) {
      const oneOf = true;
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.boolean.oneOf",
            info: { oneOf, value: value.foo },
          },
        ],
      };
    }
    result.foo = value.foo;
  }
  {
    if (isNil(value.bar)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.number.undefined",
            info: {},
          },
        ],
      };
    }
    if (
      typeof value.bar !== "number" ||
      isNaN(value.bar) ||
      !isFinite(value.bar)
    ) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.number.type",
            info: {},
          },
        ],
      };
    }
    if (!Number.isInteger(value.bar)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.number.integer",
            info: {},
          },
        ],
      };
    }
    if (value.bar < -2147483647) {
      const min = -2147483647;
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.number.min",
            info: { min },
          },
        ],
      };
    }
    if (value.bar > 2147483647) {
      const max = 2147483647;
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.number.max",
            info: { max },
          },
        ],
      };
    }
    if (value.bar !== 5) {
      const oneOf = [5];
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.number.oneOf",
            info: { oneOf, value: value.bar },
          },
        ],
      };
    }
    result.bar = value.bar;
  }
  {
    if (isNil(value.nest)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.array.undefined",
            info: {},
          },
        ],
      };
    }
    if (!Array.isArray(value.nest)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.array.type",
            info: {},
          },
        ],
      };
    }
    result.nest = Array.from({ length: value.nest.length });
    for (let i = 0; i < value.nest.length; ++i) {
      result.nest[i] = {};

      if (isNil(value.nest[i])) {
        /** @type {{ errors: InternalError[] }} */
        return {
          errors: [
            {
              propertyPath,
              key: "validator.object.undefined",
              info: {},
            },
          ],
        };
      }
      if (typeof value.nest[i] !== "object") {
        /** @type {{ errors: InternalError[] }} */
        return {
          errors: [
            {
              propertyPath,
              key: "validator.object.type",
              info: {},
            },
          ],
        };
      }
      for (const key of Object.keys(value.nest[i])) {
        if (!key) {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.object.strict",
                info: {
                  expectedKeys: [..."key"],
                  foundKeys: [...Object.keys(value.nest[i])],
                },
              },
            ],
          };
        }
      }
      {
        if (isNil(value.nest[i].foo)) {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.boolean.undefined",
                info: {},
              },
            ],
          };
        }
        if (typeof value.nest[i].foo !== "boolean") {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.boolean.type",
                info: {},
              },
            ],
          };
        }

        result.nest[i].foo = value.nest[i].foo;
      }
      {
        if (isNil(value.nest[i].bar)) {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.number.undefined",
                info: {},
              },
            ],
          };
        }
        if (
          typeof value.nest[i].bar !== "number" ||
          isNaN(value.nest[i].bar) ||
          !isFinite(value.nest[i].bar)
        ) {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.number.type",
                info: {},
              },
            ],
          };
        }
        if (!Number.isInteger(value.nest[i].bar)) {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.number.integer",
                info: {},
              },
            ],
          };
        }
        if (value.nest[i].bar < -2147483647) {
          const min = -2147483647;
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.number.min",
                info: { min },
              },
            ],
          };
        }
        if (value.nest[i].bar > 2147483647) {
          const max = 2147483647;
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.number.max",
                info: { max },
              },
            ],
          };
        }

        result.nest[i].bar = value.nest[i].bar;
      }
      {
        if (isNil(value.nest[i].baz)) {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.string.undefined",
                info: {},
              },
            ],
          };
        }
        if (typeof value.nest[i].baz !== "string") {
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.string.type",
                info: {},
              },
            ],
          };
        }
        value.nest[i].baz = value.nest[i].baz.trim();
        if (value.nest[i].baz.length < 1) {
          const min = 1;
          /** @type {{ errors: InternalError[] }} */
          return {
            errors: [
              {
                propertyPath,
                key: "validator.string.min",
                info: { min },
              },
            ],
          };
        }
        value.nest[i].baz = value.nest[i].baz.toLowerCase();
        result.nest[i].baz = value.nest[i].baz;
      }
    }
  }

  if (errors && errors.length) {
    const info = {};
    for (const err of errors) {
      if (isNil(info[err.propertyPath])) {
        info[err.propertyPath] = err;
      } else if (Array.isArray(info[err.propertyPath])) {
        info[err.propertyPath].push(err);
      } else {
        info[err.propertyPath] = [info[err.propertyPath], err];
      }
    }

    return {
      error: AppError.validationError("validator.error", info),
    };
  }

  return { value: result };
}
