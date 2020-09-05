import { bench, mainBenchFn } from "@lbu/cli";
import { TypeCreator } from "@lbu/code-gen";
import { AppError, isNil } from "@lbu/stdlib";
import { generateAndLoad } from "./utils.js";

mainBenchFn(import.meta);

bench("object validator simple", async (b) => {
  const appValidators = await setup();
  b.resetTime();

  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = appValidators.simple({
      foo: "true",
      bar: "5",
      baz: "Ok",
    });
  }
});

bench("object validator nested", async (b) => {
  const appValidators = await setup();
  b.resetTime();

  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = appValidators.nested({
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

async function setup() {
  const imports = await generateAndLoad(
    "code-gen/e2e/bench/validator",
    applyStructure,
  );
  if (isNil(imports?.validator?.appValidators)) {
    throw new AppError("generateAndLoad.missingValidators", 500);
  }

  return imports.validator.appValidators;
}

function applyStructure(app) {
  const T = new TypeCreator();

  app.add(
    T.object("simple").keys({
      foo: T.bool().convert(),
      bar: T.number().convert(),
      baz: T.string().trim().lowerCase(),
    }),
    T.object("nested").keys({
      foo: true,
      bar: 5,
      nest: [T.anyOf().values("foo", T.reference("app", "simple"), "bar")],
    }),
  );

  return {
    enabledGenerators: ["validator"],
  };
}
