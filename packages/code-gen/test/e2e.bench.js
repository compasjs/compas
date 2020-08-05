import { TypeCreator } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { bench, isNil, logBenchResults, mainFn } from "@lbu/stdlib";
import { generateAndLoad } from "./utils.js";

mainFn(import.meta, log, async (logger) => {
  await runBench();
  logBenchResults(logger);
});

export async function runBench() {
  const imports = await generateAndLoad(
    "code-gen/e2e/bench/validator",
    applyStructure,
  );
  if (isNil(imports?.validator?.appValidators)) {
    return;
  }

  const { appValidators } = imports["validator"];

  await bench("object validator simple", (N) => {
    let y;
    for (let i = 0; i < N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = appValidators.simple({
        foo: "true",
        bar: "5",
        baz: "Ok",
      });
    }
  });

  await bench("object validator nested", (N) => {
    let y;
    for (let i = 0; i < N; ++i) {
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
