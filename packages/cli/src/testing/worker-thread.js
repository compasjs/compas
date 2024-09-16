import { setTimeout } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import { isMainThread, parentPort, threadId } from "node:worker_threads";
import { AppError, mainFn } from "@compas/stdlib";
import { testingLoadConfig } from "./config.js";
import {
  markTestFailuresRecursively,
  printFailedResults,
  sumAssertions,
} from "./printer.js";
import { runTestsRecursively } from "./runner.js";
import { state, testLogger } from "./state.js";

mainFn(import.meta, main);

async function main(logger) {
  if (isMainThread) {
    logger.error("Can't run test worker on the main thread.");
    process.exit(1);
  }

  const testConfig = await testingLoadConfig();

  try {
    testLogger.info(`Running: setup`);
    await testConfig.setup();
  } catch (e) {
    logger.error({
      message: "Error when calling the 'setup' defined in 'test/config.js'.",
      error: AppError.format(e),
    });

    // Give time to propagate the message to the main thread
    await setTimeout(5);
    process.exit(1);
  }

  const teardown = async () => {
    try {
      testLogger.info(`Running: teardown`);
      await testConfig.teardown();
      await setTimeout(5);
      process.exit(0);
    } catch (e) {
      logger.error({
        message:
          "Error when calling the 'teardown' defined in 'test/config.js'.",
        error: AppError.format(e),
      });

      // Give time to propagate the message to the main thread
      await setTimeout(5);
      process.exit(1);
    }
  };

  const messageDispatcher = createMessageDispatcher(
    logger,
    testConfig,
    teardown,
  );
  // @ts-ignore
  parentPort.on("message", messageDispatcher);
  // Start requesting files as soon as possible
  // @ts-ignore
  parentPort.postMessage({ type: "request_file" });
}

/**
 * Small message handler.
 * It works by this worker requesting a new file as soon as possible. If the controller
 * does not have any files left, it will request a result. Once the worker provided the
 * results, it can safely exit.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../testing/config.js").TestConfig} testConfig
 * @param {() => void} callback
 * @returns {(message: any) => void}
 */
function createMessageDispatcher(logger, testConfig, callback) {
  return function (message) {
    if (message.type === "request_result") {
      markTestFailuresRecursively(state);

      // Provide a summary of the results
      // @ts-ignore
      parentPort.postMessage({
        type: "provide_result",
        threadId,
        isFailed: state.hasFailure,
        assertions: sumAssertions(state),
        failedResult: getFailedResult(),
      });

      callback();
    } else if (message.type === "provide_file") {
      const idx = state.children.length;
      // @ts-ignore
      import(pathToFileURL(message.file)).then(async () => {
        if (state.children[idx]) {
          // Handle multiple added suites for a single import
          for (let i = idx; i < state.children.length; ++i) {
            await runTestsRecursively(testConfig, state.children[i]);
          }
        }
        // @ts-ignore
        parentPort.postMessage({ type: "request_file" });
      });
    }
  };
}

/**
 * Format failed result for all tests run by this worker. This is only used if one of the
 * workers reports a failure.
 *
 * @returns {Array<string>}
 */
function getFailedResult() {
  const result = [];
  for (const child of state.children) {
    printFailedResults(child, result, 0);
  }
  return result;
}
