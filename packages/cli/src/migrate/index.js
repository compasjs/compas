import { existsSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { isNil, isPlainObject } from "@compas/stdlib";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @returns {Promise<{ exitCode?: number }>}
 */
export async function dockerMigrateCommand(logger, command) {
  const { exitCode } = await checkStoreImport(logger);
  if (exitCode !== 0) {
    return { exitCode };
  }

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

  const { newPostgresConnection, newMigrateContext } = await import(
    "@compas/store"
  );

  let sqlOptions = {
    max: 1,
    createIfNotExists: true,
  };

  if (shouldLoadConnectionSettings) {
    const filePath =
      command.arguments[command.arguments.indexOf("--connection-settings") + 1];

    const errorMessage = `Could not load the file as specified by '--connection-settings ./path/to/file.js'.`;

    if (isNil(filePath)) {
      logger.error(errorMessage);
      return {
        exitCode: 1,
      };
    }

    const fullPath = path.resolve(filePath);

    if (!existsSync(fullPath)) {
      logger.error(errorMessage);
      return {
        exitCode: 1,
      };
    }

    const { postgresConnectionSettings } = await import(
      pathToFileURL(fullPath)
    );
    if (isPlainObject(postgresConnectionSettings)) {
      sqlOptions = postgresConnectionSettings;
    }
  }

  let sql = await newPostgresConnection(sqlOptions);
  const mc = await newMigrateContext(sql);

  // Always print current state;
  logger.info({
    message: "Current migrate state",
    ...mc.info(),
  });

  if (shouldRebuild) {
    logger.info({
      message: "Rebuilding migration state",
    });
    await mc.rebuild();
    logger.info({
      message: "Done rebuilding migration state",
    });
    return { exitCode: 0 };
  }

  if (shouldPrintInfo) {
    return { exitCode: 0 };
  }

  logger.info({
    message: "Start migrating",
  });
  await mc.do();
  logger.info({
    message: "Done migrating",
  });

  if (!shouldKeepAlive) {
    await sql.end();
    return { exitCode: 0 };
  }

  if (!shouldKeepLock) {
    // Drop the existing connection to release the advisory lock
    await sql.end();

    sql = await newPostgresConnection(sqlOptions);

    // Execute a query to keep the event loop alive.
    await sql`SELECT 1 + 1 as "sum"`;
  }

  // Leak postgres connection, with a single connection, to keep the event loop spinning
  logger.info({
    message: "Migrate service keep-alive...",
    withLock: shouldKeepLock,
  });
}

async function checkStoreImport(logger) {
  try {
    await import("@compas/store");
    return { exitCode: 0 };
  } catch {
    logger.error({
      message:
        "Could not load @compas/store. Install it via 'yarn add --exact @compas/store'.",
    });
    return { exitCode: 1 };
  }
}
