import { inspect } from "util";
import { AppError, isNil } from "@compas/stdlib";
import { state, testLogger } from "./state.js";

/**
 * Prints test results and returns the exit code
 *
 * @returns {number}
 */
export function printTestResults() {
  markTestFailuresRecursively(state);

  const result = [];

  const { passed, failed } = sumAssertions(state);
  result.push("");
  result.push(`Total assertions: ${passed + failed}`);
  result.push(`          Passed: ${passed}`);
  result.push(`          Failed: ${failed}`);
  result.push(`-----------`);

  if (state.hasFailure) {
    for (const child of state.children) {
      printFailedResults(child, result, 0);
    }
  }

  if (state.hasFailure) {
    testLogger.error(result.join("\n"));
  } else {
    testLogger.info(result.join("\n"));
  }

  return state.hasFailure ? 1 : 0;
}

/**
 * Prints test results from workers and return the exit code
 *
 * @param {{
 *   isFailed: boolean,
 *   assertions: { passed: number, failed: number, },
 *   failedResult: string[]
 * }[]} testResults
 * @returns {number}
 */
export function printTestResultsFromWorkers(testResults) {
  const hasFailure = testResults.find((it) => it.isFailed);
  let passed = 0;
  let failed = 0;

  const result = [];

  for (const partial of testResults) {
    passed += partial.assertions.passed;
    failed += partial.assertions.failed;
  }

  result.push("");
  result.push(`Total assertions: ${passed + failed}`);
  result.push(`          Passed: ${passed}`);
  result.push(`          Failed: ${failed}`);
  result.push(`-----------`);

  if (hasFailure) {
    for (const partial of testResults) {
      result.push(...partial.failedResult);
    }
  }

  if (hasFailure) {
    testLogger.error(result.join("\n"));
  } else {
    testLogger.info(result.join("\n"));
  }

  return hasFailure ? 1 : 0;
}

/**
 * Prints a quick test summary for the provided state
 *
 * @param {import("./state").TestState} state
 * @param {string[]} result
 * @param {number} indentCount
 */
function printTreeSummary(state, result, indentCount) {
  const { passed, failed } = sumAssertions(state);

  if (passed === 0 && failed === 0) {
    // When we bailed, don't print skipped tests.
    // In normal scenario's this can't happen, since we enforce that each test has at least a subset or an assertion
    return;
  }

  const indent = `  `.repeat(indentCount);
  result.push(`${indent}${state.name} (${passed}/${passed + failed})`);
}

/**
 * Prints information over test failures
 *
 * @param {import("./state").TestState} state
 * @param {string[]} result
 * @param {number} indentCount
 */
export function printFailedResults(state, result, indentCount) {
  // Failed assertions directly from this state, without children
  const failedAssertions = state.assertions.filter((it) => !it.passed);

  printTreeSummary(state, result, indentCount);

  if (!state.hasFailure) {
    // No failures in this sub tree, so skip printing it's assertions, exceptions and
    // children
    return;
  }

  if (!state.caughtException) {
    // Some child has a failure, loop through the children
    for (const child of state.children) {
      printFailedResults(child, result, indentCount + 1);
    }
  }

  // Increase indent so error and assertion is nested in relation to the tree summary
  const indent = "  ".repeat(indentCount + 1);

  // Prioritize caught exceptions over assertions, as this may be more unexpected
  if (state.caughtException) {
    const exception = AppError.format(state.caughtException);

    if (AppError.instanceOf(state.caughtException)) {
      result.push(`${indent}AppError: ${exception.key} - ${exception.status}`);
    } else {
      result.push(`${indent}${exception.name} - ${exception.message}`);
    }

    // Pretty print info object
    const errorPretty = inspect(exception, {
      depth: null,
      colors: true,
    }).split("\n");

    // Add pretty printed error plus some indentation to the result
    for (const it of errorPretty) {
      result.push(`${indent}  ${it}`);
    }
  } else if (failedAssertions.length > 0) {
    for (const assertion of state.assertions) {
      if (assertion.passed) {
        result.push(`${indent}${assertion.type}: pass`);
        continue;
      }

      if (assertion.message) {
        result.push(`${indent}${assertion.type}: ${assertion.message}`);
      } else {
        result.push(`${indent}${assertion.type}: fail`);
      }

      if (!assertion.meta) {
        continue;
      }

      const subIndent = `${indent}  `;

      // @ts-ignore
      if (assertion.meta.message) {
        // Assertion may already have a message, for example in case of a deepEqual
        // @ts-ignore
        const parts = assertion.meta.message.split("\n");
        for (const part of parts) {
          result.push(`${subIndent}${part}`);
        }
      } else {
        // @ts-ignore
        const { expected, actual } = assertion.meta;
        // We print the `typeof` as well, so it's more clear that "5" !== 5
        result.push(
          `${subIndent}Actual: (${typeof actual}) ${JSON.stringify(actual)}`,
        );
        result.push(
          `${subIndent}Expected: (${typeof expected}) ${JSON.stringify(
            expected,
          )}`,
        );

        if (typeof expected === "object") {
          result.push(
            `${subIndent}Tip: Use 't.deepEqual' to compare object contents.`,
          );
        }
      }
    }
  }
}

/**
 * Recursively marks hasFailure if test has a caughtException or if an assertion did not
 * pass
 *
 * @param {import("./state").TestState} state
 */
export function markTestFailuresRecursively(state) {
  if (state.caughtException) {
    markFailure(state);
  }

  // Skips unnecessary looping
  if (!state.hasFailure) {
    for (const assertion of state.assertions) {
      if (!assertion.passed) {
        markFailure(state);
      }
    }
  }

  for (const child of state.children) {
    markTestFailuresRecursively(child);
  }
}

/**
 * Marks this state as hasFailure and recursively the parents as well
 *
 * @param {import("./state").TestState} state
 */
function markFailure(state) {
  state.hasFailure = true;

  if (!isNil(state.parent) && !state.parent.hasFailure) {
    markFailure(state.parent);
  }
}

/**
 * Returns a sum of all assertions recursively, ignoring caught exceptions.
 *
 * @param {import("./state").TestState} state
 * @returns {{ passed: number, failed: number }}
 */
export function sumAssertions(state) {
  let passed = 0;
  let failed = 0;

  for (const assertion of state.assertions) {
    if (assertion.passed) {
      passed++;
    } else {
      failed++;
    }
  }

  for (const child of state.children) {
    const childSum = sumAssertions(child);
    passed += childSum.passed;
    failed += childSum.failed;
  }

  return {
    passed,
    failed,
  };
}
