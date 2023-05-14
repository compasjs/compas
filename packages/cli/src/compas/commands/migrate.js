import { existsSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { isNil, isPlainObject, pathJoin } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "migrate",
  shortDescription:
    "Run PostgreSQL migrations via the @compas/store migration system.",
  longDescription: `The migrations are managed via the @compas/store provided system. And are forward only.

A custom Postgres connection object can be provided by exporting a 'postgresConnectionSettings' object from the files specified via the '--connection-settings' flag.
`,
  modifiers: {
    isWatchable: true,
  },
  watchSettings: {
    extensions: ["sql"],
  },
  subCommands: [
    {
      name: "info",
      shortDescription: "Print the current migration state.",
      longDescription: `Print information about the migration state and exit. The information consists
of migrations that are not applied yet, and migrations that have 'hashChanges',
basically saying that the file on disk is out of sync with the migration that
was applied in the past.
`,
      modifiers: {
        isWatchable: true,
      },
      watchSettings: {
        extensions: ["sql"],
      },
    },
    {
      name: "rebuild",
      shortDescription: "Recreate migration state based on the file system.",
      longDescription: `Rebuild migration table with current file state. This allows for reordering
migrations, squashing migrations and other things that alter the migration
files, but do not affect the schema in any way. Note that Compas can't enforce
any consistency between the migration files and the current schema state. So use
with caution.
`,
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
      "Could not load @compas/store. Install it via 'yarn add --exact @compas/store' or 'npm add --save-exact @compas/store'.",
    );
    return { exitStatus: "failed" };
  }

  // @ts-ignore
  const {
    newPostgresConnection,
    migrationsInitContext,
    migrationsGetInfo,
    migrationsRun,
    migrationsRebuildState,
  } = await import("@compas/store");

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

  const sql = await newPostgresConnection(sqlOptions.value);
  const mc = await migrationsInitContext(sql, {
    migrationsDirectory: pathJoin(process.cwd(), "migrations"),
    uniqueLockNumber: -9876453452,
  });

  // Always print current state;
  const mcInfo = await migrationsGetInfo(mc);

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
    await migrationsRebuildState(mc);

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
  await migrationsRun(mc);
  logger.info("Done migrating.");

  return {
    exitStatus: "passed",
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
