import { cliExecutor as initExecutor } from "../cli/commands/init.js";
import { cliLoggerCreate } from "../cli/logger.js";

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

  const cliLogger = cliLoggerCreate("compas", false);
  const result = await initExecutor(cliLogger, {
    command: ["compas init"],
    cli: {},
    flags,
  });

  if (result.error) {
    throw result.error;
  }
  return result.value;
}
