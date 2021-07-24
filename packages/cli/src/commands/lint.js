import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { executeCommand } from "../utils.js";

const lintFile = pathJoin(
  dirnameForModule(import.meta),
  "../../scripts/lint.js",
);

/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {void | Promise<void | { exitCode: number; }>}
 */
export function lintCommand(logger, command) {
  return executeCommand(
    logger,
    command.verbose,
    command.watch,
    "node",
    [...command.nodeArguments, lintFile, ...command.execArguments],
    {},
  );
}
