import { bench, mainBenchFn } from "@compas/cli";
import { isNil, isPlainObject } from "@compas/stdlib";

mainBenchFn(import.meta);

bench("isNil", (b) => {
  let y;
  for (let i = 0; i < b.N; ++i) {
    y = isNil(true);
    // eslint-disable-next-line no-unused-vars
    y = isNil(undefined);
  }
});

bench("isPlainObject", (b) => {
  let y;
  for (let i = 0; i < b.N; ++i) {
    y = isPlainObject({});
    // eslint-disable-next-line no-unused-vars
    y = isPlainObject(true);
  }
});
