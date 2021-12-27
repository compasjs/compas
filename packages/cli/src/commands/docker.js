import { environment } from "@compas/stdlib";
import { cliExecutor as dockerExecutor } from "../cli/commands/docker.js";
import { cliLoggerCreate } from "../cli/logger.js";
import { dockerMigrateCommand } from "../migrate/index.js";

const SUB_COMMANDS = ["up", "down", "clean", "reset", "migrate"];

/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode?: number }|void>}
 */
export async function dockerCommand(logger, command) {
  let subCommand = command.arguments[0];
  if (SUB_COMMANDS.indexOf(subCommand) === -1) {
    logger.info(
      `Unknown command: 'compas docker ${
        subCommand ?? ""
      }'. Please use one of ${SUB_COMMANDS.join(", ")}`,
    );
    return { exitCode: 1 };
  }

  if (subCommand === "migrate") {
    return await dockerMigrateCommand(logger, command);
  }

  const flags = {
    postgresVersion: environment.POSTGRES_VERSION ?? "12",
  };

  if (subCommand === "reset") {
    flags.projects = [true];
    subCommand = "clean";
  }

  const cliLogger = cliLoggerCreate("compas");
  const dockerCommandResult = await dockerExecutor(cliLogger, {
    command: ["compas", "docker", subCommand],
    // @ts-ignore
    cli: {},
    flags,
  });

  return {
    exitCode: dockerCommandResult.exitStatus === "passed" ? 0 : 1,
  };
}
