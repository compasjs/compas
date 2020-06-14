import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { executeCommand } from "../utils.js";

const lintFile = pathJoin(
  dirnameForModule(import.meta),
  "../../scripts/lint.js",
);

/**
 * @param {Logger} logger
 * @param {ExecCommand} command
 * @returns {Promise<void>}
 */
export function lintCommand(logger, command) {
  return executeCommand(logger, command.verbose, command.watch, "node", [
    ...command.nodeArguments,
    lintFile,
  ]);
}
