import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { executeCommand } from "../utils.js";

export const testFile = pathJoin(
  dirnameForModule(import.meta),
  "../../scripts/test.js",
);

/**
 * @param {Logger} logger
 * @param {ExecCommand} command
 * @returns {Promise<void>}
 */
export function testCommand(logger, command) {
  return executeCommand(logger, command.verbose, command.watch, "node", [
    testFile,
    ...command.nodeArguments,
  ]);
}
