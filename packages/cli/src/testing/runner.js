import { AssertionError, deepStrictEqual } from "assert";
import { isNil } from "@compas/stdlib";
import { setTestTimeout, state, testLogger, timeout } from "./state.js";

/**
 * @param {TestState} testState
 * @returns {Promise<void>}
 */
export async function runTestsRecursively(testState) {
  const runner = createRunnerForState(testState);

  if (!isNil(testState.callback)) {
    if (testState.parent === state) {
      testLogger.info(`Running: ${testState.name}`);
    }

    try {
      const result = testState.callback(runner);

      if (typeof result?.then === "function") {
        // Does a race so tests don't run for too long
        await Promise.race([
          result,
          new Promise((_, reject) => {
            setTimeout(
              () =>
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
                ),
              timeout,
            );
          }),
        ]);
      }
    } catch (e) {
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

  for (const child of testState.children) {
    await runTestsRecursively(child);
  }

  setTestTimeout(originalTimeout);
}

/**
 * Register top-level tests. The main entry point of the test runner
 *
 * @since 0.1.0
 * @function
 *
 * @param {string} name The test name
 * @param {TestCallback} callback The function that is executed by the test runner. This
 *    can do async setup, register child tests and run assertions
 * @returns {undefined}
 */
export const test = subTest.bind(undefined, state);

function createRunnerForState(testState) {
  return {
    log: testLogger,
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
 * @param {TestState} state
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
 * @param {TestState} state
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
 * @param {TestState} state
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
 * @param {TestState} state
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
 * @param {TestState} state
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
function deepEqual(state, actual, expected, message) {
  let passed = true;
  let meta = undefined;

  try {
    deepStrictEqual(actual, expected);
  } catch (e) {
    passed = false;
    meta = {
      actual,
      expected,
    };

    if (e.generatedMessage) {
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
 * @param {TestState} state
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
 * @param {TestState} state
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
 * @param {TestState} state
 * @param {string} name
 * @param {TestCallback} callback
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
