import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { executeCommand } from "../utils.js";
import { testFile } from "./test.js";

const c8Path = pathJoin(
  dirnameForModule(import.meta),
  "../../node_modules/.bin/c8",
);

/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {Promise<{ exitCode: number }|void>|void}
 */
export function coverageCommand(logger, command) {
  const c8Args = [];
  const testArgs = [];

  let wasParallelCount = false;
  for (const arg of command.execArguments) {
    // Hardcode on known test arguments
    if (arg === "--serial" || arg === "--parallel-count" || wasParallelCount) {
      testArgs.push(arg);
      wasParallelCount = arg === "--parallel-count";
    } else {
      wasParallelCount = false;
      c8Args.push(arg);
    }
  }

  return executeCommand(
    logger,
    command.verbose,
    command.watch,
    c8Path,
    [...c8Args, "node", ...command.nodeArguments, testFile, ...testArgs],
    {},
  );
}
