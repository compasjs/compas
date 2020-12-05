import { mainFn } from "@compas/stdlib";
import { printBenchResults } from "./printer.js";
import { runBenchmarks } from "./runner.js";
import {
  areBenchRunning,
  setAreBenchRunning,
  setBenchLogger,
  state,
} from "./state.js";

/**
 * Wraps `mainFn` and `areBenchRunning
 * @param {ImportMeta} meta
 */
export function mainBenchFn(meta) {
  if (areBenchRunning) {
    return;
  }

  mainFn(meta, async (logger) => {
    setBenchLogger(logger);
    setAreBenchRunning(true);

    // Used when `mainBenchFn` is called the first thing of the process,
    // which results in no benchmarks registered yet
    await new Promise((r) => {
      setTimeout(r, 2);
    });

    await runBenchmarks(state);

    const exitCode = printBenchResults();

    process.exit(exitCode);
  });
}
