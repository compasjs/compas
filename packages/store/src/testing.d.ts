/**
 * Set test database.
 * New createTestPostgresConnection calls will use this as a template,
 * so things like seeding only need to happen once.
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Sql<{}>} connection
 * @returns {void}
 */
export function setPostgresDatabaseTemplate(
  connection: import("postgres").Sql<{}>,
): void;
/**
 * Cleanup the test template database.
 *
 * @since 0.1.0
 *
 * @returns {Promise<void>}
 */
export function cleanupPostgresDatabaseTemplate(): Promise<void>;
/**
 * Create a new test database, using the default database as it's template.
 * The copied database will be fully truncated, except for the 'migrations' table.
 * To do this, all connections to the default database are forcefully killed.
 * Returns a connection to the new database.
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Options} [rawOpts]
 * @param {{
 *   verboseSql?: boolean
 * }} [options] If verboseSql is true, creates a new logger and prints all
 *   queries.
 * @returns {Promise<import("@compas/store").Postgres>}
 */
export function createTestPostgresDatabase(
  rawOpts?: import("postgres").Options<any> | undefined,
  options?:
    | {
        verboseSql?: boolean | undefined;
      }
    | undefined,
): Promise<import("@compas/store").Postgres>;
/**
 * Try to remove a test database. Can only happen if the connection is created by
 * 'createTestPostgresDatabase'.
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Sql<{}>} sql
 * @returns {Promise<void>}
 */
export function cleanupTestPostgresDatabase(
  sql: import("postgres").Sql<{}>,
): Promise<void>;
//# sourceMappingURL=testing.d.ts.map
