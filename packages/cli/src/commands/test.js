import { dirnameForModule } from "@lbu/stdlib";
import { join } from "path";
import { executeCommand } from "../utils.js";

const testFile = join(dirnameForModule(import.meta), "../../scripts/test.js");

/**
 * @param {Logger} logger
 * @param {ExecCommand} command
 * @return {Promise<void>}
 */
export function testCommand(logger, command) {
  return executeCommand(logger, command.verbose, command.watch, "node", [
    testFile,
    ...command.nodeArguments,
  ]);
}
