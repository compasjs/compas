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
export function setPostgresDatabaseTemplate(connection: Postgres): void;
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
 * @param {boolean} [verboseSql=false] If true, creates a new logger and prints all
 *   queries.
 * @param {Postgres["connectionOptions"]} [rawOpts]
 * @returns {Promise<Postgres>}
 */
export function createTestPostgresDatabase(verboseSql?: boolean | undefined, rawOpts?: Postgres["connectionOptions"]): Promise<Postgres>;
/**
 * Try to remove a test database. Can only happen if the connection is created by
 * 'createTestPostgresDatabase'.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @returns {Promise<void>}
 */
export function cleanupTestPostgresDatabase(sql: Postgres): Promise<void>;
export type Postgres = import("../types/advanced-types").Postgres;
//# sourceMappingURL=testing.d.ts.map