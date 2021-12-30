import { isNil } from "@compas/stdlib";
import { cliLoggerCreate } from "../cli/logger.js";
import { cliExecutor as migrateExecutor } from "../compas/commands/migrate.js";

/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode?: number }|void>}
 */
export async function dockerMigrateCommand(logger, command) {
  // First arg was `migrate`
  const shouldRebuild = command.arguments.includes("rebuild");
  const shouldPrintInfo = command.arguments.includes("info");
  const shouldKeepAlive =
    command.arguments.includes("--keep-alive") ||
    command.arguments.includes("--keep-alive-without-lock");
  const shouldKeepLock =
    shouldKeepAlive && !command.arguments.includes("--keep-alive-without-lock");
  const shouldLoadConnectionSettings = command.arguments.includes(
    "--connection-settings",
  );

  if (
    !isNil(command.arguments[1]) &&
    !shouldRebuild &&
    !shouldPrintInfo &&
    !shouldKeepAlive &&
    !shouldLoadConnectionSettings
  ) {
    logger.error(
      `Unknown argument '${command.arguments[1]}'. Expected one of 'rebuild', 'check', '--connection-settings', '--keep-alive' or '--keep-alive-without-lock'.`,
    );
    return { exitCode: 1 };
  }

  if (shouldLoadConnectionSettings) {
    const value = command.arguments.at(
      command.arguments.indexOf("--connection-settings") + 1,
    );

    if (typeof value !== "string") {
      logger.error(
        "Could not load the file as specified by '--connection-settings ./path/to/file.js'.",
      );

      return {
        exitCode: 1,
      };
    }
  }

  const cliLogger = cliLoggerCreate("compas");
  const migrateResult = await migrateExecutor(cliLogger, {
    command: [
      "compas",
      "migrate",
      ...(shouldRebuild ? ["rebuild"] : shouldPrintInfo ? ["info"] : []),
    ],
    // @ts-ignore,
    cli: {},
    flags: {
      keepAlive: shouldKeepAlive,
      withoutLock: !shouldKeepLock,
      ...(shouldLoadConnectionSettings
        ? {
            connectionSettings: command.arguments.at(
              command.arguments.indexOf("--connection-settings") + 1,
            ),
          }
        : {}),
    },
  });

  if (migrateResult.exitStatus === "passed") {
    return {
      exitCode: 0,
    };
  }
  if (migrateResult.exitStatus === "failed") {
    return {
      exitCode: 1,
    };
  }
}
