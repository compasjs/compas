import { AssertionError, deepStrictEqual } from "node:assert";
import { AppError, isNil, newLogger } from "@compas/stdlib";
import { markTestFailuresRecursively } from "./printer.js";
import { state, testLogger } from "./state.js";

/**
 * Run the tests recursively.
 *
 * When the debugger is attached, we ignore any timeouts.
 *
 * @param {import("./config.js").TestConfig} testConfig
 * @param {import("./state.js").TestState} testState
 * @param {Partial<Pick<import("./config.js").TestConfig, "timeout">>} [configOverrides]
 * @returns {Promise<void>}
 */
export async function runTestsRecursively(
  testConfig,
  testState,
  configOverrides,
) {
  const abortController = new AbortController();
  const runner = createRunnerForState(testState, abortController.signal);

  const resolvedTimeout = configOverrides?.timeout ?? testConfig.timeout;

  if (!isNil(testState.callback)) {
    if (testState.parent === state) {
      testLogger.info(`Running: ${testState.name}`);
    }

    try {
      const result = testState.callback(runner);

      if (typeof result?.then === "function") {
        if (testConfig.isDebugging) {
          const timeoutReminder = setTimeout(() => {
            testLogger.info(
              `Ignoring timeout for '${testState.name}', detected an active inspector.`,
            );
          }, resolvedTimeout);

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
                      resolvedTimeout / 1000
                    } seconds. You can increase the timeout by calling 't.timeout = ${
                      resolvedTimeout + 1000
                    };' on the parent test function. Or by setting 'export const timeout = ${
                      resolvedTimeout + 1000
                    };' in 'test/config.js'.`,
                  ),
                );
              }, resolvedTimeout);
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

  const subTestOverrides = {
    timeout: runner.timeout ?? configOverrides?.timeout,
  };

  if (typeof runner.jobs !== "number" || runner.jobs === 0) {
    // Remove invalid jobs config
    delete runner.jobs;
  }

  mutateRunnerEnablingWarnings(runner);

  if (
    testState.children.length === 0 &&
    testState.assertions.length === 0 &&
    isNil(testState.caughtException)
  ) {
    // Only enforce an assertion when no child tests are registered, and when the
    // current test didn't exit with a 'caughtException'.
    testState.caughtException = new Error(
      `Test did not execute any assertions. It should do at least a single assertion like 't.pass()' or register a subtest via 't.test()'.`,
    );
    delete testState.caughtException.stack;
  }

  if (testConfig.bail) {
    markTestFailuresRecursively(state);
    if (state.hasFailure) {
      return;
    }
  }

  const children = [...testState.children];
  while (children.length) {
    const partial = children.splice(0, runner.jobs ?? 1);

    await Promise.all(
      partial.map((it) =>
        runTestsRecursively(testConfig, it, subTestOverrides),
      ),
    );

    if (testConfig.bail) {
      markTestFailuresRecursively(testState);
      if (testState.hasFailure) {
        return;
      }
    }
  }
}

/**
 * Register top-level tests. The main entry point of the test runner
 *
 * @since 0.1.0
 *
 * @type {(name: string, callback: import("./state.js").TestCallback) => void}
 */
export const test = subTest.bind(undefined, state);

function createRunnerForState(testState, abortSignal) {
  return {
    log: newLogger({
      ctx: {
        name: testState.name,
      },
    }),
    signal: abortSignal,
    name: testState.name,
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
      runner.log.error({
        message: `warning: called 't.${method}' on parent 't'. Accept 't' as argument in the callback of 't.test(msg, callback)'.`,
        stackTrace: AppError.format(AppError.serverError({})),
      });

      implementation(...args);
    };
  }
}

/**
 * @param {import("./state.js").TestState} state
 * @param {*} value
 * @param {string} [message]
 */
function ok(state, value, message) {
  const passed = !!value;

  state.assertions.push({
    type: "ok",
    passed,
    meta: {
      actual: value,
      expected: true,
    },
    message,
  });
}

/**
 * @param {import("./state.js").TestState} state
 * @param {*} value
 * @param {string} [message]
 */
function notOk(state, value, message) {
  const passed = !value;

  state.assertions.push({
    type: "notOk",
    passed,
    meta: {
      actual: value,
      expected: false,
    },
    message,
  });
}

/**
 * @param {import("./state.js").TestState} state
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
 * @param {import("./state.js").TestState} state
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
 * @param {import("./state.js").TestState} state
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
 * @param {import("./state.js").TestState} state
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
 * @param {import("./state.js").TestState} state
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
 * @param {import("./state.js").TestState} state
 * @param {string} name
 * @param {import("./state.js").TestCallback} callback
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
