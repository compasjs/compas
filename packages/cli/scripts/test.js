import { cpus } from "os";
import { isMainThread, Worker } from "worker_threads";
import {
  dirnameForModule,
  filenameForModule,
  mainFn,
  pathJoin,
  processDirectoryRecursiveSync,
} from "@compas/stdlib";
import { mainTestFn } from "../index.js";
import { printTestResultsFromWorkers } from "../src/testing/printer.js";
import {
  setAreTestRunning,
  setTestLogger,
  testLogger,
} from "../src/testing/state.js";

const __filename = filenameForModule(import.meta);
const workerFile = new URL(
  `file://${pathJoin(dirnameForModule(import.meta), "../src/testing/test.js")}`,
);

mainFn(import.meta, main);

async function main(logger) {
  if (!isMainThread) {
    logger.error("Test runner can only run as main thread");
    process.exit(1);
  }

  if (process.argv.indexOf("--serial") !== -1) {
    // Allow same process execution for coverage collecting
    const files = listTestFiles();
    for (const file of files) {
      await import(file);
    }
    mainTestFn(import.meta);
    return;
  }

  let randomizeRounds = Number(
    (
      process.argv.find((it) => it.startsWith("--randomize-rounds")) ?? "=1"
    ).split("=")[1],
  );

  if (isNaN(randomizeRounds) || !isFinite(randomizeRounds)) {
    randomizeRounds = 1;
  }

  // Make sure to set tests running, so `mainTestFn` is 'disabled'.
  setAreTestRunning(true);
  setTestLogger(logger);

  // Almost does the same things as `mainTestFn`, however since tests are run by workers
  // in stead of directly. We dispatch them, and then print the results.
  const files = listTestFiles();
  const results = [];

  for (let i = 0; i < randomizeRounds; ++i) {
    if (i !== 0) {
      // Shuffle files in place
      // From: https://stackoverflow.com/a/6274381
      for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]];
      }
    }

    const workers = await initializeWorkers();
    const testResult = await runTests(workers, files);

    // Early exit on test failure
    const hasFailure = testResult.find((it) => it.isFailed);
    if (hasFailure) {
      const exitCode = printTestResultsFromWorkers(testResult);
      process.exit(exitCode);
    }

    // Only keep success results
    results.push(
      ...testResult.map((it) => ({
        isFailed: it.isFailed,
        assertions: it.assertions,
      })),
    );

    // Kill workers
    await Promise.all(workers.map((it) => it.terminate()));
  }

  const exitCode = printTestResultsFromWorkers(results);
  process.exit(exitCode);
}

/**
 * Run tests on a worker pull-basis.
 * Once all files are done or in process, we request results.
 *
 * @param {Worker[]} workers
 * @param {string[]} files
 */
async function runTests(workers, files) {
  let idx = 0;
  const results = [];

  for (const worker of workers) {
    worker.on("message", (message) => {
      if (message.type === "request_file") {
        if (idx === files.length) {
          // Already through our file list, request results
          worker.postMessage({ type: "request_result" });
        } else {
          const file = files[idx];
          idx++;

          worker.postMessage({ type: "provide_file", file });
        }
      } else if (message.type === "provide_result") {
        results.push(message);
      } else {
        testLogger.error({
          type: "test_unknown_worker_message",
          message,
        });
      }
    });
  }

  // Wait till all workers have exited. They should do this once they have provided the
  // results.
  const pArr = [];
  for (const worker of workers) {
    pArr.push(
      new Promise((r) => {
        worker.once("exit", r);
      }),
    );
  }

  await Promise.all(pArr);
  return results;
}

/**
 * List all test files, skipping this file and the worker source file.
 *
 * @returns {string[]}
 */
function listTestFiles() {
  const files = [];
  processDirectoryRecursiveSync(process.cwd(), (file) => {
    if (file === __filename || file === workerFile.pathname) {
      return;
    }

    if (!file.endsWith(".test.js")) {
      return;
    }

    files.push(file);
  });

  return files;
}

/**
 * Create workers and wait till they are initialized.
 * @returns {Promise<Worker[]>}
 */
async function initializeWorkers() {
  const workers = [];

  for (let i = 0; i < cpus().length - 1; ++i) {
    const w = new Worker(workerFile, {});
    workers.push(w);
  }

  return workers;
}
