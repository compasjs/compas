/**
 * Reusable where clause generator. This is used by other generated queries, and can be used inline in custom queries.
 *
 * @param {import("../common/types").StoreSessionStoreTokenWhere} [where]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function sessionStoreTokenWhere(
  where?: import("../common/types").StoreSessionStoreTokenWhere | undefined,
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
 * @param {import("../common/types").StoreSessionStoreTokenOrderBy} [orderBy]
 * @param {import("../common/types").StoreSessionStoreTokenOrderBySpec} [orderBySpec]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function sessionStoreTokenOrderBy(
  orderBy?: import("../common/types").StoreSessionStoreTokenOrderBy,
  orderBySpec?:
    | import("../common/types").StoreSessionStoreTokenOrderBySpec
    | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
        shortName?: string | undefined;
      }
    | undefined,
): QueryPart<any>;
/**
 * Query records in the 'sessionStoreToken' table, optionally joining related tables.
 *
 * @param {import("../common/types").StoreSessionStoreTokenQueryBuilder} [input]
 * @returns {import("@compas/store").WrappedQueryPart<import("../common/types").QueryResultStoreSessionStoreToken>}
 */
export function querySessionStoreToken(
  input?:
    | import("../common/types").StoreSessionStoreTokenQueryBuilder
    | undefined,
): import("@compas/store").WrappedQueryPart<
  import("../common/types").QueryResultStoreSessionStoreToken
>;
export namespace sessionStoreTokenQueries {
  export { sessionStoreTokenCount };
  export { sessionStoreTokenInsert };
  export { sessionStoreTokenUpdate };
  export { sessionStoreTokenDelete };
  export { sessionStoreTokenUpsertOnId };
}
/** @type {any} */
export const sessionStoreTokenWhereSpec: any;
/** @type {any} */
export const sessionStoreTokenQueryBuilderSpec: any;
/**
 * Count the records in the 'sessionStoreToken' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreTokenWhere} where
 * @returns {Promise<number>}
 */
declare function sessionStoreTokenCount(
  sql: import("@compas/store").Postgres,
  where: import("../common/types").StoreSessionStoreTokenWhere,
): Promise<number>;
/**
 * Insert a record in the 'sessionStoreToken' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreTokenInsert["insert"]} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<import("../common/types").StoreSessionStoreToken[]>}
 */
declare function sessionStoreTokenInsert(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreSessionStoreTokenInsert["insert"],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<import("../common/types").StoreSessionStoreToken[]>;
/**
 * Insert a record in the 'sessionStoreToken' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreTokenUpdate} update
 * @returns {Promise<import("../common/types").StoreSessionStoreToken[]>}
 */
declare function sessionStoreTokenUpdate(
  sql: import("@compas/store").Postgres,
  update: import("../common/types").StoreSessionStoreTokenUpdate,
): Promise<import("../common/types").StoreSessionStoreToken[]>;
/**
 * Insert a record in the 'sessionStoreToken' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreTokenWhere} [where]
 * @returns {Promise<void>}
 */
declare function sessionStoreTokenDelete(
  sql: import("@compas/store").Postgres,
  where?: import("../common/types").StoreSessionStoreTokenWhere | undefined,
): Promise<void>;
/**
 * Upsert a record in the 'sessionStoreToken' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreTokenInsert["insert"]} insert
 * @returns {Promise<import("../common/types").StoreSessionStoreToken[]>}
 */
declare function sessionStoreTokenUpsertOnId(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreSessionStoreTokenInsert["insert"],
): Promise<import("../common/types").StoreSessionStoreToken[]>;
export {};
//# sourceMappingURL=sessionStoreToken.d.ts.map
