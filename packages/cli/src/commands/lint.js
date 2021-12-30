import { cliLoggerCreate } from "../cli/logger.js";
import { cliExecutor as lintExecutor } from "../compas/commands/lint.js";

/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {Promise<void | { exitCode: number; }>}
 */
export async function lintCommand(logger, command) {
  const jsdocEnabled = command.execArguments.includes("--jsdoc");

  const cliLogger = cliLoggerCreate("compas");
  const result = await lintExecutor(cliLogger, {
    command: ["compas", "lint"],
    flags: {
      jsdoc: jsdocEnabled,
    },

    // @ts-ignore
    cli: {},
  });

  return {
    exitCode: result.exitStatus === "passed" ? 0 : 1,
  };
}
