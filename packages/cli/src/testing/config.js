import { existsSync } from "node:fs";
import inspector from "node:inspector";
import { cpus } from "node:os";
import { pathToFileURL } from "node:url";
import { isMainThread, threadId } from "node:worker_threads";
import {
  environment,
  isNil,
  loggerGetGlobalDestination,
  loggerSetGlobalDestination,
  newLogger,
  noop,
  pathJoin,
  refreshEnvironmentCache,
} from "@compas/stdlib";
import { setAreTestRunning, setTestLogger } from "./state.js";

const configPath = pathJoin(process.cwd(), "test/config.js");

/**
 * @typedef {object} TestConfig
 * @property {number} timeout Sub test timeout.
 * @property {boolean} bail Stop running tests when a failure / failed assertion is
 *   encountered
 * @property {boolean} isDebugging Disable hard test timeouts when the debugger is
 *   attached
 * @property {() => (Promise<void>|void)} setup Global process setup function
 * @property {() => (Promise<void>|void)} teardown Global process setup function
 * @property {boolean} withLogs Don't disable all info-logs
 * @property {number} randomizeRounds Randomizes the test file order after the first
 *   round
 * @property {number} parallelCount The number of test files to process in parallel
 * @property {string[]} ignoreDirectories Subdirectories to skip, when looking for all
 *   test files
 * @property {boolean} coverage Run the test while collecting coverage results.
 * @property {boolean} singleFileMode Should be set when only a single test should run
 *   via 'mainTestFn'
 */

/**
 * Load the test config & parse the flags
 *
 * @param {import("@compas/stdlib").Logger} [logger]
 * @param {Record<string, string|number|boolean>} [flags]
 * @returns {Promise<TestConfig>}
 */
export async function testingLoadConfig(logger, flags) {
  /** @type {TestConfig} */
  const resolvedConfig = {
    timeout: 2500,
    bail: false,
    isDebugging: !!inspector.url(),
    setup: noop,
    teardown: noop,
    withLogs: true,
    ignoreDirectories: [],
    parallelCount: 1,
    randomizeRounds: 1,
    coverage: false,
    singleFileMode: false,
  };

  // Apply env vars. This is done in the worker
  if (environment.__COMPAS_TEST_BAIL === "true") {
    resolvedConfig.bail = true;
  }
  if (environment.__COMPAS_TEST_WITH_LOGS === "false") {
    resolvedConfig.withLogs = false;
  }
  if (environment.__COMPAS_TEST_PARALLEL_COUNT) {
    resolvedConfig.parallelCount = Number(
      environment.__COMPAS_TEST_PARALLEL_COUNT,
    );
  }
  if (environment.__COMPAS_TEST_RANDOMIZE_ROUNDS) {
    resolvedConfig.randomizeRounds = Number(
      environment.__COMPAS_TEST_RANDOMIZE_ROUNDS,
    );
  }

  if (flags) {
    if (flags.bail) {
      // @ts-expect-error
      resolvedConfig.bail = flags.bail;
    }

    if (flags.coverage) {
      resolvedConfig.coverage = true;
    }

    if (!flags.withLogs) {
      resolvedConfig.withLogs = false;
    }

    if (!flags.serial) {
      resolvedConfig.parallelCount = Math.min(4, cpus().length - 1);
    }

    if (flags.parallelCount) {
      // @ts-expect-error
      resolvedConfig.parallelCount = flags.parallelCount;
    }

    if (flags.randomizeRounds) {
      // @ts-expect-error
      resolvedConfig.randomizeRounds = flags.randomizeRounds;
    }

    // Set env vars so they are read when a worker is starting up, at that point we don't
    // have flags

    environment.__COMPAS_TEST_BAIL = String(resolvedConfig.bail);
    process.env.__COMPAS_TEST_WITH_LOGS = String(resolvedConfig.withLogs);
    process.env.__COMPAS_TEST_PARALLEL_COUNT = String(
      resolvedConfig.parallelCount,
    );
    process.env.__COMPAS_TEST_RANDOMIZE_ROUNDS = String(
      resolvedConfig.randomizeRounds,
    );

    refreshEnvironmentCache();
  }

  if (existsSync(configPath)) {
    // @ts-ignore
    const config = await import(pathToFileURL(configPath));

    if (config.timeout) {
      if (typeof config.timeout !== "number") {
        throw new TypeError(
          `test/config.js#timeout should be a number. Found ${typeof config.timeout}`,
        );
      }

      resolvedConfig.timeout = config.timeout;
    }

    if (Array.isArray(config.ignoreDirectories)) {
      for (const dir of config.ignoreDirectories) {
        if (dir.startsWith("/")) {
          resolvedConfig.ignoreDirectories.push(dir);
        } else {
          resolvedConfig.ignoreDirectories.push(pathJoin(process.cwd(), dir));
        }
      }
    }

    resolvedConfig.setup = config.setup ?? noop;
    resolvedConfig.teardown = config.teardown ?? noop;
  }

  // Initialize environment
  setAreTestRunning(true);

  if (!isMainThread && isNil(logger)) {
    // Setup a logger with threadId, so logs of a single thread can be found.
    const formattedThreadId = String(threadId).padStart(
      String(resolvedConfig.parallelCount * resolvedConfig.randomizeRounds)
        .length,
      " ",
    );

    setTestLogger(
      newLogger({
        ctx: {
          type: `worker-thread(${formattedThreadId})`,
        },
      }),
    );
  } else if (!isNil(logger)) {
    setTestLogger(logger);
  }

  if (!resolvedConfig.withLogs) {
    // Filter out error logs of all created loggers both in dev & prod modes of running
    // the tests.
    const destination = loggerGetGlobalDestination();
    loggerSetGlobalDestination({
      write(msg) {
        if (msg.includes(` error[`) || msg.includes(`"level":"error"`)) {
          destination.write(msg);
        }
      },
    });
  }

  return resolvedConfig;
}
