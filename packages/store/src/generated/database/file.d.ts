/**
 * Get all fields for file
 *
 * @param {string} [tableName="f."]
 * @param {{ excludePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function fileFields(
  tableName?: string | undefined,
  options?:
    | {
        excludePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'WHERE ' part for file
 *
 * @param {StoreFileWhere} [where={}]
 * @param {string} [tableName="f."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function fileWhere(
  where?: StoreFileWhere | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'ORDER BY ' part for file
 *
 * @param {StoreFileOrderBy} [orderBy=["createdAt", "updatedAt", "id"]]
 * @param {StoreFileOrderBySpec} [orderBySpec={}]
 * @param {string} [tableName="f."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function fileOrderBy(
  orderBy?: StoreFileOrderBy | undefined,
  orderBySpec?: StoreFileOrderBySpec | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'VALUES ' part for file
 *
 * @param {StoreFileInsertPartial|StoreFileInsertPartial[]} insert
 * @param {{ includePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function fileInsertValues(
  insert: StoreFileInsertPartial | StoreFileInsertPartial[],
  options?:
    | {
        includePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Query Builder for file
 * Postgres based file storage.
 *
 * @param {StoreFileQueryBuilder} [builder={}]
 * @returns {{
 *  then: () => void,
 *  exec: (sql: Postgres) => Promise<QueryResultStoreFile[]>,
 *  execRaw: (sql: Postgres) => Promise<any[]>,
 *  queryPart: QueryPart<any>,
 * }}
 */
export function queryFile(builder?: StoreFileQueryBuilder | undefined): {
  then: () => void;
  exec: (sql: import("postgres").Sql<{}>) => Promise<QueryResultStoreFile[]>;
  execRaw: (sql: import("postgres").Sql<{}>) => Promise<any[]>;
  queryPart: QueryPart<any>;
};
/**
 * NOTE: At the moment only intended for internal use by the generated queries!
 *
 * Transform results from the query builder that adhere to the known structure
 * of 'file' and its relations.
 *
 * @param {any[]} values
 * @param {StoreFileQueryBuilder} [builder={}]
 */
export function transformFile(
  values: any[],
  builder?: StoreFileQueryBuilder | undefined,
): void;
/** @type {any} */
export const fileWhereSpec: any;
/** @type {any} */
export const fileUpdateSpec: any;
export namespace fileQueries {
  export { fileCount };
  export { fileDelete };
  export { fileInsert };
  export { fileUpsertOnId };
  export { fileUpdate };
}
export namespace fileQueryBuilderSpec {
  export const name: string;
  export const shortName: string;
  export { fileOrderBy as orderBy };
  export { fileWhereSpec as where };
  export const columns: string[];
  export const relations: never[];
}
/**
 * @param {Postgres} sql
 * @param {StoreFileWhere} [where]
 * @returns {Promise<number>}
 */
declare function fileCount(
  sql: import("postgres").Sql<{}>,
  where?: StoreFileWhere | undefined,
): Promise<number>;
/**
 * @param {Postgres} sql
 * @param {StoreFileWhere} [where={}]
 * @returns {Promise<void>}
 */
declare function fileDelete(
  sql: import("postgres").Sql<{}>,
  where?: StoreFileWhere | undefined,
): Promise<void>;
/**
 * @param {Postgres} sql
 * @param {StoreFileInsertPartial|(StoreFileInsertPartial[])} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<StoreFile[]>}
 */
declare function fileInsert(
  sql: import("postgres").Sql<{}>,
  insert: StoreFileInsertPartial | StoreFileInsertPartial[],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<StoreFile[]>;
/**
 * @param {Postgres} sql
 * @param {StoreFileInsertPartial|(StoreFileInsertPartial[])} insert
 * @param {{}} [options={}]
 * @returns {Promise<StoreFile[]>}
 */
declare function fileUpsertOnId(
  sql: import("postgres").Sql<{}>,
  insert: StoreFileInsertPartial | StoreFileInsertPartial[],
  options?: {} | undefined,
): Promise<StoreFile[]>;
/**
 * (Atomic) update queries for file
 *
 * @type {StoreFileUpdateFn}
 */
declare const fileUpdate: StoreFileUpdateFn;
export {};
//# sourceMappingURL=file.d.ts.map
