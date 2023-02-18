/**
 * Reusable where clause generator. This is used by other generated queries, and can be used inline in custom queries.
 *
 * @param {import("../common/types").StoreFileWhere} [where]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function fileWhere(
  where?: import("../common/types").StoreFileWhere | undefined,
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
 * @param {import("../common/types").StoreFileOrderBy} [orderBy]
 * @param {import("../common/types").StoreFileOrderBySpec} [orderBySpec]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function fileOrderBy(
  orderBy?: import("../common/types").StoreFileOrderBy,
  orderBySpec?: import("../common/types").StoreFileOrderBySpec | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
        shortName?: string | undefined;
      }
    | undefined,
): QueryPart<any>;
/**
 * Query records in the 'file' table, optionally joining related tables.
 *
 * @param {import("../common/types").StoreFileQueryBuilder} [input]
 * @returns {import("@compas/store").WrappedQueryPart<import("../common/types").QueryResultStoreFile>}
 */
export function queryFile(
  input?: import("../common/types").StoreFileQueryBuilder | undefined,
): import("@compas/store").WrappedQueryPart<
  import("../common/types").QueryResultStoreFile
>;
export namespace fileQueries {
  export { fileCount };
  export { fileInsert };
  export { fileUpdate };
  export { fileDelete };
  export { fileUpsertOnId };
}
/** @type {any} */
export const fileWhereSpec: any;
/** @type {any} */
export const fileQueryBuilderSpec: any;
/**
 * Count the records in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileWhere} where
 * @returns {Promise<number>}
 */
declare function fileCount(
  sql: import("@compas/store").Postgres,
  where: import("../common/types").StoreFileWhere,
): Promise<number>;
/**
 * Insert a record in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileInsert["insert"]} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<import("../common/types").StoreFile[]>}
 */
declare function fileInsert(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreFileInsert["insert"],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<import("../common/types").StoreFile[]>;
/**
 * Insert a record in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileUpdate} update
 * @returns {Promise<import("../common/types").StoreFile[]>}
 */
declare function fileUpdate(
  sql: import("@compas/store").Postgres,
  update: import("../common/types").StoreFileUpdate,
): Promise<import("../common/types").StoreFile[]>;
/**
 * Insert a record in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileWhere} [where]
 * @returns {Promise<void>}
 */
declare function fileDelete(
  sql: import("@compas/store").Postgres,
  where?: import("../common/types").StoreFileWhere | undefined,
): Promise<void>;
/**
 * Upsert a record in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileInsert["insert"]} insert
 * @returns {Promise<import("../common/types").StoreFile[]>}
 */
declare function fileUpsertOnId(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreFileInsert["insert"],
): Promise<import("../common/types").StoreFile[]>;
export {};
//# sourceMappingURL=file.d.ts.map
