import { pathToFileURL } from "url";
import { AppError, processDirectoryRecursive } from "@compas/stdlib";
import { printBenchResults } from "../../benchmarking/printer.js";
import { runBenchmarks } from "../../benchmarking/runner.js";
import {
  areBenchRunning,
  setAreBenchRunning,
  setBenchLogger,
  state,
} from "../../benchmarking/state.js";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "bench",
  shortDescription: "Run all '.bench.js' files in this project.",
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger) {
  await processDirectoryRecursive(process.cwd(), async (file) => {
    if (!file.endsWith(".bench.js")) {
      return;
    }

    try {
      // @ts-ignore
      await import(pathToFileURL(file));
    } catch (/** @type {any} */ e) {
      throw AppError.serverError(
        {
          file,
        },
        e,
      );
    }
  });

  if (areBenchRunning) {
    return {
      exitStatus: "keepAlive",
    };
  }

  setBenchLogger(logger);
  setAreBenchRunning(true);

  // Used when `mainBenchFn` is called the first thing of the process,
  // which results in no benchmarks registered yet
  await new Promise((r) => {
    setTimeout(r, 2);
  });

  await runBenchmarks(state);

  const exitCode = printBenchResults();

  return {
    exitStatus: exitCode === 0 ? "passed" : "failed",
  };
}
