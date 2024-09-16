import { bench, mainBenchFn } from "@compas/cli";
import { uuid } from "@compas/stdlib";

mainBenchFn(import.meta);

bench("uuid", (b) => {
  let _y;
  for (let i = 0; i < b.N; ++i) {
    _y = uuid();
  }
});

bench("uuid.isValid", (b) => {
  const id = uuid();
  let _y;
  for (let i = 0; i < b.N; ++i) {
    _y = uuid.isValid(id);
  }
});
