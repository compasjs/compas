import { log } from "@lbu/insight";
import { uuid } from "@lbu/stdlib";
import {
  createDatabaseIfNotExists,
  newPostgresConnection,
} from "./postgres.js";

/**
 * @param verboseSql
 */
export async function createTestPostgresDatabase(verboseSql = false) {
  const name = process.env.APP_NAME + uuid().substring(0, 7);

  const creationSql = await createDatabaseIfNotExists(
    undefined,
    process.env.APP_NAME,
  );

  // Drop all connections to the database, this is required before it is usable as a template
  await creationSql`SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = ${process.env.APP_NAME}
  AND pid <> pg_backend_pid();`;

  await createDatabaseIfNotExists(creationSql, name, process.env.APP_NAME);

  const sql = await newPostgresConnection({
    database: name,
    debug: verboseSql ? log.error : undefined,
  });

  const schemas = await sql`SELECT table_name
                            FROM information_schema.tables
                            WHERE table_schema = 'public'`;

  // removes migrations
  const tableNames = schemas
    .map((it) => it.table_name)
    .filter((it) => it !== "migrations");

  if (tableNames.length > 0) {
    await sql`TRUNCATE ${sql(tableNames)} CASCADE `;
  } else {
    // Just a query to initialize the connection
    await sql`SELECT 1 + 1 AS sum;`;
  }

  creationSql.end({});

  return sql;
}

/**
 * @param sql
 */
export async function cleanupTestPostgresDatabase(sql) {
  const dbName = sql.options.database;
  await sql.end({ timeout: 0.1 });

  const deletionSql = await newPostgresConnection({});
  // language=PostgreSQL
  await deletionSql.unsafe(`DROP DATABASE ${dbName}`);
  await deletionSql.end({ timeout: 0.1 });
}
