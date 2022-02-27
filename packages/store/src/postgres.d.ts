/**
 * @param {import("../types/advanced-types.js").Postgres["connectionOptions"]} opts
 * @returns {NonNullable<import("../types/advanced-types.js").Postgres["connectionOptions"]>}
 */
export function buildAndCheckOpts(
  opts: import("../types/advanced-types.js").Postgres["connectionOptions"],
): NonNullable<
  import("../types/advanced-types.js").Postgres["connectionOptions"]
>;
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
 * @param {import("../types/advanced-types.js").Postgres["connectionOptions"]} [opts]
 * @returns {Promise<import("../types/advanced-types.js").Postgres>}
 */
export function newPostgresConnection(
  opts?: import("../types/advanced-types.js").Postgres["connectionOptions"],
): Promise<import("../types/advanced-types.js").Postgres>;
/**
 * @param sql
 * @param databaseName
 * @param template
 * @param connectionOptions
 * @returns {Promise<import("../types/advanced-types.js").Postgres>}
 */
export function createDatabaseIfNotExists(
  sql: any,
  databaseName: any,
  template: any,
  connectionOptions: any,
): Promise<import("../types/advanced-types.js").Postgres>;
export { postgres };
import postgres from "postgres";
//# sourceMappingURL=postgres.d.ts.map
