/**
 * @param {import("postgres").Options|undefined} opts
 * @returns {import("postgres").Options}
 */
export function buildAndCheckOpts(
  opts: postgres.Options<any> | undefined,
): postgres.Options<any>;
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
 * @param {import("postgres").Options & {
 *   createIfNotExists?: boolean,
 * }} [opts]
 * @returns {Promise<import("postgres").Sql<{}>>}
 */
export function newPostgresConnection(
  opts?:
    | (postgres.Options<any> & {
        createIfNotExists?: boolean | undefined;
      })
    | undefined,
): Promise<import("postgres").Sql<{}>>;
/**
 * @param sql
 * @param databaseName
 * @param template
 * @param connectionOptions
 * @returns {Promise<import("postgres").Sql<{}>>}
 */
export function createDatabaseIfNotExists(
  sql: any,
  databaseName: any,
  template: any,
  connectionOptions: any,
): Promise<import("postgres").Sql<{}>>;
export { postgres };
import postgres from "postgres";
//# sourceMappingURL=postgres.d.ts.map
