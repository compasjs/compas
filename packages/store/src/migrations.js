import { createHash } from "crypto";
import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import { pathToFileURL } from "url";
import { AppError, environment, pathJoin } from "@compas/stdlib";

/**
 * @typedef {object} MigrationFile
 * @property {number} number
 * @property {boolean} repeatable
 * @property {string} name
 * @property {string} fullPath
 * @property {boolean} isMigrated
 * @property {string} source
 * @property {string} hash
 */

/**
 * @typedef {object} MigrateContext
 * @property {MigrationFile[]} files
 * @property {import("postgres").Sql<{}>} sql
 * @property {any|undefined} [rebuild]
 * @property {any|undefined} [info]
 * @property {any|undefined} [do]
 * @property {Record<number, string>} storedHashes
 * @property {boolean} [missingMigrationTable]
 */

/**
 * Create a new  migration context, resolves all migrations and collects the current
 * migration state.
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Sql<{}>} sql
 * @param {string} migrationDirectory
 * @returns {Promise<MigrateContext>}
 */
export async function newMigrateContext(
  sql,
  migrationDirectory = `${process.cwd()}/migrations`,
) {
  try {
    const migrations = await readMigrationsDir(migrationDirectory);

    const mc = {
      files: migrations.sort((a, b) => {
        return a.number - b.number;
      }),
      sql,
      storedHashes: {},
    };

    await Promise.race([
      acquireLock(sql),
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Could not acquire advisory lock")),
          2500,
        );
      }),
    ]);
    await syncWithSchemaState(mc);

    mc.rebuild = () => rebuildMigrations(mc);
    mc.info = () => getMigrationsToBeApplied(mc);
    mc.do = () => runMigrations(mc);

    return mc;
  } catch (/** @type {any} */ error) {
    // Help user by dropping the sql connection so the application will exit
    await sql?.end();
    if (AppError.instanceOf(error)) {
      throw error;
    } else {
      throw new AppError(
        "store.migrateContext.error",
        500,
        {
          message: "Could not create migration context",
        },
        error,
      );
    }
  }
}

/**
 * Get the migrations to be applied from the provided migration context.
 * Note that 'repeatable' migrations are always in both the `migrationQueue` and
 * `hashChanges`.
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {{
 *   migrationQueue: {
 *     name: string,
 *     number: number,
 *     repeatable: boolean
 *   }[],
 *   hashChanges: {
 *     name: string,
 *     number: number,
 *   }[]
 * }}
 */
export function getMigrationsToBeApplied(mc) {
  const migrationQueue = filterMigrationsToBeApplied(mc).map((it) => ({
    name: it.name,
    number: it.number,
    repeatable: it.repeatable,
  }));

  const hashChanges = [];
  for (const it of mc.files) {
    if (it.isMigrated && mc.storedHashes[it.number] !== it.hash) {
      hashChanges.push({
        name: it.name,
        number: it.number,
      });
    }
  }

  return {
    migrationQueue,
    hashChanges,
  };
}

/**
 * Run the migrations currently pending in the migration context.
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
export async function runMigrations(mc) {
  let current;
  try {
    const migrationFiles = filterMigrationsToBeApplied(mc);

    if (mc.missingMigrationTable && migrationFiles.length > 0) {
      mc.missingMigrationTable = false;

      if (
        !migrationFiles[0]?.source.includes(`migration_namespace_number_idx`)
      ) {
        // Automatically create the migration table
        await mc.sql.unsafe(`
        CREATE TABLE IF NOT EXISTS migration
        (
          "namespace" varchar NOT NULL,
          "number"    int,
          "name"      varchar NOT NULL,
          "createdAt" timestamptz DEFAULT now(),
          "hash"      varchar
        );

        CREATE INDEX IF NOT EXISTS migration_namespace_number_idx ON "migration" ("namespace", "number");
      `);
      }
    }

    for (const migration of migrationFiles) {
      current = migration;
      await runMigration(mc.sql, migration);
    }
  } catch (/** @type {any} */ error) {
    // Help user by dropping the sql connection so the application will exit
    await mc?.sql?.end();
    if (AppError.instanceOf(error)) {
      throw error;
    } else {
      throw new AppError(
        "store.migrateRun.error",
        500,
        {
          message: "Could not run migration",
          number: current?.number,
          name: current?.name,
        },
        error,
      );
    }
  }
}

/**
 * Rebuild migration table state based on the known migration files
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
export async function rebuildMigrations(mc) {
  try {
    await mc.sql.begin(async (sql) => {
      await sql`DELETE
                FROM "migration"
                WHERE
                  1 = 1`;

      for (const file of mc.files) {
        await runInsert(sql, file);
      }
    });
  } catch (/** @type {any} */ e) {
    if ((e.message ?? "").indexOf(`"migration" does not exist`) === -1) {
      throw new AppError(
        "migrate.rebuild.error",
        500,
        {
          message: "No migrations applied yet, can't rebuild migration table.",
        },
        e,
      );
    } else {
      throw e;
    }
  }
}

/**
 * @param {MigrateContext} mc
 * @returns {MigrationFile[]}
 */
function filterMigrationsToBeApplied(mc) {
  const result = [];
  for (const f of mc.files) {
    if (!f.isMigrated) {
      result.push(f);
    } else if (mc.storedHashes[f.number] !== f.hash && f.repeatable) {
      result.push(f);
    }
  }

  return result;
}

/**
 * @param {import("postgres").Sql<{}>} sql
 * @param {MigrationFile} migration
 * @returns {Promise<void>}
 */
async function runMigration(sql, migration) {
  const useTransaction =
    !migration.source.includes("-- disable auto transaction") &&
    !migration.source.includes("// disable auto transaction");

  /** @type {(sql: Postgres) => (Promise<void|any>|void)} */
  let run = () => {
    throw AppError.serverError({
      message: "Unknown migration file",
      fullPath: migration.fullPath,
    });
  };

  if (migration.fullPath.endsWith(".sql")) {
    run = (sql) => sql.unsafe(migration.source);
  } else if (migration.fullPath.endsWith(".js")) {
    run = async (sql) => {
      // @ts-ignore
      const { migrate } = await import(pathToFileURL(migration.fullPath));

      if (typeof migrate !== "function") {
        throw AppError.serverError({
          message:
            "JavaScript migration files should contain the following signature: 'export async function migrate(sql)'.",
        });
      }

      return await migrate(sql);
    };
  }

  if (useTransaction) {
    await sql.begin(async (sql) => {
      await run(sql);
      await runInsert(sql, migration);
    });
  } else {
    await run(sql);
    await runInsert(sql, migration);
  }
}

/**
 * @param {import("postgres").Sql<{}>} sql
 * @param {MigrationFile} migration
 */
function runInsert(sql, migration) {
  return sql`INSERT INTO "migration" (namespace, number, name, hash) VALUES (${
    environment.APP_NAME ?? "compas"
  }, ${migration.number}, ${migration.name}, ${migration.hash});`;
}

/**
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
async function syncWithSchemaState(mc) {
  let rows = [];
  try {
    rows = await mc.sql`
      SELECT DISTINCT ON (number) number, hash
      FROM migration
      ORDER BY number, "createdAt" DESC
    `;
  } catch (/** @type {any} */ e) {
    if ((e.message ?? "").includes(`"migration" does not exist`)) {
      mc.missingMigrationTable = true;
    } else {
      throw new AppError(
        "store.migrateSync.error",
        500,
        {
          message: "Could not read existing migration table",
        },
        e,
      );
    }
    return;
  }

  const numbers = [];
  for (const row of rows) {
    numbers.push(Number(row.number));

    mc.storedHashes[Number(row.number)] = row.hash;
  }

  for (const mF of mc.files) {
    if (numbers.includes(mF.number)) {
      mF.isMigrated = true;
    }
  }
}

/**
 * @param {import("postgres").Sql<{}>} sql
 */
async function acquireLock(sql) {
  // Should be automatically released by Postgres once this connection ends.
  // We expect that the user runs this process for migrations only
  let locked = false;
  while (!locked) {
    const [result] = await sql`SELECT pg_try_advisory_lock(-9876453452)`;
    if (result.pg_try_advisory_lock) {
      locked = true;
    }
  }
}

/**
 *
 * @param directory
 * @returns {Promise<MigrationFile[]>}
 */
async function readMigrationsDir(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  const migrationFiles = [];

  const files = await readdir(directory);

  for (const f of files) {
    const fullPath = pathJoin(directory, f);

    if (!f.endsWith(".sql") && !f.endsWith(".js")) {
      continue;
    }

    const { number, repeatable, name } = parseFileName(f);
    const source = await readFile(fullPath, "utf-8");
    const hash = createHash("sha1").update(source, "utf-8").digest("hex");
    migrationFiles.push({
      number,
      repeatable,
      name,
      fullPath,
      isMigrated: false,
      source,
      hash,
    });
  }

  return migrationFiles;
}

/**
 * @param fileName
 */
function parseFileName(fileName) {
  const filePattern = /(\d+)(-r)?-([a-zA-Z-]+).(js|sql)/g;
  filePattern.lastIndex = 0;

  if (!filePattern.test(fileName)) {
    throw new Error(
      `migration: only supports the following file pattern: '000-my-name.{sql,js}' or '001-r-name.sql' for repeatable migrations`,
    );
  }

  filePattern.lastIndex = 0;
  // @ts-ignore
  const [, number, repeatable, name] = filePattern.exec(fileName);

  return {
    number: Number(number),
    name,
    repeatable: !!repeatable,
  };
}
