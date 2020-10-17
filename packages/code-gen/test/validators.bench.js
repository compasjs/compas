import { bench, mainBenchFn } from "@lbu/cli";

mainBenchFn(import.meta);

bench("object validator simple", async (b) => {
  const { benchValidators } = await import(
    "../../../generated/testing/bench/index.js"
  );
  b.resetTime();

  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = benchValidators.simple({
      foo: "true",
      bar: "5",
      baz: "Ok",
    });
  }
});

bench("object validator nested", async (b) => {
  const { benchValidators } = await import(
    "../../../generated/testing/bench/index.js"
  );
  b.resetTime();

  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = benchValidators.nested({
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
