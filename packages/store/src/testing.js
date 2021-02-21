import { newLogger } from "@compas/insight";
import { environment, isNil, uuid } from "@compas/stdlib";
import {
  createDatabaseIfNotExists,
  newPostgresConnection,
  postgres,
  postgresEnvCheck,
} from "./postgres.js";

/**
 * If set, new databases are derived from this database
 *
 * @type {undefined}
 */
let testDatabase = undefined;

/**
 * Set test database.
 * New createTestPostgresConnection calls will use this as a template,
 * so things like seeding only need to happen once.
 *
 * @since 0.1.0
 *
 * @param {Postgres|string} databaseNameOrConnection
 * @returns {Promise<undefined>}
 */
export async function setPostgresDatabaseTemplate(databaseNameOrConnection) {
  if (!isNil(testDatabase)) {
    await cleanupPostgresDatabaseTemplate();
  }

  if (typeof databaseNameOrConnection === "string") {
    testDatabase = databaseNameOrConnection;
  } else if (typeof databaseNameOrConnection?.options?.database === "string") {
    testDatabase = databaseNameOrConnection.options.database;
  } else {
    throw new Error(
      `Expected string or sql connection. Found ${typeof databaseNameOrConnection}`,
    );
  }
}

/**
 * Cleanup the test template database.
 *
 * @since 0.1.0
 *
 * @returns {Promise<void>}
 */
export async function cleanupPostgresDatabaseTemplate() {
  if (!isNil(testDatabase)) {
    // We mock a connection here, since cleanTestPostgresDatabase doesn't use the
    // connection any way
    await cleanupTestPostgresDatabase({
      options: {
        database: testDatabase,
      },
      end: () => Promise.resolve(),
    });
  }
}

/**
 * Create a new test database, using the default database as it's template.
 * The copied database will be fully truncated, except for the 'migrations' table.
 * To do this, all connections to the default database are forcefully killed.
 * Returns a connection to the new database.
 *
 * @since 0.1.0
 *
 * @param {boolean} [verboseSql=false] If true, creates a new logger and prints all queries.
 * @returns {Promise<Postgres>}
 */
export async function createTestPostgresDatabase(verboseSql = false) {
  postgresEnvCheck();
  const name = environment.POSTGRES_DATABASE + uuid().substring(0, 7);

  // Setup a template to work from
  if (isNil(testDatabase)) {
    testDatabase = environment.POSTGRES_DATABASE + uuid().substring(0, 7);

    const creationSql = await createDatabaseIfNotExists(
      undefined,
      environment.POSTGRES_DATABASE,
    );

    // Clean all connections
    // They prevent from using this as a template
    await creationSql`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE
            pg_stat_activity.datname = ${environment.POSTGRES_DATABASE}
        AND pid <> pg_backend_pid()
      `;

    // Use the current 'app' database as a base.
    // We expect the user to have done all necessary migrations
    await createDatabaseIfNotExists(
      creationSql,
      testDatabase,
      environment.POSTGRES_DATABASE,
    );

    const sql = await newPostgresConnection({
      database: testDatabase,
    });

    // Cleanup all tables, except migrations
    const tables = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE
            table_schema = 'public'
        AND table_name != 'migration'
        AND table_type = 'BASE TABLE'
      `;
    if (tables.length > 0) {
      await sql.unsafe(`
        TRUNCATE ${tables.map((it) => `"${it.table_name}"`).join(", ")} CASCADE
          `);
    }

    // Cleanup all connections
    await Promise.all([creationSql.end(), sql.end()]);
  }

  // Real database creation
  const creationSql = await createDatabaseIfNotExists(
    undefined,
    name,
    testDatabase,
  );

  const sql = await newPostgresConnection({
    database: name,
    debug: verboseSql ? newLogger({ ctx: { type: "sql" } }).error : undefined,
  });

  // Initialize new connection and kill old connection
  await Promise.all([creationSql.end(), sql`SELECT 1 + 1 AS sum`]);

  return sql;
}

/**
 * Remove a created test database
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @returns {Promise<undefined>}
 */
export async function cleanupTestPostgresDatabase(sql) {
  const dbName = sql.options.database;
  await sql.end();

  const deletionSql = postgres(environment.POSTGRES_URI);
  // language=PostgreSQL
  await deletionSql`DROP DATABASE ${deletionSql(dbName)}`;
  await deletionSql.end();
}
