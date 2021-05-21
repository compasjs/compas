import { isNil } from "@compas/stdlib";

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
  const arg = command.arguments[1];
  const shouldRebuild = arg === "rebuild";
  const shouldPrintInfo = arg === "info";
  const shouldKeepAlive = arg === "--keep-alive";

  if (!isNil(arg) && !shouldRebuild && !shouldPrintInfo && !shouldKeepAlive) {
    logger.error(
      `Unknown argument '${arg}'. Expected one of 'rebuild', 'check' or '--keep-alive'.`,
    );
    return { exitCode: 1 };
  }

  const { newPostgresConnection, newMigrateContext } = await import(
    "@compas/store"
  );

  const sql = await newPostgresConnection({ max: 1, createIfNotExists: true });
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

  // Leak postgres connection, with a single connection, to keep the event loop spinning
  logger.info({
    message: "Migrate service keep-alive...",
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
