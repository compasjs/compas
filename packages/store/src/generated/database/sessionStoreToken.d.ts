/**
 * Get all fields for sessionStoreToken
 *
 * @param {string} [tableName="sst."]
 * @param {{ excludePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreTokenFields(
  tableName?: string | undefined,
  options?:
    | {
        excludePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'WHERE ' part for sessionStoreToken
 *
 * @param {StoreSessionStoreTokenWhere} [where={}]
 * @param {string} [tableName="sst."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreTokenWhere(
  where?: StoreSessionStoreTokenWhere | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'ORDER BY ' part for sessionStoreToken
 *
 * @param {StoreSessionStoreTokenOrderBy} [orderBy=["id"]]
 * @param {StoreSessionStoreTokenOrderBySpec} [orderBySpec={}]
 * @param {string} [tableName="sst."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreTokenOrderBy(
  orderBy?: StoreSessionStoreTokenOrderBy | undefined,
  orderBySpec?: StoreSessionStoreTokenOrderBySpec | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'VALUES ' part for sessionStoreToken
 *
 * @param {StoreSessionStoreTokenInsertPartial|StoreSessionStoreTokenInsertPartial[]} insert
 * @param {{ includePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreTokenInsertValues(
  insert:
    | StoreSessionStoreTokenInsertPartial
    | StoreSessionStoreTokenInsertPartial[],
  options?:
    | {
        includePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'SET ' part for sessionStoreToken
 *
 * @param {StoreSessionStoreTokenUpdatePartial} update
 * @returns {QueryPart}
 */
export function sessionStoreTokenUpdateSet(
  update: StoreSessionStoreTokenUpdatePartial,
): QueryPart;
/**
 * @param {StoreSessionStoreTokenQueryBuilder & StoreSessionStoreTokenQueryTraverser} builder
 * @param {QueryPart|undefined} [wherePartial]
 * @returns {QueryPart}
 */
export function internalQuerySessionStoreToken2(
  builder: StoreSessionStoreTokenQueryBuilder &
    StoreSessionStoreTokenQueryTraverser,
  wherePartial?: QueryPart | undefined,
): QueryPart;
/**
 * @param {StoreSessionStoreTokenQueryBuilder & StoreSessionStoreTokenQueryTraverser} builder
 * @param {QueryPart|undefined} [wherePartial]
 * @returns {QueryPart}
 */
export function internalQuerySessionStoreToken(
  builder: StoreSessionStoreTokenQueryBuilder &
    StoreSessionStoreTokenQueryTraverser,
  wherePartial?: QueryPart | undefined,
): QueryPart;
/**
 * Query Builder for sessionStoreToken
 * Note that nested limit and offset don't work yet.
 *
 * @param {StoreSessionStoreTokenQueryBuilder} [builder={}]
 * @returns {{
 *  then: () => void,
 *  exec: (sql: Postgres) => Promise<QueryResultStoreSessionStoreToken[]>,
 *  execRaw: (sql: Postgres) => Promise<any[]>,
 *  queryPart: QueryPart<any>,
 * }}
 */
export function querySessionStoreToken(
  builder?: StoreSessionStoreTokenQueryBuilder | undefined,
): {
  then: () => void;
  exec: (sql: Postgres) => Promise<QueryResultStoreSessionStoreToken[]>;
  execRaw: (sql: Postgres) => Promise<any[]>;
  queryPart: QueryPart<any>;
};
/**
 * NOTE: At the moment only intended for internal use by the generated queries!
 *
 * Transform results from the query builder that adhere to the known structure
 * of 'sessionStoreToken' and its relations.
 *
 * @param {any[]} values
 * @param {StoreSessionStoreTokenQueryBuilder} [builder={}]
 */
export function transformSessionStoreToken(
  values: any[],
  builder?: StoreSessionStoreTokenQueryBuilder | undefined,
): void;
/** @type {any} */
export const sessionStoreTokenWhereSpec: any;
export namespace sessionStoreTokenQueries {
  export { sessionStoreTokenCount };
  export { sessionStoreTokenDelete };
  export { sessionStoreTokenInsert };
  export { sessionStoreTokenUpsertOnId };
  export { sessionStoreTokenUpdate };
}
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreTokenWhere} [where]
 * @returns {Promise<number>}
 */
declare function sessionStoreTokenCount(
  sql: Postgres,
  where?: StoreSessionStoreTokenWhere | undefined,
): Promise<number>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreTokenWhere} [where={}]
 * @returns {Promise<void>}
 */
declare function sessionStoreTokenDelete(
  sql: Postgres,
  where?: StoreSessionStoreTokenWhere | undefined,
): Promise<void>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreTokenInsertPartial|(StoreSessionStoreTokenInsertPartial[])} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<StoreSessionStoreToken[]>}
 */
declare function sessionStoreTokenInsert(
  sql: Postgres,
  insert:
    | StoreSessionStoreTokenInsertPartial
    | StoreSessionStoreTokenInsertPartial[],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<StoreSessionStoreToken[]>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreTokenInsertPartial|(StoreSessionStoreTokenInsertPartial[])} insert
 * @param {{}} [options={}]
 * @returns {Promise<StoreSessionStoreToken[]>}
 */
declare function sessionStoreTokenUpsertOnId(
  sql: Postgres,
  insert:
    | StoreSessionStoreTokenInsertPartial
    | StoreSessionStoreTokenInsertPartial[],
  options?: {} | undefined,
): Promise<StoreSessionStoreToken[]>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreTokenUpdatePartial} update
 * @param {StoreSessionStoreTokenWhere} [where={}]
 * @returns {Promise<StoreSessionStoreToken[]>}
 */
declare function sessionStoreTokenUpdate(
  sql: Postgres,
  update: StoreSessionStoreTokenUpdatePartial,
  where?: StoreSessionStoreTokenWhere | undefined,
): Promise<StoreSessionStoreToken[]>;
export {};
//# sourceMappingURL=sessionStoreToken.d.ts.map
