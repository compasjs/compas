import { isNil } from "@compas/stdlib";
import { cliLoggerCreate } from "../cli/logger.js";
import { cliExecutor as codeModExecutor } from "../compas/commands/code-mod.js";

const SUB_COMMANDS = ["list", "exec"];

/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode: number }|void>}
 */
export async function codeModCommand(logger, command) {
  const verboseIdx = command.arguments.indexOf("--verbose");

  const verbose = verboseIdx !== -1;

  const subCommand =
    verboseIdx === 0 ? command.arguments[1] : command.arguments[0];

  if (!SUB_COMMANDS.includes(subCommand)) {
    logger.error(
      `Unknown command: 'compas code-mod ${
        subCommand ?? ""
      }'. Please use one of ${SUB_COMMANDS.join(", ")}`,
    );
    return { exitCode: 1 };
  }

  if (subCommand === "list") {
    const cliLogger = cliLoggerCreate("compas");
    const result = await codeModExecutor(cliLogger, {
      command: ["compas", "code-mod", "list"],
      flags: {
        verbose,
      },

      // @ts-ignore
      cli: {},
    });

    return {
      exitCode: result.exitStatus === "passed" ? 0 : 1,
    };
  }

  // subCommand == 'exec'
  const codeModName = command.arguments[command.arguments.indexOf("exec") + 1];

  if (isNil(codeModName)) {
    logger.error(
      `Missing code-mod name to execute. To see a list of available code-mods use 'yarn compas code-mod list'. To execute a code-mod use 'yarn compas code-mod exec $name'.`,
    );
    return { exitCode: 1 };
  }

  const cliLogger = cliLoggerCreate("compas");
  const result = await codeModExecutor(cliLogger, {
    command: ["compas", "code-mod", "exec"],
    flags: {
      verbose,
      codeModName,
    },

    // @ts-ignore
    cli: {},
  });

  return {
    exitCode: result.exitStatus === "passed" ? 0 : 1,
  };
}
