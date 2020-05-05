import { log } from "@lbu/insight";
import { uuid } from "@lbu/stdlib";
import {
  createDatabaseIfNotExists,
  newPostgresConnection,
} from "./postgres.js";

export async function createTestPostgresDatabase(verboseSql = false) {
  const name = process.env.APP_NAME + uuid().substring(0, 7);

  const creationSql = await createDatabaseIfNotExists(
    undefined,
    process.env.APP_NAME,
  );
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

  await sql`TRUNCATE ${sql(tableNames)} CASCADE `;

  creationSql.end({});

  return sql;
}

export async function cleanupTestPostgresDatabase(sql) {
  const dbName = sql.options.database;
  await sql.end({ timeout: 0.1 });

  const deletionSql = await newPostgresConnection({});
  // language=PostgreSQL
  await deletionSql.unsafe(`DROP DATABASE ${dbName}`);
  await deletionSql.end({ timeout: 0.1 });
}
