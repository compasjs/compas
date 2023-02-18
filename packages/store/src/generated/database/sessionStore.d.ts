/**
 * Reusable where clause generator. This is used by other generated queries, and can be used inline in custom queries.
 *
 * @param {import("../common/types").StoreSessionStoreWhere} [where]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function sessionStoreWhere(
  where?: import("../common/types").StoreSessionStoreWhere | undefined,
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
 * @param {import("../common/types").StoreSessionStoreOrderBy} [orderBy]
 * @param {import("../common/types").StoreSessionStoreOrderBySpec} [orderBySpec]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function sessionStoreOrderBy(
  orderBy?: import("../common/types").StoreSessionStoreOrderBy,
  orderBySpec?:
    | import("../common/types").StoreSessionStoreOrderBySpec
    | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
        shortName?: string | undefined;
      }
    | undefined,
): QueryPart<any>;
/**
 * Query records in the 'sessionStore' table, optionally joining related tables.
 *
 * @param {import("../common/types").StoreSessionStoreQueryBuilder} [input]
 * @returns {import("@compas/store").WrappedQueryPart<import("../common/types").QueryResultStoreSessionStore>}
 */
export function querySessionStore(
  input?: import("../common/types").StoreSessionStoreQueryBuilder | undefined,
): import("@compas/store").WrappedQueryPart<
  import("../common/types").QueryResultStoreSessionStore
>;
export namespace sessionStoreQueries {
  export { sessionStoreCount };
  export { sessionStoreInsert };
  export { sessionStoreUpdate };
  export { sessionStoreDelete };
  export { sessionStoreUpsertOnId };
}
/** @type {any} */
export const sessionStoreWhereSpec: any;
/** @type {any} */
export const sessionStoreQueryBuilderSpec: any;
/**
 * Count the records in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreWhere} where
 * @returns {Promise<number>}
 */
declare function sessionStoreCount(
  sql: import("@compas/store").Postgres,
  where: import("../common/types").StoreSessionStoreWhere,
): Promise<number>;
/**
 * Insert a record in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreInsert["insert"]} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<import("../common/types").StoreSessionStore[]>}
 */
declare function sessionStoreInsert(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreSessionStoreInsert["insert"],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<import("../common/types").StoreSessionStore[]>;
/**
 * Insert a record in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreUpdate} update
 * @returns {Promise<import("../common/types").StoreSessionStore[]>}
 */
declare function sessionStoreUpdate(
  sql: import("@compas/store").Postgres,
  update: import("../common/types").StoreSessionStoreUpdate,
): Promise<import("../common/types").StoreSessionStore[]>;
/**
 * Insert a record in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreWhere} [where]
 * @returns {Promise<void>}
 */
declare function sessionStoreDelete(
  sql: import("@compas/store").Postgres,
  where?: import("../common/types").StoreSessionStoreWhere | undefined,
): Promise<void>;
/**
 * Upsert a record in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreInsert["insert"]} insert
 * @returns {Promise<import("../common/types").StoreSessionStore[]>}
 */
declare function sessionStoreUpsertOnId(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreSessionStoreInsert["insert"],
): Promise<import("../common/types").StoreSessionStore[]>;
export {};
//# sourceMappingURL=sessionStore.d.ts.map
