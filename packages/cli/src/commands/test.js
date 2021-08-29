import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { executeCommand } from "../utils.js";

export const testFile = pathJoin(
  dirnameForModule(import.meta),
  "../../scripts/test.js",
);

/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {void | Promise<void | { exitCode: number; }>}
 */
export function testCommand(logger, command) {
  return executeCommand(
    logger,
    command.verbose,
    command.watch,
    "node",
    [...command.nodeArguments, testFile, ...command.execArguments],
    {},
  );
}
