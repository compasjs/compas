/* eslint-disable import/no-unresolved */

import { pathToFileURL } from "url";
import { bench, mainBenchFn } from "@compas/cli";
import { TypeCreator } from "@compas/code-gen";
import { AppError, mainFn, pathJoin } from "@compas/stdlib";
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

const nestedInput1000 = {
  foo: true,
  bar: 5,
  nest: Array.from({ length: 500 })
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
  });

  mainBenchFn(import.meta);
}
