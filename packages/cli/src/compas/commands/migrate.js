import { existsSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { isNil, isPlainObject } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "migrate",
  shortDescription:
    "Run PostgreSQL migrations via the @compas/store migration system.",
  longDescription: `The migrations are managed via the @compas/store provided system. And are forward only.

A custom Postgres connection object can be provided by exporting a 'postgresConnectionSettings' object from the files specified via the '--connection-settings' flag.

This command can keep running if for example your deploy system does not support one of tasks. You can use '--keep-alive' for that. It keeps a single Postgres connection alive to ensure that the process doesn't exit.
The migration runner uses an advisory lock to ensure only a single migration process runs at the same time. To disable this behaviour when the command enters watch mode, '--without-lock' can be passed.
`,
  subCommands: [
    {
      name: "info",
      shortDescription: "Print the current migration state.",
    },
    {
      name: "rebuild",
      shortDescription: "Recreate migration state based on the file system.",
    },
  ],
  flags: [
    {
      name: "connectionSettings",
      rawName: "--connection-settings",
      description:
        "Specify a path that contains the PostgreSQL connection object.",
      value: {
        specification: "string",
        validator: (value) => {
          const isValid = existsSync(value);

          if (isValid) {
            return {
              isValid,
            };
          }

          return {
            isValid,
            error: {
              message: `Could not find the specified file relative to the current working directory. Make sure it exists.`,
            },
          };
        },
        completions: () => {
          return {
            completions: [{ type: "file" }],
          };
        },
      },
    },
    {
      name: "keepAlive",
      rawName: "--keep-alive",
      description:
        "Keep the service running, by maintaining a single idle SQL connection.",
    },
    {
      name: "withoutLock",
      rawName: "--without-lock",
      description:
        "Drop the migration lock, before entering the keep-alive state. Only used when `--keep-alive` is passed as well",
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  if (!(await checkStoreImport())) {
    logger.error(
      "Could not load @compas/store. Install it via 'yarn add --exact @compas/store'.",
    );
    return { exitStatus: "failed" };
  }

  // @ts-ignore
  const { newPostgresConnection, newMigrateContext } = await import(
    "@compas/store"
  );

  const sqlOptions = await loadConnectionSettings(
    typeof state.flags.connectionSettings === "string"
      ? state.flags.connectionSettings
      : undefined,
  );

  if (sqlOptions.error) {
    logger.error(sqlOptions.error);
    return {
      exitStatus: "failed",
    };
  }

  let sql = await newPostgresConnection(sqlOptions.value);
  const mc = await newMigrateContext(sql);

  // Always print current state;
  const mcInfo = mc.info();

  let infoString = "";
  if (mcInfo.migrationQueue.length > 0) {
    infoString += `Pending migrations:
${mcInfo.migrationQueue
  .map(
    (it) => `- ${it.number}-${it.name}${it.repeatable ? " (repeatable)" : ""}`,
  )
  .join("\n")}
`;
  }
  if (mcInfo.hashChanges.length > 0) {
    infoString += `Hash changes:
${mcInfo.hashChanges.map((it) => `- ${it.number}-${it.name}`).join("\n")}`;
  }

  if (mcInfo.migrationQueue.length === 0 && mcInfo.hashChanges.length === 0) {
    infoString += `No migration changes detected.`;
  }
  logger.info(infoString);

  if (state.command.includes("rebuild")) {
    logger.info("Rebuilding migration state.");
    await mc.rebuild();

    return {
      exitStatus: "passed",
    };
  }

  if (state.command.includes("info")) {
    // We already did just that
    return {
      exitStatus: "passed",
    };
  }

  logger.info("Start migrating.");
  await mc.do();
  logger.info("Done migrating.");

  if (!state.flags.keepAlive) {
    await sql.end();
    return { exitStatus: "passed" };
  }

  if (state.flags.withoutLock) {
    // Drop the existing connection to release the advisory lock
    await sql.end();

    sql = await newPostgresConnection(sqlOptions.value);

    // Execute a query to keep the event loop alive.
    await sql`SELECT 1 + 1 AS "sum"`;
  }

  // Leak postgres connection, with a single connection, to keep the event loop spinning
  logger.info(
    `Migrate command keep-alive ${
      state.flags.withoutLock ? "without" : "with"
    } lock`,
  );

  return {
    exitStatus: "keepAlive",
  };
}

async function checkStoreImport() {
  try {
    await import("@compas/store");
    return true;
  } catch {
    return false;
  }
}

/**
 *
 * @param {string|undefined} connectionSettings
 * @returns {Promise<import("@compas/stdlib").Either<object, string>>}
 */
async function loadConnectionSettings(connectionSettings) {
  const sqlOptions = {
    max: 1,
    createIfNotExists: true,
  };

  if (!isNil(connectionSettings)) {
    const errorMessage = `Could not load the file as specified by '--connection-settings ./path/to/file.js'.`;

    const fullPath = path.resolve(connectionSettings);

    if (!existsSync(fullPath)) {
      return {
        error: errorMessage,
      };
    }

    // @ts-ignore
    const { postgresConnectionSettings } = await import(
      // @ts-ignore
      pathToFileURL(fullPath)
    );
    if (isPlainObject(postgresConnectionSettings)) {
      Object.assign(sqlOptions, postgresConnectionSettings);
      sqlOptions.max = 1;
    }
  }

  return {
    value: sqlOptions,
  };
}
