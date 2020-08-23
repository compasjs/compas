import { log } from "@lbu/insight";
import { isNil, uuid } from "@lbu/stdlib";
import {
  createDatabaseIfNotExists,
  newPostgresConnection,
} from "./postgres.js";

/**
 * This database is reused in in setupTestDatabase
 * @type {string|undefined}
 */
let testDatabaseName = undefined;

/**
 * Setup a test database once
 * Copies the current app database
 * Calls callback, so seeding is possible, then reuses this as a template
 *
 * @param {function(Postgres): Promise<void>} callback
 * @returns {Promise<void>}
 */
export async function setupTestDatabase(callback) {
  if (testDatabaseName !== undefined) {
    return;
  }

  testDatabaseName = process.env.APP_NAME + uuid().substring(0, 7);

  // Open connection to default database
  const creationSql = await createDatabaseIfNotExists(
    undefined,
    process.env.APP_NAME,
  );

  // Drop all connections to the database, this is required before it is usable as a
  // template
  await creationSql`
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = ${process.env.APP_NAME}
  AND pid <> pg_backend_pid()
  `;

  // Create testDatabase based on the default app database
  await createDatabaseIfNotExists(
    creationSql,
    testDatabaseName,
    process.env.APP_NAME,
  );

  const sql = await newPostgresConnection({
    database: testDatabaseName,
  });

  // List all tables
  const tables = await sql`SELECT table_name
                             FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name != 'migrations'`;

  if (tables.length > 0) {
    await sql.unsafe(
      `TRUNCATE ${tables.map((it) => `"${it.table_name}"`).join(", ")} CASCADE`,
    );
  } else {
    // Just a query to initialize the connection
    await sql`SELECT 1 + 1 AS sum;`;
  }

  if (!isNil(callback) && typeof callback === "function") {
    // Call user seeder
    await callback(sql);
  }

  // Cleanup connections
  await Promise.all([
    creationSql.end({ timeout: 0.01 }),
    sql.end({ timeout: 0.01 }),
  ]);
}

/**
 * @param verboseSql
 */
export async function createTestPostgresDatabase(verboseSql = false) {
  const name = process.env.APP_NAME + uuid().substring(0, 7);
  await setupTestDatabase(() => {});

  const creationSql = await createDatabaseIfNotExists(
    undefined,
    name,
    testDatabaseName,
  );

  const sql = await newPostgresConnection({
    database: name,
    debug: verboseSql ? log.error : undefined,
  });

  // Initialize new connection and kill old connection
  await Promise.all([
    creationSql.end({ timeout: 0.01 }),
    sql`SELECT 1 + 1 as sum`,
  ]);

  return sql;
}

/**
 * @param sql
 */
export async function cleanupTestPostgresDatabase(sql) {
  const dbName = sql.options.database;
  await sql.end({ timeout: 0.01 });

  const deletionSql = await newPostgresConnection({});
  // language=PostgreSQL
  await deletionSql.unsafe(`DROP DATABASE ${dbName}`);
  await deletionSql.end({ timeout: 0.01 });
}
