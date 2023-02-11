/**
 * Reusable where clause generator. This is used by other generated queries, and can be used inline in custom queries.
 *
 * @param {import("../common/types").StoreFileWhereInput} [where]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function fileWhere(
  where?: import("../common/types").StoreFileWhereInput | undefined,
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
 * @param {import("../common/types").StoreFileOrderByInput} [orderBy]
 * @param {import("../common/types").StoreFileOrderBySpecInput} [orderBySpec]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function fileOrderBy(
  orderBy?: import("../common/types").StoreFileOrderByInput,
  orderBySpec?: import("../common/types").StoreFileOrderBySpecInput | undefined,
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
 * @param {import("../common/types").StoreFileQueryBuilderInput} [input]
 * @returns {import("../common/database").WrappedQueryPart<import("../common/types").QueryResultStoreFile>}
 */
export function queryFile(
  input?: import("../common/types").StoreFileQueryBuilderInput | undefined,
): import("../common/database").WrappedQueryPart<
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
 * @param {import("../common/types").StoreFileWhereInput} where
 * @returns {Promise<number>}
 */
declare function fileCount(
  sql: import("@compas/store").Postgres,
  where: import("../common/types").StoreFileWhereInput,
): Promise<number>;
/**
 * Insert a record in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileInsertInput["insert"]} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<import("../common/types").StoreFile[]>}
 */
declare function fileInsert(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreFileInsertInput["insert"],
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
 * @param {import("../common/types").StoreFileUpdateInput} update
 * @returns {Promise<import("../common/types").StoreFile[]>}
 */
declare function fileUpdate(
  sql: import("@compas/store").Postgres,
  update: import("../common/types").StoreFileUpdateInput,
): Promise<import("../common/types").StoreFile[]>;
/**
 * Insert a record in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileWhereInput} [where]
 * @returns {Promise<void>}
 */
declare function fileDelete(
  sql: import("@compas/store").Postgres,
  where?: import("../common/types").StoreFileWhereInput | undefined,
): Promise<void>;
/**
 * Upsert a record in the 'file' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreFileInsertInput["insert"]} insert
 * @returns {Promise<import("../common/types").StoreFile[]>}
 */
declare function fileUpsertOnId(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreFileInsertInput["insert"],
): Promise<import("../common/types").StoreFile[]>;
export {};
//# sourceMappingURL=file.d.ts.map
