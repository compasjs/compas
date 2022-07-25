import { mainFn } from "@compas/stdlib";
import treeKill from "tree-kill";
import { areTestsRunning, setAreTestRunning, setTestLogger } from "./state.js";
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
    setTestLogger(logger);
    setAreTestRunning(true);

    const exitCode = await runTestsInProcess({
      singleFileMode: true,
    });

    if (exitCode !== 0) {
      return new Promise((r) => {
        treeKill(process.pid, exitCode, r);
      });
    }

    process.exit(exitCode);
  });
}
