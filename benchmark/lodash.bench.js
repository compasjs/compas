import { bench, mainBenchFn } from "@compas/cli";
import { isNil, isPlainObject } from "@compas/stdlib";

mainBenchFn(import.meta);

bench("isNil", (b) => {
  let _y;
  for (let i = 0; i < b.N; ++i) {
    _y = isNil(true);

    _y = isNil(undefined);
  }
});

bench("isPlainObject", (b) => {
  let _y;
  for (let i = 0; i < b.N; ++i) {
    _y = isPlainObject({});

    _y = isPlainObject(true);
  }
});
