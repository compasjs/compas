import { dirnameForModule } from "@lbu/stdlib";
import { join } from "path";
import { executeCommand } from "../utils.js";

const lintFile = join(dirnameForModule(import.meta), "../../scripts/lint.js");

/**
 * @param {Logger} logger
 * @param {ExecCommand} command
 * @return {Promise<void>}
 */

export function lintCommand(logger, command) {
  return executeCommand(logger, command.verbose, command.watch, "node", [
    lintFile,
    ...command.nodeArguments,
  ]);
}
