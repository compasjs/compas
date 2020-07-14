import { createHash } from "crypto";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { dirnameForModule } from "@lbu/stdlib";

/**
 * @name MigrateContext
 *
 * @typedef {object}
 * @property {MigrateFile[]} files
 * @property {string[]} namespaces
 * @property {object<string, string>} storedHashes
 * @property {Postgres} sql
 */

/**
 * @name MigrateFile
 *
 * @typedef {object}
 * @property {string} namespace
 * @property {number} number
 * @property {boolean} repeatable
 * @property {string} name
 * @property {string} fullPath
 * @property {boolean} isMigrated
 * @property {string} source
 * @property {string} hash
 */

/**
 * @param sql
 * @param migrationDirectory
 * @property {Postgres} sql
 * @returns {Promise<MigrateContext>}
 */
export async function newMigrateContext(
  sql,
  migrationDirectory = `${process.cwd()}/migrations`,
) {
  const migrations = await readMigrationsDir(migrationDirectory);

  // Automatically add this package to the migrations
  if (migrations.namespaces.indexOf("@lbu/store") === -1) {
    migrations.namespaces.unshift("@lbu/store");

    const { migrationFiles } = await readMigrationsDir(
      dirnameForModule(import.meta) + "/../migrations",
      "@lbu/store",
      migrations.namespaces,
    );

    migrations.migrationFiles.push(...migrationFiles);
  }

  const mc = {
    files: sortMigrations(migrations.namespaces, migrations.migrationFiles),
    namespaces: migrations.namespaces,
    sql,
    storedHashes: {},
  };

  await acquireLock(sql);
  await syncWithSchemaState(mc);
  return mc;
}

/**
 * Get a list of migrations to be applied
 *
 * @param {MigrateContext} mc
 * @returns {({name: string, number: number, repeatable: boolean}[])|boolean}
 */
export function getMigrationsToBeApplied(mc) {
  const list = filterMigrationsToBeApplied(mc);
  if (list.length === 0) {
    return false;
  }

  return list.map((it) => ({
    name: `${it.namespace}/${it.name}`,
    number: it.number,
    repeatable: it.repeatable,
  }));
}

/**
 * @param {MigrateContext} mc
 */
export async function runMigrations(mc) {
  const migrationFiles = filterMigrationsToBeApplied(mc);

  for (const migration of migrationFiles) {
    await runMigration(mc.sql, migration);
  }
}

/**
 * @param {MigrateContext} mc
 * @returns {MigrateFile[]}
 */
function filterMigrationsToBeApplied(mc) {
  const result = [];
  for (const f of mc.files) {
    if (!f.isMigrated) {
      result.push(f);
    } else if (
      mc.storedHashes[`${f.namespace}-${f.number}`] !== f.hash &&
      f.repeatable
    ) {
      result.push(f);
    }
  }

  return result;
}

/**
 * @param {Postgres} sql
 * @param {MigrateFile} migration
 * @returns {Promise<void>}
 */
async function runMigration(sql, migration) {
  const useTransaction =
    migration.source.indexOf("-- disable auto transaction") === -1;

  try {
    if (useTransaction) {
      await sql.begin(async (sql) => [
        await sql.unsafe(migration.source),
        await buildInsert(sql, migration),
      ]);
    } else {
      await sql.unsafe(migration.source);
      await buildInsert(sql, migration);
    }
  } catch (e) {
    throw new Error(
      `migration: error while applying ${migration.namespace}/${migration.number}-${migration.name}.\n${e.message}`,
    );
  }
}

/**
 * @param {Postgres} sql
 * @param {MigrateFile} migration
 */
async function buildInsert(sql, migration) {
  return sql`INSERT INTO migrations ${sql(
    migration,
    "namespace",
    "name",
    "number",
    "hash",
  )}`;
}

/**
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
async function syncWithSchemaState(mc) {
  let rows = [];
  try {
    rows = await mc.sql`SELECT DISTINCT ON (namespace, number) namespace,
                                                               number,
                                                               hash
                        FROM migrations
                        ORDER BY namespace, number, created_at DESC`;
  } catch (e) {
    if ((e.message ?? "").indexOf(`"migrations" does not exist`) === -1) {
      throw e;
    }
    return;
  }

  const migrationData = {};
  for (const row of rows) {
    if (!migrationData[row.namespace]) {
      migrationData[row.namespace] = [];
    }
    migrationData[row.namespace].push(row.number);

    mc.storedHashes[`${row.namespace}-${row.number}`] = row.hash;
  }

  for (const mF of mc.files) {
    if (
      migrationData[mF.namespace] &&
      migrationData[mF.namespace].indexOf(mF.number) !== -1
    ) {
      mF.isMigrated = true;
    }
  }
}

/**
 * @param sql
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
 * @param {string} namespace
 * @param {string[]} namespaces
 * @returns {Promise<{migrationFiles: [], namespaces: [*]}>}
 */
async function readMigrationsDir(
  directory,
  namespace = process.env.APP_NAME,
  namespaces = [process.env.APP_NAME],
) {
  if (!existsSync(directory)) {
    return {
      namespaces: [],
      migrationFiles: [],
    };
  }

  const files = await fs.readdir(directory);
  const result = [];

  for (const f of files) {
    const fullPath = path.join(directory, f);

    if (f === "namespaces.txt") {
      const rawNamespaces = await fs.readFile(fullPath, "utf-8");
      const subNamespaces = rawNamespaces
        .split("\n")
        .map((it) => it.trim())
        .filter((it) => it.length > 0);

      for (const sub of subNamespaces) {
        if (namespaces.indexOf(sub) !== -1) {
          continue;
        }

        namespaces.unshift(sub);

        const exportedItems = await import(sub);
        if (exportedItems && exportedItems.migrations) {
          const subResult = await readMigrationsDir(
            exportedItems.migrations,
            sub,
            namespaces,
          );
          result.push(...subResult.migrationFiles);
        }
      }
      continue;
    }

    const { number, repeatable, name } = parseFileName(f);
    const source = await fs.readFile(fullPath, "utf-8");
    const hash = createHash("sha1").update(source, "utf-8").digest("hex");
    result.push({
      namespace,
      number,
      repeatable,
      name,
      fullPath,
      isMigrated: false,
      source,
      hash,
    });
  }

  return {
    migrationFiles: result,
    namespaces,
  };
}

/**
 * @param namespaces
 * @param files
 */
function sortMigrations(namespaces, files) {
  return files.sort((a, b) => {
    const namespaceResult =
      namespaces.indexOf(a.namespace) - namespaces.indexOf(b.namespace);

    if (namespaceResult !== 0) {
      return namespaceResult;
    }

    return a.number < b.number;
  });
}

/**
 * @param fileName
 */
function parseFileName(fileName) {
  const filePattern = /(\d+)(-r)?-([a-zA-Z-]+).sql/g;
  filePattern.lastIndex = 0;

  if (!fileName.endsWith(".sql")) {
    throw new Error(
      `migration: Only supports migrating sql files: ${fileName}`,
    );
  }

  filePattern.lastIndex = 0;
  if (!filePattern.test(fileName)) {
    throw new Error(
      `migration: only supports the following file pattern: '000-my-name.sql' or '001-r-name.sql' for repeatable migrations`,
    );
  }

  filePattern.lastIndex = 0;
  const [, number, repeatable, name] = filePattern.exec(fileName);

  return {
    number: Number(number),
    name,
    repeatable: !!repeatable,
  };
}
