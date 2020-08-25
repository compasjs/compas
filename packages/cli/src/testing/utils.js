/**
 * Wraps `mainFn` and `areTestsRunning`
 * @param {ImportMeta} meta
 */
import { mainFn } from "@lbu/stdlib";
import { loadTestConfig } from "./config.js";
import { printTestResults } from "./printer.js";
import { runTestsRecursively } from "./runner.js";
import {
  areTestsRunning,
  setAreTestRunning,
  setTestLogger,
  state,
} from "./state.js";

export function mainTestFn(meta) {
  if (areTestsRunning) {
    return;
  }

  mainFn(meta, async (logger) => {
    setTestLogger(logger);
    setAreTestRunning(true);

    // TODO: Convert to process.nextTick
    // Used when `mainTestFn` is called the first thing of the process,
    // which results in no tests registered yet
    await new Promise((r) => {
      setTimeout(r, 2);
    });

    const { setup, teardown } = await loadTestConfig();

    await setup();

    await runTestsRecursively(state);
    const exitCode = printTestResults();

    await teardown();

    process.exit(exitCode);
  });
}
