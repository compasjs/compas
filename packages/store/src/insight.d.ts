/**
 * Get the disk size (in bytes) and estimated row count for all tables and views.
 * To improve accuracy, run sql`ANALYZE` before this query, however make sure to read the
 * Postgres documentation for implications.
 *
 * @since 0.1.0
 * @summary Get the estimated disk size and row count for all tables
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @returns {Promise<Record<string, { diskSize: number, rowCount: number }>>}
 */
export function postgresTableSizes(
  sql: import("../types/advanced-types").Postgres,
): Promise<
  Record<
    string,
    {
      diskSize: number;
      rowCount: number;
    }
  >
>;
//# sourceMappingURL=insight.d.ts.map
