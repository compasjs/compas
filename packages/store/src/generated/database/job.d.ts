/**
 * Reusable where clause generator. This is used by other generated queries, and can be used inline in custom queries.
 *
 * @param {import("../common/types").StoreJobWhere} [where]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function jobWhere(
  where?: import("../common/types").StoreJobWhere | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
        shortName?: string | undefined;
      }
    | undefined,
): QueryPart<any>;
/**
 * Reusable ORDER BY clause generator. This is used by other generated queries, and can be used inline in custom queries.
 *
 * @param {import("../common/types").StoreJobOrderBy} [orderBy]
 * @param {import("../common/types").StoreJobOrderBySpec} [orderBySpec]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function jobOrderBy(
  orderBy?: import("../common/types").StoreJobOrderBy,
  orderBySpec?: import("../common/types").StoreJobOrderBySpec | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
        shortName?: string | undefined;
      }
    | undefined,
): QueryPart<any>;
/**
 * Query records in the 'job' table, optionally joining related tables.
 *
 * @param {import("../common/types").StoreJobQueryBuilder} [input]
 * @returns {import("@compas/store").WrappedQueryPart<import("../common/types").QueryResultStoreJob>}
 */
export function queryJob(
  input?: import("../common/types").StoreJobQueryBuilder | undefined,
): import("@compas/store").WrappedQueryPart<
  import("../common/types").QueryResultStoreJob
>;
export namespace jobQueries {
  export { jobCount };
  export { jobInsert };
  export { jobUpdate };
  export { jobDelete };
  export { jobUpsertOnId };
}
/** @type {any} */
export const jobWhereSpec: any;
/** @type {any} */
export const jobQueryBuilderSpec: any;
/**
 * Count the records in the 'job' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreJobWhere} where
 * @returns {Promise<number>}
 */
declare function jobCount(
  sql: import("@compas/store").Postgres,
  where: import("../common/types").StoreJobWhere,
): Promise<number>;
/**
 * Insert a record in the 'job' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreJobInsert["insert"]} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<import("../common/types").StoreJob[]>}
 */
declare function jobInsert(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreJobInsert["insert"],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<import("../common/types").StoreJob[]>;
/**
 * Insert a record in the 'job' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreJobUpdate} update
 * @returns {Promise<import("../common/types").StoreJob[]>}
 */
declare function jobUpdate(
  sql: import("@compas/store").Postgres,
  update: import("../common/types").StoreJobUpdate,
): Promise<import("../common/types").StoreJob[]>;
/**
 * Insert a record in the 'job' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreJobWhere} [where]
 * @returns {Promise<void>}
 */
declare function jobDelete(
  sql: import("@compas/store").Postgres,
  where?: import("../common/types").StoreJobWhere | undefined,
): Promise<void>;
/**
 * Upsert a record in the 'job' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreJobInsert["insert"]} insert
 * @returns {Promise<import("../common/types").StoreJob[]>}
 */
declare function jobUpsertOnId(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreJobInsert["insert"],
): Promise<import("../common/types").StoreJob[]>;
export {};
//# sourceMappingURL=job.d.ts.map
