import { cliExecutor as proxyExecutor } from "../cli/commands/proxy.js";
import { cliLoggerCreate } from "../cli/logger.js";

/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {{exitCode?: number}|undefined}
 */
export function proxyCommand(logger, command) {
  const verbose = command.arguments.indexOf("--verbose") !== -1;

  const cliLogger = cliLoggerCreate("compas");
  const result = proxyExecutor(cliLogger, {
    command: ["compas", "proxy"],
    flags: {
      verbose,
    },

    // @ts-ignore
    cli: {},
  });

  if (result.exitStatus !== "keepAlive") {
    return {
      exitCode: result.exitStatus === "passed" ? 0 : 1,
    };
  }
}
