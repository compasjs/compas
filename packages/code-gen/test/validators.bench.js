import { bench, mainBenchFn } from "@lbu/cli";
import FastestValidator from "fastest-validator";
import * as yup from "yup";

mainBenchFn(import.meta);

// Expected output when logging all options
// lbuSimple: [Object: null prototype] { foo: true, bar: 5, baz: 'ok' }
// lbuNested: [Object: null prototype] {
//     foo: true,
//     bar: 5,
//     nest: [
//       'foo',
//       [Object: null prototype] { foo: true, bar: 15, baz: 'yes' },
//       [Object: null prototype] { foo: true, bar: 15, baz: 'yes' },
//       'bar'
//     ]
//   }

// fvSimple: true
// fvNested: true

// yupSimple: { baz: 'ok', bar: 5, foo: true }
// yupNested: {
//     foo: true,
//     bar: 5,
//     nest: [
//       'foo',
//       { foo: true, bar: 15, baz: 'Yes ' },
//       { foo: true, bar: 15, baz: 'Yes ' },
//       'bar'
//     ]
//   }
// }

const yupSimple = yup.object().shape({
  foo: yup.bool().required(),
  bar: yup.number().required().integer(),
  baz: yup.string().required().trim().lowercase(),
});

// A bit convoluted, since Yup doesn't allow for nested schema's in oneOf
// https://github.com/jquense/yup/issues/662
const yupNested = yup.object().shape({
  foo: yup.mixed().required().oneOf([true]),
  bar: yup.mixed().required().oneOf([5]),
  nest: yup
    .array()
    .required()
    .of(
      yup.mixed().when({
        is: (value) => typeof value === "string",
        then: yup.mixed().required().oneOf(["foo", yupSimple, "bar"]),
        otherWise: yupSimple,
      }),
    ),
});

const fastestValidator = new FastestValidator({});

const simpleFastestValidatorReusable = {
  foo: { type: "boolean" },
  bar: { type: "number", integer: true, convert: true },
  baz: { type: "string", trim: true, lowercase: true },
  $$strict: true,
};
const fastestValidatorSimple = fastestValidator.compile(
  simpleFastestValidatorReusable,
);

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
    items: [
      {
        type: "equal",
        value: "foo",
        strict: true,
      },
      { type: "object", ...simpleFastestValidatorReusable },
      {
        type: "equal",
        value: "bar",
        strict: true,
      },
    ],
  },
  $$strict: true,
});

bench("lbu validator simple", async (b) => {
  const { validateBenchSimple } = await import(
    "../../../generated/testing/bench/index.js"
  );
  b.resetTime();

  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = validateBenchSimple({
      foo: true,
      bar: 5,
      baz: "Ok ",
    });
  }
});

bench("yup validator simple", (b) => {
  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = yupSimple.validateSync(
      {
        foo: true,
        bar: 5,
        baz: "Ok ",
      },
      {
        stripUnknown: true,
      },
    );
  }
});

bench("fastest-validator validator simple", (b) => {
  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = fastestValidatorSimple(
      {
        foo: true,
        bar: 5,
        baz: "Ok ",
      },
      {
        stripUnknown: true,
      },
    );
  }
});

bench("lbu validator nested", async (b) => {
  const { validateBenchNested } = await import(
    "../../../generated/testing/bench/index.js"
  );
  b.resetTime();

  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = validateBenchNested({
      foo: true,
      bar: 5,
      nest: [
        "foo",
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
        "bar",
      ],
    });
  }
});

bench("yup validator nested", (b) => {
  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = yupNested.validateSync(
      {
        foo: true,
        bar: 5,
        nest: [
          "foo",
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
          "bar",
        ],
      },
      {
        stripUnknown: true,
      },
    );
  }
});

bench("fastest-validator validator nested", (b) => {
  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = fastestValidatorNested(
      {
        foo: true,
        bar: 5,
        nest: [
          "foo",
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
          "bar",
        ],
      },
      {
        stripUnknown: true,
      },
    );
  }
});
