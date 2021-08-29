/**
 * Get all fields for session
 *
 * @param {string} [tableName="s."]
 * @param {{ excludePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function sessionFields(tableName?: string | undefined, options?: {
    excludePrimaryKey?: boolean | undefined;
} | undefined): QueryPart;
/**
 * Build 'WHERE ' part for session
 *
 * @param {StoreSessionWhere} [where={}]
 * @param {string} [tableName="s."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function sessionWhere(where?: StoreSessionWhere | undefined, tableName?: string | undefined, options?: {
    skipValidator?: boolean | undefined;
} | undefined): QueryPart;
/**
 * Build 'ORDER BY ' part for session
 *
 * @param {StoreSessionOrderBy} [orderBy=["createdAt", "updatedAt", "id"]]
 * @param {StoreSessionOrderBySpec} [orderBySpec={}]
 * @param {string} [tableName="s."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function sessionOrderBy(orderBy?: StoreSessionOrderBy | undefined, orderBySpec?: StoreSessionOrderBySpec | undefined, tableName?: string | undefined, options?: {
    skipValidator?: boolean | undefined;
} | undefined): QueryPart;
/**
 * Build 'VALUES ' part for session
 *
 * @param {StoreSessionInsertPartial|StoreSessionInsertPartial[]} insert
 * @param {{ includePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function sessionInsertValues(insert: StoreSessionInsertPartial | StoreSessionInsertPartial[], options?: {
    includePrimaryKey?: boolean | undefined;
} | undefined): QueryPart;
/**
 * Build 'SET ' part for session
 *
 * @param {StoreSessionUpdatePartial} update
 * @returns {QueryPart}
 */
export function sessionUpdateSet(update: StoreSessionUpdatePartial): QueryPart;
/**
 * @param {StoreSessionQueryBuilder & StoreSessionQueryTraverser} builder
 * @param {QueryPart|undefined} [wherePartial]
 * @returns {QueryPart}
 */
export function internalQuerySession(builder: StoreSessionQueryBuilder & StoreSessionQueryTraverser, wherePartial?: QueryPart | undefined): QueryPart;
/**
 * Query Builder for session
 * Note that nested limit and offset don't work yet.
 *
 * @param {StoreSessionQueryBuilder} [builder={}]
 * @returns {{
 *  then: () => void,
 *  exec: (sql: Postgres) => Promise<QueryResultStoreSession[]>,
 *  execRaw: (sql: Postgres) => Promise<any[]>,
 *  queryPart: QueryPart<any>,
 * }}
 */
export function querySession(builder?: StoreSessionQueryBuilder | undefined): {
    then: () => void;
    exec: (sql: Postgres) => Promise<QueryResultStoreSession[]>;
    execRaw: (sql: Postgres) => Promise<any[]>;
    queryPart: QueryPart<any>;
};
/**
 * NOTE: At the moment only intended for internal use by the generated queries!
 *
 * Transform results from the query builder that adhere to the known structure
 * of 'session' and its relations.
 *
 * @param {any[]} values
 * @param {StoreSessionQueryBuilder} [builder={}]
 */
export function transformSession(values: any[], builder?: StoreSessionQueryBuilder | undefined): void;
export namespace sessionQueries {
    export { sessionCount };
    export { sessionDelete };
    export { sessionInsert };
    export { sessionUpsertOnId };
    export { sessionUpdate };
}
/**
 * @param {Postgres} sql
 * @param {StoreSessionWhere} [where]
 * @returns {Promise<number>}
 */
declare function sessionCount(sql: Postgres, where?: StoreSessionWhere | undefined): Promise<number>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionWhere} [where={}]
 * @returns {Promise<void>}
 */
declare function sessionDelete(sql: Postgres, where?: StoreSessionWhere | undefined): Promise<void>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionInsertPartial|(StoreSessionInsertPartial[])} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<StoreSession[]>}
 */
declare function sessionInsert(sql: Postgres, insert: StoreSessionInsertPartial | (StoreSessionInsertPartial[]), options?: {
    withPrimaryKey?: boolean | undefined;
} | undefined): Promise<StoreSession[]>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionInsertPartial|(StoreSessionInsertPartial[])} insert
 * @param {{}} [options={}]
 * @returns {Promise<StoreSession[]>}
 */
declare function sessionUpsertOnId(sql: Postgres, insert: StoreSessionInsertPartial | (StoreSessionInsertPartial[]), options?: {} | undefined): Promise<StoreSession[]>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionUpdatePartial} update
 * @param {StoreSessionWhere} [where={}]
 * @returns {Promise<StoreSession[]>}
 */
declare function sessionUpdate(sql: Postgres, update: StoreSessionUpdatePartial, where?: StoreSessionWhere | undefined): Promise<StoreSession[]>;
export {};
//# sourceMappingURL=session.d.ts.map