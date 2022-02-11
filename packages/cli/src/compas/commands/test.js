import { url } from "inspector";
import { cpus } from "os";
import { isMainThread, Worker } from "worker_threads";
import {
  dirnameForModule,
  filenameForModule,
  isNil,
  pathJoin,
  processDirectoryRecursiveSync,
  spawn,
} from "@compas/stdlib";
import { printTestResultsFromWorkers } from "../../testing/printer.js";
import {
  setAreTestRunning,
  setTestLogger,
  testLogger,
} from "../../testing/state.js";
import { runTestsInProcess } from "../../testing/test-worker-internal.js";

const __filename = filenameForModule(import.meta);
const workerFile = new URL(
  `file://${pathJoin(
    dirnameForModule(import.meta),
    "../../testing/test-worker.js",
  )}`,
);

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "test",
  shortDescription: "Run all tests in your project.",
  longDescription: `The test runner searches for all files ending with '.test.js' and runs them.
Tests run in series in a single worker and subtests run serially in the order they are defined. If '--serial' is not passed, there will be multiple workers each executing parts of the tests.

Test files should be ordinary JavaScript files. By calling 'mainTestFn' at the top of your file you can still use 'node ./path/to/file.test.js' to execute the tests.
  
Global configuration can be applied to the test runners via a 'test/config.js' file.
A global timeout can be configured by setting 'export const timeout = 2500;'. The value is specified in milliseconds.
By default, every subtest should have at least a single assertion or register a subtest via 't.test()'. To disable this, you can set 'export const enforceSingleAssertion = false'.
There is also a global 'setup' and 'teardown' function that can be exported from the 'test/config.js' file. They may return a Promise.

To prevent flaky tests, '--randomize-rounds' can be used. This shuffles the order in which the tests are started. And prevents dependencies between test files. Making it easier to run a single test file via for examples 'compas run ./path/to/file.test.js'.

Collecting and processing coverage information is done using C8. Use one of the supported configuration files by C8 to alter its behaviour. See https://www.npmjs.com/package/c8 for more information.
`,
  modifiers: {
    isWatchable: true,
  },
  flags: [
    {
      name: "serial",
      rawName: "--serial",
      description:
        "Run tests serially instead of in parallel. Alternatively set '--parallel-count 1'",
    },
    {
      name: "parallelCount",
      rawName: "--parallel-count",
      description:
        "The number of workers to use, when running in parallel. Defaulting to (the number of CPU cores - 1) or 4, whichever is lower.",
      value: {
        specification: "number",
      },
    },
    {
      name: "randomizeRounds",
      rawName: "--randomize-rounds",
      description:
        "Runs test the specified amount of times, shuffling the test file order between runs.",
      value: {
        specification: "number",
      },
    },
    {
      name: "coverage",
      rawName: "--coverage",
      description: "Collect coverage information while running the tests.",
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  if (!isMainThread) {
    logger.error("The test runner can only run as the main thread.");
    return {
      exitStatus: "failed",
    };
  }

  if (state.flags.coverage && !isNil(state.flags.randomizeRounds)) {
    logger.error("Can't run '--coverage' with '--randomize-rounds'.");
    return {
      exitStatus: "failed",
    };
  }

  if (state.flags.serial && !isNil(state.flags.parallelCount)) {
    logger.error("Can't specify both '--serial' and '--parallel-count'.");
    return {
      exitStatus: "failed",
    };
  }

  /** @type {number} */
  // @ts-ignore
  const parallelCount = state.flags.serial
    ? 1
    : state.flags.parallelCount ?? Math.min(4, cpus().length - 1);

  if (state.flags.coverage) {
    const { exitCode } = await spawn(`node`, [
      "./node_modules/.bin/c8",
      "node",
      process.argv[1],
      "test",
      "--parallel-count",
      `${parallelCount}`,
    ]);

    return {
      exitStatus: exitCode === 0 ? "passed" : "failed",
    };
  }

  state.flags.randomizeRounds = state.flags.randomizeRounds ?? 1;

  // Make sure to set tests running, so `mainTestFn` is 'disabled'.
  setAreTestRunning(true);
  setTestLogger(logger);

  const files = listTestFiles();

  if (parallelCount === 1 && state.flags.randomizeRounds === 1) {
    // Run serial tests in the same process
    const exitCode = await runTestsInProcess({ files });

    return {
      exitStatus: exitCode === 0 ? "passed" : "failed",
    };
  }

  // Almost does the same things as `mainTestFn`, however since tests are run by workers
  // instead of directly. We dispatch them, and then print the results.
  const results = [];

  for (let i = 0; i < state.flags.randomizeRounds; ++i) {
    if (i !== 0) {
      // Shuffle files in place
      // From: https://stackoverflow.com/a/6274381
      for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]];
      }
    }

    const workers = initializeWorkers(parallelCount);
    const testResult = await runTests(workers, files);

    // Early exit on test failure
    const hasFailure = testResult.find((it) => it.isFailed);
    if (hasFailure) {
      const exitCode = printTestResultsFromWorkers(testResult);
      process.exit(exitCode);
    }

    // Only keep results needed to print out a success response
    results.push(
      ...testResult.map((it) => ({
        isFailed: it.isFailed,
        assertions: it.assertions,
      })),
    );
  }

  // @ts-ignore
  const exitCode = printTestResultsFromWorkers(results);

  return {
    exitStatus: exitCode === 0 ? "passed" : "failed",
  };
}

/**
 * Run tests on a worker pull-basis.
 * Once all files are done or in process, we request results.
 *
 * @param {Worker[]} workers
 * @param {string[]} files
 */
async function runTests(workers, files) {
  const isDebugging = !!url();
  let idx = 0;
  const results = [];

  for (const worker of workers) {
    worker.on("exit", (exitValue) => {
      if (exitValue !== 0) {
        results.push({
          isFailed: true,
          failedResult: [
            `Compas unexpected test runner exit (0/1)
  Failure in either setup or teardown as specified in the config.
  Check the above logs to find out what went wrong.
  It may be easier to debug when running the tests with '--serial'.`,
          ],
          assertions: {
            passed: 0,
            failed: 1,
          },
        });

        // Set idx to file length, so the other workers will post their results.
        // Or in other words, a quick hack to terminate the workers.
        idx = files.length;
      }
    });

    worker.on("message", (message) => {
      if (message.type === "request_file") {
        if (idx === files.length) {
          // Already through our file list, request results
          worker.postMessage({ type: "request_result" });
        } else {
          const file = files[idx];
          idx++;

          worker.postMessage({ type: "provide_file", file, isDebugging });
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

  let resolve = undefined;
  let timeout = undefined;
  const deferredPromise = new Promise((r) => {
    resolve = r;
  });

  const checkResults = () => {
    clearTimeout(timeout);
    if (results.length === workers.length) {
      resolve();
      return;
    }

    timeout = setTimeout(() => {
      checkResults();
    }, 10);
  };

  checkResults();
  await deferredPromise;

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
 *
 * @param {number} workerCount
 * @returns {Worker[]}
 */
function initializeWorkers(workerCount) {
  const workers = [];

  for (let i = 0; i < workerCount; ++i) {
    // @ts-ignore
    const w = new Worker(workerFile, {});
    workers.push(w);
  }

  return workers;
}
