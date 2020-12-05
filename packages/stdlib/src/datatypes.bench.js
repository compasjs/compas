import { bench, mainBenchFn } from "@compas/cli";
import { uuid } from "./datatypes.js";

mainBenchFn(import.meta);

bench("uuid", (b) => {
  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = uuid();
  }
});

bench("uuid.isValid", (b) => {
  const id = uuid();
  let y;
  for (let i = 0; i < b.N; ++i) {
    // eslint-disable-next-line no-unused-vars
    y = uuid.isValid(id);
  }
});
