/**
 * Set test database.
 * New createTestPostgresConnection calls will use this as a template,
 * so things like seeding only need to happen once.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} connection
 * @returns {void}
 */
export function setPostgresDatabaseTemplate(
  connection: import("../types/advanced-types").Postgres,
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
 * @param {Postgres["connectionOptions"]} [rawOpts]
 * @param {{
 *   verboseSql?: boolean
 * }} [options] If verboseSql is true, creates a new logger and prints all
 *   queries.
 * @returns {Promise<Postgres>}
 */
export function createTestPostgresDatabase(
  rawOpts?: Postgres["connectionOptions"],
  {
    verboseSql,
  }?:
    | {
        verboseSql?: boolean | undefined;
      }
    | undefined,
): Promise<Postgres>;
/**
 * Try to remove a test database. Can only happen if the connection is created by
 * 'createTestPostgresDatabase'.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @returns {Promise<void>}
 */
export function cleanupTestPostgresDatabase(
  sql: import("../types/advanced-types").Postgres,
): Promise<void>;
//# sourceMappingURL=testing.d.ts.map
