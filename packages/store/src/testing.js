import { isNil, isPlainObject, newLogger, uuid } from "@compas/stdlib";
import {
  buildAndCheckOpts,
  createDatabaseIfNotExists,
  newPostgresConnection,
} from "./postgres.js";

/**
 * If set, new databases are derived from this database
 *
 * @type {Postgres & { connectionOptions?: postgres.Options}}
 */
let testDatabase = undefined;

/**
 * Set test database.
 * New createTestPostgresConnection calls will use this as a template,
 * so things like seeding only need to happen once.
 *
 * @since 0.1.0
 *
 * @param {Postgres} connection
 * @returns {void}
 */
export function setPostgresDatabaseTemplate(connection) {
  if (
    isPlainObject(connection.connectionOptions) &&
    typeof connection.options.database === "string"
  ) {
    testDatabase = connection;
  } else {
    throw new Error(`Expected sql connection. Found ${typeof connection}`);
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
    await cleanupTestPostgresDatabase(testDatabase);
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
 * @param {boolean} [verboseSql=false] If true, creates a new logger and prints all
 *   queries.
 * @param {postgres.Options} [rawOpts]
 * @returns {Promise<Postgres>}
 */
export async function createTestPostgresDatabase(verboseSql = false, rawOpts) {
  const connectionOptions = buildAndCheckOpts(rawOpts);
  const name = connectionOptions.database + uuid().substring(0, 7);

  if (!isNil(testDatabase?.options?.database)) {
    // Real database creation
    const creationSql = await createDatabaseIfNotExists(
      undefined,
      name,
      testDatabase.options.database,
      connectionOptions,
    );

    const sql = await newPostgresConnection({
      ...connectionOptions,
      database: name,
      debug: verboseSql ? newLogger({ ctx: { type: "sql" } }).error : undefined,
    });

    // Initialize new connection and kill old connection
    await Promise.all([creationSql.end(), sql`SELECT 1 + 1 AS sum`]);

    sql.connectionOptions = connectionOptions;

    return sql;
  }

  const creationSql = await createDatabaseIfNotExists(
    undefined,
    connectionOptions.database,
    undefined,
    {
      ...connectionOptions,
      database: undefined,
    },
  );

  // Clean all connections
  // They prevent from using this as a template
  await creationSql`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE
        pg_stat_activity.datname = ${connectionOptions.database}
    AND pid <> pg_backend_pid()
  `;

  // Use the current 'app' database as a base.
  // We expect the user to have done all necessary migrations
  await createDatabaseIfNotExists(
    creationSql,
    name,
    connectionOptions.database,
    { ...connectionOptions, database: undefined },
  );

  const sql = await newPostgresConnection({
    ...connectionOptions,
    database: name,
  });

  sql.connectionOptions = connectionOptions;

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

  await creationSql.end();

  return sql;
}

/**
 * Try to remove a test database. Can only happen if the connection is created by
 * 'createTestPostgresDatabase'.s
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @returns {Promise<undefined>}
 */
export async function cleanupTestPostgresDatabase(sql) {
  await sql.end();

  if (sql?.connectionOptions) {
    const deletionSql = await newPostgresConnection(sql.connectionOptions);
    await deletionSql.unsafe(`DROP DATABASE ${sql.options.database}`);
    await deletionSql.end();
  }
}
