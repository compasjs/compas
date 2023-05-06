/* eslint-disable import/no-unresolved */

import { pathToFileURL } from "url";
import { bench, mainBenchFn } from "@compas/cli";
import { TypeCreator, Generator } from "@compas/code-gen";
import { mainFn, pathJoin } from "@compas/stdlib";
import FastestValidator from "fastest-validator";
import { testTemporaryDirectory } from "../src/testing.js";

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

async function main(logger) {
  const baseDir = pathJoin(testTemporaryDirectory, `./bench-validators/`);

  const T = new TypeCreator("bench");

  const reusable = {
    foo: T.bool(),
    bar: T.number(),
    baz: T.string().trim().lowerCase(),
  };

  const types = [
    T.object("simple").keys(reusable),
    T.object("nested").keys({
      foo: true,
      bar: 5,
      nest: [reusable],
    }),
  ];

  const generator = new Generator(logger);
  generator.add(...types);
  generator.generate({
    targetLanguage: "js",
    outputDirectory: baseDir,
    generators: {
      validators: {
        includeBaseTypes: true,
      },
    },
  });

  const experimentalValidators = await import(
    pathToFileURL(pathJoin(baseDir, "bench/validators.js"))
  );

  bench("compas/experimental validator simple", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = experimentalValidators.validateBenchSimple(simpleInput);
    }
  });

  bench("fastest-validator validator simple", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = fastestValidatorSimple(simpleInput);
    }
  });

  bench("compas/experimental validator nest", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = experimentalValidators.validateBenchNested(nestedInput);
    }
  });

  bench("fastest-validator validator nested", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = fastestValidatorNested(nestedInput);
    }
  });

  bench("compas/experimental validator nested - 100 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = experimentalValidators.validateBenchNested(nestedInput100);
    }
  });

  bench("fastest-validator validator nested - 100 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = fastestValidatorNested(nestedInput100);
    }
  });

  bench("compas/experimental validator nested - 1000 results", (b) => {
    let y;
    for (let i = 0; i < b.N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = experimentalValidators.validateBenchNested(nestedInput1000);
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

  mainBenchFn(import.meta);
}
