import { AppError, isNil } from "@lbu/stdlib";
import { state, testLogger } from "./state.js";

/**
 * Prints test results and returns the exit code
 * Returns the exit code
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
      if (!child.hasFailure) {
        printSuccessResults(child, result, 0);
      } else {
        printFailedResults(child, result, 0);
      }
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
 * Prints a quick test summary for the provided state
 * @param {TestState} state
 * @param {string[]} result
 * @param {number} indentCount
 */
function printSuccessResults(state, result, indentCount) {
  const { passed } = sumAssertions(state);
  const indent = `  `.repeat(indentCount);
  result.push(`${indent}${state.name} (${passed}/${passed})`);
}

/**
 * Prints information over test failures
 * @param {TestState} state
 * @param {string[]} result
 * @param {number} indentCount
 */
function printFailedResults(state, result, indentCount) {
  const { passed, failed } = sumAssertions(state);
  const failedAssertions = state.assertions.filter((it) => !it.passed);

  if (state.caughtException || failedAssertions.length > 0) {
    let indent = "  ".repeat(indentCount);
    result.push(`${indent}${state.name} (${passed}/${passed + failed})`);

    // Increase indent so error info is nested in relation to test name
    indent += "  ";

    if (state.caughtException) {
      const stack = state.caughtException.stack
        .split("\n")
        .map((it, idx) => indent + (idx !== 0 ? "  " : "") + it.trim());

      if (AppError.instanceOf(state.caughtException)) {
        result.push(
          `${indent}AppError: ${state.caughtException.key} - ${state.caughtException.status}`,
        );
      } else {
        result.push(
          `${indent}${state.caughtException.name} - ${state.caughtException.message}`,
        );
      }

      for (const item of stack) {
        result.push(item);
      }
    } else {
      for (const assertion of failedAssertions) {
        if (assertion.message) {
          result.push(`${indent}${assertion.type}: ${assertion.message}`);
        } else {
          result.push(`${indent}${assertion.type}`);
        }

        if (assertion.meta) {
          const subIndent = `${indent}  `;
          if (assertion.meta.message) {
            const parts = assertion.meta.message.split("\n");
            for (const part of parts) {
              result.push(`${subIndent}${part}`);
            }
          } else {
            const { expected, actual } = assertion.meta;
            result.push(
              `${subIndent}Expected: (${typeof expected}) ${expected}`,
            );
            result.push(`${subIndent}Actual: (${typeof actual}) ${actual}`);
          }
        }
      }
    }
    for (const child of state.children) {
      printFailedResults(child, result, indentCount + 2);
    }
  } else {
    printSuccessResults(state, result, indentCount);
    for (const child of state.children) {
      printFailedResults(child, result, indentCount + 1);
    }
  }
}

/**
 * Recursively marks hasFailure if test has a caughtException or if an assertion did not
 * pass
 * @param {TestState} state
 */
function markTestFailuresRecursively(state) {
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
 * @param {TestState} state
 */
function markFailure(state) {
  state.hasFailure = true;

  if (!isNil(state.parent) && !state.parent.hasFailure) {
    markFailure(state.parent);
  }
}

/**
 * @param {TestState} state
 * @returns {{ passed: number, failed: number }}
 */
function sumAssertions(state) {
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
