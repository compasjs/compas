import { log } from "@lbu/insight";
import { uuid } from "./datatypes.js";
import { bench, logBenchResults, mainFn } from "./utils.js";

mainFn(import.meta, log, async (logger) => {
  await runBench();
  logBenchResults(logger);
});

export async function runBench() {
  await bench("uuid", (N) => {
    let y;
    for (let i = 0; i < N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = uuid();
    }
  });

  await bench("uuid.isValid", (N) => {
    const id = uuid();
    let y;
    for (let i = 0; i < N; ++i) {
      // eslint-disable-next-line no-unused-vars
      y = uuid.isValid(id);
    }
  });
}
