import { mainFn } from "@compas/stdlib";
import { loadTestConfig } from "./config.js";
import { printTestResults } from "./printer.js";
import { runTestsRecursively } from "./runner.js";
import {
  areTestsRunning,
  globalSetup,
  globalTeardown,
  setAreTestRunning,
  setTestLogger,
  state,
} from "./state.js";

/**
 * Wraps `mainFn` and `areTestsRunning`
 * @param {ImportMeta} meta
 */
export function mainTestFn(meta) {
  if (areTestsRunning) {
    return;
  }

  mainFn(meta, async (logger) => {
    setTestLogger(logger);
    setAreTestRunning(true);

    // Used when `mainTestFn` is called the first thing of the process,
    // which results in no tests registered yet
    await new Promise((r) => {
      setTimeout(r, 2);
    });

    await loadTestConfig();
    await globalSetup();
    await runTestsRecursively(state);
    await globalTeardown();

    const exitCode = printTestResults();

    process.exit(exitCode);
  });
}
