import { cliLoggerCreate } from "../cli/logger.js";
import { cliExecutor as runExecutor } from "../compas/commands/run.js";

/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {Promise<void | { exitCode: number; }>}
 */
export async function runCommand(logger, command) {
  const cliLogger = cliLoggerCreate("compas");
  const result = await runExecutor(cliLogger, {
    // @ts-ignore
    command: ["compas", "run", command.script],
    flags: {
      verbose: command.verbose,
      watch: command.watch,

      // @ts-ignore
      nodeArguments:
        command.nodeArguments.length > 0
          ? command.nodeArguments.join(" ")
          : undefined,

      // @ts-ignore
      scriptArguments:
        command.execArguments.length > 0
          ? command.execArguments.join(" ")
          : undefined,
    },

    // @ts-ignore
    cli: {},
  });

  if (result?.exitStatus && result.exitStatus !== "keepAlive") {
    return {
      exitCode: result.exitStatus === "passed" ? 0 : 1,
    };
  }
}
