import { cliLoggerCreate } from "../cli/logger.js";
import { cliExecutor as initExecutor } from "../compas/commands/init.js";

/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode?: number }>}
 */
export async function initCommand(logger, command) {
  const flags = { dumpJSConfig: false };

  if (command.arguments[0] === "--jsconfig") {
    flags.dumpJSConfig = true;
  }

  const cliLogger = cliLoggerCreate("compas");
  const result = await initExecutor(cliLogger, {
    command: ["compas", "init"],
    // @ts-ignore
    cli: {},
    flags,
  });

  return {
    exitCode: result.exitStatus === "passed" ? 0 : 1,
  };
}
