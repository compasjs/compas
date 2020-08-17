import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { executeCommand } from "../utils.js";

export const benchFile = pathJoin(
  dirnameForModule(import.meta),
  "../../scripts/bench.js",
);

/**
 * @param {Logger} logger
 * @param {ExecCommand} command
 * @returns {Promise<void>}
 */
export function benchCommand(logger, command) {
  return executeCommand(
    logger,
    command.verbose,
    command.watch,
    "node",
    [...command.nodeArguments, benchFile],
    {},
  );
}
