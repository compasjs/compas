import { inspect } from "node:util";
import { AppError, isNil } from "@compas/stdlib";
import { benchLogger, state } from "./state.js";

export function printBenchResults() {
  const total = state.length;
  let success = 0;

  for (const bench of state) {
    if (!bench.caughtException) {
      success += 1;
    }
  }

  const result = [];

  result.push("");
  result.push(`Total benchmarks: ${total}`);
  result.push(`          Passed: ${success}`);
  result.push(`          Failed: ${total - success}`);
  result.push(`-----------`);

  printSuccessResults(
    result,
    state.filter((it) => isNil(it.caughtException)),
  );
  printErrorResults(
    result,
    state.filter((it) => !isNil(it.caughtException)),
  );

  let hasFlakyResults = false;
  for (const stateItem of state) {
    // The run should have been done with at least 6 different `N` values. Most of the
    // time V8 has reached a stable optimization point at the 4th run.
    if (stateItem.executionTimesNs.length >= 6) {
      const [thirdLast, secondLast, last] = stateItem.executionTimesNs.slice(
        stateItem.executionTimesNs.length - 3,
      );

      const lowest = Math.min(last, secondLast, thirdLast);
      const highest = Math.max(last, secondLast, thirdLast);
      const percentage = (lowest / highest) * 100;

      // Allow 7% diff between the results
      if (percentage < 93) {
        if (!hasFlakyResults) {
          result.push(`-----------`);
          result.push(`Potential invalid result:`);
          hasFlakyResults = true;
        }

        result.push(
          `${stateItem.name}: ${(100 - percentage).toFixed(
            2,
          )}% (${lowest.toFixed(2)}ns..${highest.toFixed(2)}ns)`,
        );
      }
    }
  }

  let exitCode = 0;
  let logFn = benchLogger.info;

  if (total !== success) {
    exitCode = 1;
    logFn = benchLogger.error;
  }

  logFn(result.join("\n"));

  return exitCode;
}

/**
 * @param {string[]} result
 * @param {import("./state.js").BenchState[]} state
 */
function printSuccessResults(result, state) {
  if (state.length === 0) {
    return;
  }

  let longestName = 0;
  let longestOperationTimeBeforeDot = 0;

  for (const bench of state) {
    if (bench.name.length > longestName) {
      longestName = bench.name.length;
    }

    // We also line out on the '.'
    // This results in easier to interpret results
    const operationTimeSplit = bench.operationTimeNs.split(".");
    // @ts-ignore
    bench.operationTimeBeforeDot = operationTimeSplit[0];

    // @ts-ignore
    if (bench.operationTimeBeforeDot.length > longestOperationTimeBeforeDot) {
      // @ts-ignore
      longestOperationTimeBeforeDot = bench.operationTimeBeforeDot.length;
    }
  }

  for (const bench of state) {
    // @ts-ignore
    const formatted = bench.operationTimeBeforeDot.padStart(
      longestOperationTimeBeforeDot,
      " ",
    );

    result.push(
      `${bench.name.padEnd(longestName, " ")}   ${String(bench.N).padStart(
        10,
        " ",
      )}  iterations   ${formatted}  ns/op`,
    );
  }
}

/**
 * @param {string[]} result
 * @param {import("./state.js").BenchState[]} state
 */
function printErrorResults(result, state) {
  if (state.length === 0) {
    return;
  }

  for (const bench of state) {
    result.push(bench.name);

    const indent = "  ";
    const exception = AppError.format(bench.caughtException);

    if (AppError.instanceOf(bench.caughtException)) {
      result.push(`${indent}AppError: ${exception.key} - ${exception.status}`);
    } else {
      result.push(`${indent}${exception.name} - ${exception.message}`);
    }

    // Pretty print info object
    const errorPretty = inspect(exception, {
      depth: null,
      colors: true,
    }).split("\n");

    for (const it of errorPretty) {
      result.push(`${indent}  ${it}`);
    }
  }
}
