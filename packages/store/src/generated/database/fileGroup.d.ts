/**
 * Get all fields for fileGroup
 *
 * @param {string} [tableName="fg."]
 * @param {{ excludePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function fileGroupFields(
  tableName?: string | undefined,
  options?:
    | {
        excludePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'WHERE ' part for fileGroup
 *
 * @param {StoreFileGroupWhere} [where={}]
 * @param {string} [tableName="fg."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function fileGroupWhere(
  where?: StoreFileGroupWhere | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'ORDER BY ' part for fileGroup
 *
 * @param {StoreFileGroupOrderBy} [orderBy=["createdAt", "updatedAt", "id"]]
 * @param {StoreFileGroupOrderBySpec} [orderBySpec={}]
 * @param {string} [tableName="fg."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function fileGroupOrderBy(
  orderBy?: StoreFileGroupOrderBy | undefined,
  orderBySpec?: StoreFileGroupOrderBySpec | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'VALUES ' part for fileGroup
 *
 * @param {StoreFileGroupInsertPartial|StoreFileGroupInsertPartial[]} insert
 * @param {{ includePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function fileGroupInsertValues(
  insert: StoreFileGroupInsertPartial | StoreFileGroupInsertPartial[],
  options?:
    | {
        includePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'SET ' part for fileGroup
 *
 * @param {StoreFileGroupUpdatePartial} update
 * @returns {QueryPart}
 */
export function fileGroupUpdateSet(
  update: StoreFileGroupUpdatePartial,
): QueryPart;
/**
 * @param {StoreFileGroupQueryBuilder & StoreFileGroupQueryTraverser} builder
 * @param {QueryPart|undefined} [wherePartial]
 * @returns {QueryPart}
 */
export function internalQueryFileGroup2(
  builder: StoreFileGroupQueryBuilder & StoreFileGroupQueryTraverser,
  wherePartial?: QueryPart | undefined,
): QueryPart;
/**
 * @param {StoreFileGroupQueryBuilder & StoreFileGroupQueryTraverser} builder
 * @param {QueryPart|undefined} [wherePartial]
 * @returns {QueryPart}
 */
export function internalQueryFileGroup(
  builder: StoreFileGroupQueryBuilder & StoreFileGroupQueryTraverser,
  wherePartial?: QueryPart | undefined,
): QueryPart;
/**
 * Query Builder for fileGroup
 * Note that nested limit and offset don't work yet.
 *
 * @param {StoreFileGroupQueryBuilder} [builder={}]
 * @returns {{
 *  then: () => void,
 *  exec: (sql: Postgres) => Promise<QueryResultStoreFileGroup[]>,
 *  execRaw: (sql: Postgres) => Promise<any[]>,
 *  queryPart: QueryPart<any>,
 * }}
 */
export function queryFileGroup(
  builder?: StoreFileGroupQueryBuilder | undefined,
): {
  then: () => void;
  exec: (sql: Postgres) => Promise<QueryResultStoreFileGroup[]>;
  execRaw: (sql: Postgres) => Promise<any[]>;
  queryPart: QueryPart<any>;
};
/**
 * NOTE: At the moment only intended for internal use by the generated queries!
 *
 * Transform results from the query builder that adhere to the known structure
 * of 'fileGroup' and its relations.
 *
 * @param {any[]} values
 * @param {StoreFileGroupQueryBuilder} [builder={}]
 */
export function transformFileGroup(
  values: any[],
  builder?: StoreFileGroupQueryBuilder | undefined,
): void;
export namespace fileGroupQueries {
  export { fileGroupCount };
  export { fileGroupDelete };
  export { fileGroupInsert };
  export { fileGroupUpsertOnId };
  export { fileGroupUpdate };
  export { fileGroupDeletePermanent };
}
/**
 * @param {Postgres} sql
 * @param {StoreFileGroupWhere} [where]
 * @returns {Promise<number>}
 */
declare function fileGroupCount(
  sql: Postgres,
  where?: StoreFileGroupWhere | undefined,
): Promise<number>;
/**
 * @param {Postgres} sql
 * @param {StoreFileGroupWhere} [where={}]
 * @param {{ skipCascade?: boolean }} [options={}]
 * @returns {Promise<void>}
 */
declare function fileGroupDelete(
  sql: Postgres,
  where?: StoreFileGroupWhere | undefined,
  options?:
    | {
        skipCascade?: boolean | undefined;
      }
    | undefined,
): Promise<void>;
/**
 * @param {Postgres} sql
 * @param {StoreFileGroupInsertPartial|(StoreFileGroupInsertPartial[])} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<StoreFileGroup[]>}
 */
declare function fileGroupInsert(
  sql: Postgres,
  insert: StoreFileGroupInsertPartial | StoreFileGroupInsertPartial[],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<StoreFileGroup[]>;
/**
 * @param {Postgres} sql
 * @param {StoreFileGroupInsertPartial|(StoreFileGroupInsertPartial[])} insert
 * @param {{}} [options={}]
 * @returns {Promise<StoreFileGroup[]>}
 */
declare function fileGroupUpsertOnId(
  sql: Postgres,
  insert: StoreFileGroupInsertPartial | StoreFileGroupInsertPartial[],
  options?: {} | undefined,
): Promise<StoreFileGroup[]>;
/**
 * @param {Postgres} sql
 * @param {StoreFileGroupUpdatePartial} update
 * @param {StoreFileGroupWhere} [where={}]
 * @returns {Promise<StoreFileGroup[]>}
 */
declare function fileGroupUpdate(
  sql: Postgres,
  update: StoreFileGroupUpdatePartial,
  where?: StoreFileGroupWhere | undefined,
): Promise<StoreFileGroup[]>;
/**
 * @param {Postgres} sql
 * @param {StoreFileGroupWhere} [where={}]
 * @returns {Promise<void>}
 */
declare function fileGroupDeletePermanent(
  sql: Postgres,
  where?: StoreFileGroupWhere | undefined,
): Promise<void>;
export {};
//# sourceMappingURL=fileGroup.d.ts.map
