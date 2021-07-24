import { writeFileSync } from "fs";
import { inspect } from "util";
import { AppError, environment, isNil, pathJoin } from "@compas/stdlib";
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
 * @param {import("./state").BenchState[]} state
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
 * @param {import("./state").BenchState[]} state
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
