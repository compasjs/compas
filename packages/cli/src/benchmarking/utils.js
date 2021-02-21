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
 * Wraps `mainFn` and starts the benchmark runner if not already started.
 * By calling this in your bench files, it allows the benchmark file to be directly executed
 * via `node file.bench.js`. When the runner is already active, this function will be a no
 * op.
 *
 * @since 0.1.0
 *
 * @param {ImportMeta} meta
 * @returns {void}
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
