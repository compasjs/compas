import { AssertionError, deepStrictEqual } from "assert";
import { url } from "inspector";
import { isNil } from "@compas/stdlib";
import {
  enforceSingleAssertion,
  setTestTimeout,
  state,
  testLogger,
  timeout,
} from "./state.js";

/**
 * @param {import("./state").TestState} testState
 * @param {boolean} [isDebugging] If debugging, we should ignore the timeout
 * @returns {Promise<void>}
 */
export async function runTestsRecursively(testState, isDebugging = !!url()) {
  const abortController = new AbortController();
  const runner = createRunnerForState(testState, abortController.signal);

  if (!isNil(testState.callback)) {
    if (testState.parent === state) {
      testLogger.info(`Running: ${testState.name}`);
    }

    try {
      const result = testState.callback(runner);

      if (typeof result?.then === "function") {
        if (isDebugging) {
          const timeoutReminder = setTimeout(() => {
            testLogger.info(
              `Ignoring timeout for '${testState.name}', detected an active inspector.`,
            );
          }, timeout);

          await result;
          clearTimeout(timeoutReminder);
        } else {
          // Does a race so tests don't run for too long
          await Promise.race([
            result,
            new Promise((_, reject) => {
              setTimeout(() => {
                abortController.abort();
                reject(
                  new Error(
                    `Exceeded test timeout of ${
                      timeout / 1000
                    } seconds. You can increase the timeout by calling 't.timeout = ${
                      timeout + 1000
                    };' on the parent test function. Or by setting 'export const timeout = ${
                      timeout + 1000
                    };' in 'test/config.js'.`,
                  ),
                );
              }, timeout);
            }),
          ]);
        }
      }
    } catch (/** @type {any} */ e) {
      if (e instanceof AssertionError) {
        // Convert to an assertion
        testState.assertions.push({
          type: e.operator,
          message: e.generatedMessage ? undefined : e.message,
          passed: false,
          meta: {
            actual: e.actual,
            expected: e.expected,
            message: e.generatedMessage ? e.message : undefined,
          },
        });
      } else {
        testState.caughtException = e;
      }
    }
  }

  const originalTimeout = timeout;
  setTestTimeout(runner.timeout ?? timeout);
  mutateRunnerEnablingWarnings(runner);

  if (
    enforceSingleAssertion &&
    testState.children.length === 0 &&
    testState.assertions.length === 0 &&
    isNil(testState.caughtException)
  ) {
    // Only enforce an assertion when no child tests are registered, and when the
    // current test didn't exit with a 'caughtException'.
    testState.caughtException = new Error(
      `Test did not execute any assertions. This is enforced via the 'enforceSingleAssertion' value in 'test/config.js'.`,
    );
    delete testState.caughtException.stack;
  }

  for (const child of testState.children) {
    await runTestsRecursively(child, isDebugging);
  }

  setTestTimeout(originalTimeout);
}

/**
 * Register top-level tests. The main entry point of the test runner
 *
 * @since 0.1.0
 *
 * @type {(name: string, callback: import("./state").TestCallback) => void}
 */
export const test = subTest.bind(undefined, state);

function createRunnerForState(testState, abortSignal) {
  return {
    log: testLogger,
    signal: abortSignal,
    ok: ok.bind(undefined, testState),
    notOk: notOk.bind(undefined, testState),
    equal: equal.bind(undefined, testState),
    notEqual: notEqual.bind(undefined, testState),
    deepEqual: deepEqual.bind(undefined, testState),
    fail: fail.bind(undefined, testState),
    pass: pass.bind(undefined, testState),
    test: subTest.bind(undefined, testState),
  };
}

/**
 * Wrap runner functions and log a warning before calling the implementation.
 * This is mostly to 'lint' writing tests, and improves detecting which assertion fails
 * instead of it being 'logged' on the 'parent'.
 */
function mutateRunnerEnablingWarnings(runner) {
  const methods = [
    "ok",
    "notOk",
    "equal",
    "notEqual",
    "deepEqual",
    "fail",
    "pass",
    "test",
  ];

  for (const method of methods) {
    const implementation = runner[method];

    runner[method] = (...args) => {
      runner.log.error(
        `warning: called 't.${method}' on parent 't'. Accept 't' as argument in the callback of 't.test(msg, callback)'.`,
      );

      implementation(...args);
    };
  }
}

/**
 * @param {import("./state").TestState} state
 * @param {*} value
 * @param {string} [message]
 */
function ok(state, value, message) {
  const passed = !!value;

  state.assertions.push({
    type: "ok",
    passed,
    meta: {
      actual: passed,
      expected: true,
    },
    message,
  });
}

/**
 * @param {import("./state").TestState} state
 * @param {*} value
 * @param {string} [message]
 */
function notOk(state, value, message) {
  const passed = !value;

  state.assertions.push({
    type: "notOk",
    passed,
    meta: {
      actual: passed,
      expected: false,
    },
    message,
  });
}

/**
 * @param {import("./state").TestState} state
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
function equal(state, actual, expected, message) {
  const passed = actual === expected;

  state.assertions.push({
    type: "equal",
    passed,
    meta: {
      actual,
      expected,
    },
    message,
  });
}

/**
 * @param {import("./state").TestState} state
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
function notEqual(state, actual, expected, message) {
  const passed = actual !== expected;

  state.assertions.push({
    type: "notEqual",
    passed,
    meta: {
      actual,
      expected,
    },
    message,
  });
}

/**
 * @param {import("./state").TestState} state
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
function deepEqual(state, actual, expected, message) {
  let passed = true;
  let meta = undefined;

  try {
    deepStrictEqual(actual, expected);
  } catch (/** @type {any} */ e) {
    passed = false;
    meta = {
      actual,
      expected,
    };

    if (e.generatedMessage) {
      // @ts-ignore
      meta.message = e.message;
    }
  }

  state.assertions.push({
    type: "deepEqual",
    passed,
    meta,
    message,
  });
}

/**
 * @param {import("./state").TestState} state
 * @param {string} [message]
 */
function fail(state, message) {
  const passed = false;

  state.assertions.push({
    type: "fail",
    passed,
    meta: undefined,
    message,
  });
}

/**
 * @param {import("./state").TestState} state
 * @param {string} [message]
 */
function pass(state, message) {
  const passed = true;

  state.assertions.push({
    type: "pass",
    passed,
    meta: undefined,
    message,
  });
}

/**
 * @param {import("./state").TestState} state
 * @param {string} name
 * @param {import("./state").TestCallback} callback
 */
function subTest(state, name, callback) {
  if (typeof name !== "string" || typeof callback !== "function") {
    throw new TypeError(
      `Expected t.test(string, function) received t.test(${typeof name}, ${typeof callback})`,
    );
  }

  const testState = {
    parent: state,
    hasFailure: false,
    name,
    callback,
    assertions: [],
    children: [],
  };

  state.children.push(testState);
}
