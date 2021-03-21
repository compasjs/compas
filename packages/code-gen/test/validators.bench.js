import { bench, mainBenchFn } from "@compas/cli";
import FastestValidator from "fastest-validator";
import * as yup from "yup";

mainBenchFn(import.meta);

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
        foo: yup.mixed().required().oneOf([true]),
        bar: yup.number().required().integer(),
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

bench("compas validator simple", async (b) => {
  const { validateBenchSimple } = await import(
    "../../../generated/testing/bench/bench/validators.js"
  );
  b.resetTime();

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

bench("compas validator nested", async (b) => {
  const { validateBenchNested } = await import(
    "../../../generated/testing/bench/bench/validators.js"
  );
  b.resetTime();

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
