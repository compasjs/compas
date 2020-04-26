import { uuid } from "@lbu/stdlib";
import { newPostgresConnection, postgres } from "./postgres.js";

export async function createTestPostgresDatabase() {
  const creationSql = postgres(process.env.POSTGRES_URI);
  const name = process.env.APP_NAME + uuid().substring(0, 7);
  // language=PostgreSQL
  const [
    db,
  ] = await creationSql`SELECT datname FROM pg_database WHERE datname = ${process.env.APP_NAME}`;

  if (!db || !db.datname) {
    // language=PostgreSQL
    await creationSql`CREATE DATABASE ${creationSql(
      process.env.APP_NAME,
    )} WITH OWNER ${creationSql(creationSql.options.user)}`;
  }

  // language=PostgreSQL
  await creationSql`CREATE DATABASE ${creationSql(
    name,
  )} WITH TEMPLATE ${creationSql(process.env.APP_NAME)} OWNER ${creationSql(
    creationSql.options.user,
  )}`;

  const sql = await newPostgresConnection({
    database: name,
  });

  // hacky but needed because clients are lazily initialized
  setImmediate(() => creationSql.end({}));

  return sql;
}

export async function cleanupTestPostgresDatabase(sql) {
  const dbName = sql.options.database;
  await sql.end();

  const deletionSql = await newPostgresConnection({});
  // language=PostgreSQL
  await deletionSql.unsafe(`DROP DATABASE ${dbName}`);
  await deletionSql.end();
}
