import { writeFileSync } from "fs";
import { inspect } from "util";
import { AppError, environment, isNil, pathJoin } from "@lbu/stdlib";
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

  let exitCode = 0;
  let logFn = benchLogger.info;

  if (total !== success) {
    exitCode = 1;
    logFn = benchLogger.error;
  }

  logFn(result.join("\n"));

  if (environment.CI === "true") {
    // Write output to a file so it can be used in other actions
    // Add some point we may want to do some pretty printing to format as a table or
    // something
    writeFileSync(
      pathJoin(process.cwd(), "benchmark_output.txt"),
      result.join("\n").trim(),
      "utf8",
    );
  }

  return exitCode;
}

/**
 * @param {string[]} result
 * @param {BenchState[]} state
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
    bench.operationTimeBeforeDot = operationTimeSplit[0];

    if (bench.operationTimeBeforeDot.length > longestOperationTimeBeforeDot) {
      longestOperationTimeBeforeDot = bench.operationTimeBeforeDot.length;
    }
  }

  for (const bench of state) {
    result.push(
      `${bench.name.padEnd(longestName, " ")}   ${String(bench.N).padStart(
        10,
        " ",
      )}  iterations   ${bench.operationTimeBeforeDot.padStart(
        longestOperationTimeBeforeDot,
        " ",
      )}  ns/op`,
    );
  }
}

/**
 * @param {string[]} result
 * @param {BenchState[]} state
 */
function printErrorResults(result, state) {
  if (state.length === 0) {
    return;
  }

  for (const bench of state) {
    result.push(bench.name);

    const indent = "  ";
    const exception = AppError.format(bench.caughtException);

    const stack = exception.stack.map((it) => `${indent}  ${it.trim()}`);

    if (AppError.instanceOf(bench.caughtException)) {
      result.push(`${indent}AppError: ${exception.key} - ${exception.status}`);

      // Pretty print info object
      const infoObject = inspect(exception.info, {
        depth: null,
        colors: true,
      }).split("\n");

      for (const it of infoObject) {
        result.push(`${indent}  ${it}`);
      }
    } else {
      result.push(
        `${indent}${bench.caughtException.name} - ${bench.caughtException.message}`,
      );
    }

    for (const item of stack) {
      result.push(item);
    }
  }
}
