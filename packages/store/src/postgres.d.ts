/**
 * @typedef {import("../types/advanced-types").Postgres} Postgres
 */
/**
 * @param {Postgres["connectionOptions"]} opts
 * @returns {Postgres["connectionOptions"]}
 */
export function buildAndCheckOpts(
  opts: Postgres["connectionOptions"],
): Postgres["connectionOptions"];
/**
 * Create a new postgres connection, using the default environment variables.
 * A database may be created using the provided credentials.
 *
 * Note that by default we add a 'dateOrTimeOnly' type, which serializes and parses
 * 'date' and 'time' columns, used by `T.date().timeOnly()` and `T.date().dateOnly()', as
 * strings.
 *
 * @since 0.1.0
 *
 * @param {Postgres["connectionOptions"]} [opts]
 * @returns {Promise<Postgres>}
 */
export function newPostgresConnection(
  opts?: Postgres["connectionOptions"],
): Promise<Postgres>;
/**
 * @param sql
 * @param databaseName
 * @param template
 * @param connectionOptions
 * @returns {Promise<Postgres>}
 */
export function createDatabaseIfNotExists(
  sql: any,
  databaseName: any,
  template: any,
  connectionOptions: any,
): Promise<Postgres>;
export { postgres };
export type Postgres = import("../types/advanced-types").Postgres;
import postgres from "postgres";
//# sourceMappingURL=postgres.d.ts.map
