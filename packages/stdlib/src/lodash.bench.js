import { isNil, isPlainObject } from "./lodash.js";
import { bench, logBenchResults, mainFn } from "./utils.js";

mainFn(import.meta, async (logger) => {
  await runBench();
  logBenchResults(logger);
});

export async function runBench() {
  await bench("isNil", (N) => {
    let y;
    for (let i = 0; i < N; ++i) {
      y = isNil(true);
      // eslint-disable-next-line no-unused-vars
      y = isNil(undefined);
    }
  });

  await bench("isPlainObject", (N) => {
    let y;
    for (let i = 0; i < N; ++i) {
      y = isPlainObject({});
      // eslint-disable-next-line no-unused-vars
      y = isPlainObject(true);
    }
  });
}
