import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { executeCommand } from "../utils.js";

export const benchFile = pathJoin(
  dirnameForModule(import.meta),
  "../../scripts/bench.js",
);

/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {Promise<{ exitCode: number}|void>|void}
 */
export function benchCommand(logger, command) {
  return executeCommand(
    logger,
    command.verbose,
    command.watch,
    "node",
    [...command.nodeArguments, benchFile, ...command.execArguments],
    {},
  );
}
