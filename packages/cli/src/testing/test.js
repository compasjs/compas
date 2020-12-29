import { isMainThread, parentPort, threadId } from "worker_threads";
import { mainFn } from "@compas/stdlib";
import { loadTestConfig } from "./config.js";
import {
  markTestFailuresRecursively,
  printFailedResults,
  sumAssertions,
} from "./printer.js";
import { runTestsRecursively } from "./runner.js";
import {
  globalSetup,
  globalTeardown,
  setAreTestRunning,
  setTestLogger,
  state,
} from "./state.js";

mainFn(import.meta, main);

async function main(logger) {
  if (isMainThread) {
    logger.error("Can't run worker as main thread.");
    process.exit(1);
  }

  // Make sure `mainTestFn` is disabled
  setAreTestRunning(true);
  setTestLogger(logger);

  await loadTestConfig();
  await globalSetup();

  parentPort.on("message", dispatchMessage);
  // Start requesting files as soon as possible
  parentPort.postMessage({ type: "request_file" });
}

/**
 * Small message handler.
 * It works by this worker requesting a new file as soon as possible. If the controller
 * does not have any files left, it will request a result. Once the worker provided the
 * results, it can safely exit.
 *
 * @param {*} message
 */
function dispatchMessage(message) {
  if (message.type === "request_result") {
    markTestFailuresRecursively(state);

    // Provide a summary of the results
    parentPort.postMessage({
      type: "provide_result",
      threadId,
      isFailed: state.hasFailure,
      assertions: sumAssertions(state),
      failedResult: getFailedResult(),
    });

    globalTeardown().then(() => {
      process.exit(0);
    });
  } else if (message.type === "provide_file") {
    const idx = state.children.length;
    import(message.file).then(async () => {
      if (state.children[idx]) {
        // Handle multiple added suites for a single import
        for (let i = idx; i < state.children.length; ++i) {
          await runTestsRecursively(state.children[i]);
        }
      }
      parentPort.postMessage({ type: "request_file" });
    });
  }
}

/**
 * Format failed result for all tests run by this worker. This is only used if one of the
 * workers reports a failure.
 *
 * @returns {string[]}
 */
function getFailedResult() {
  const result = [];
  for (const child of state.children) {
    printFailedResults(child, result, 0);
  }
  return result;
}
