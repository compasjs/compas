/**
 * @typedef {import("../types/advanced-types").Postgres} Postgres
 */

/**
 * Get the disk size (in bytes) and estimated row count for all tables and views.
 * To improve accuracy, run sql`ANALYZE` before this query, however make sure to read the
 * Postgres documentation for implications.
 *
 * @since 0.1.0
 * @summary Get the estimated disk size and row count for all tables
 *
 * @param {Postgres} sql
 * @returns {Promise<Record<string, { diskSize: number, rowCount: number }>>}
 */
export async function postgresTableSizes(sql) {
  const queryResult = await sql`
     SELECT relname AS "relation",
            pg_total_relation_size(c.oid) AS "diskSize",
            c.reltuples AS "rowCount"
     FROM pg_class c
            LEFT JOIN pg_namespace n ON (n.oid = c.relnamespace)
     WHERE
         nspname NOT IN ('pg_catalog', 'information_schema')
     AND c.relkind = ANY (ARRAY ['r', 'v', 'm'])
     AND nspname !~ '^pg_toast'
   `;

  /** @type {Record<string, { diskSize: number, rowCount: number }>} */
  const result = {};

  for (const item of queryResult) {
    result[item.relation] = {
      diskSize: Number(item.diskSize),
      rowCount: Number(item.rowCount),
    };
  }

  return result;
}
