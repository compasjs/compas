import { mainFn } from "@compas/stdlib";
import { testingLoadConfig } from "./config.js";
import { areTestsRunning } from "./state.js";
import { runTestsInProcess } from "./worker-internal.js";

/**
 * Wraps `mainFn` and starts the test runner if not already started.
 * By calling this in your test files, it allows the test file to be directly executed
 * via `node file.test.js`. When the runner is already active, this function will be a no
 * op.
 *
 * @since 0.1.0
 *
 * @param {ImportMeta} meta
 * @returns {void}
 */
export function mainTestFn(meta) {
  if (areTestsRunning) {
    return;
  }

  mainFn(meta, async (logger) => {
    const testConfig = await testingLoadConfig(logger);
    testConfig.singleFileMode = true;

    const exitCode = await runTestsInProcess(testConfig);

    process.exit(exitCode);
  });
}
