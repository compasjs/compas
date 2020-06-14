import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { executeCommand } from "../utils.js";
import { testFile } from "./test.js";

const c8Path = pathJoin(
  dirnameForModule(import.meta),
  "../../node_modules/.bin/c8",
);

/**
 * @param {Logger} logger
 * @param {ExecCommand} command
 * @returns {Promise<void>}
 */
export function coverageCommand(logger, command) {
  return executeCommand(logger, command.verbose, command.watch, c8Path, [
    ...command.toolArguments,
    "node",
    ...command.nodeArguments,
    testFile,
  ]);
}
