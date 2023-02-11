/**
 * Reusable where clause generator. This is used by other generated queries, and can be used inline in custom queries.
 *
 * @param {import("../common/types").StoreSessionStoreWhereInput} [where]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function sessionStoreWhere(
  where?: import("../common/types").StoreSessionStoreWhereInput | undefined,
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
 * @param {import("../common/types").StoreSessionStoreOrderByInput} [orderBy]
 * @param {import("../common/types").StoreSessionStoreOrderBySpecInput} [orderBySpec]
 * @param {{ skipValidator?: boolean, shortName?: string }} [options]
 * @returns {QueryPart<any>}
 */
export function sessionStoreOrderBy(
  orderBy?: import("../common/types").StoreSessionStoreOrderByInput,
  orderBySpec?:
    | import("../common/types").StoreSessionStoreOrderBySpecInput
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
 * @param {import("../common/types").StoreSessionStoreQueryBuilderInput} [input]
 * @returns {import("../common/database").WrappedQueryPart<import("../common/types").QueryResultStoreSessionStore>}
 */
export function querySessionStore(
  input?:
    | import("../common/types").StoreSessionStoreQueryBuilderInput
    | undefined,
): import("../common/database").WrappedQueryPart<
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
 * @param {import("../common/types").StoreSessionStoreWhereInput} where
 * @returns {Promise<number>}
 */
declare function sessionStoreCount(
  sql: import("@compas/store").Postgres,
  where: import("../common/types").StoreSessionStoreWhereInput,
): Promise<number>;
/**
 * Insert a record in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreInsertInput["insert"]} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<import("../common/types").StoreSessionStore[]>}
 */
declare function sessionStoreInsert(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreSessionStoreInsertInput["insert"],
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
 * @param {import("../common/types").StoreSessionStoreUpdateInput} update
 * @returns {Promise<import("../common/types").StoreSessionStore[]>}
 */
declare function sessionStoreUpdate(
  sql: import("@compas/store").Postgres,
  update: import("../common/types").StoreSessionStoreUpdateInput,
): Promise<import("../common/types").StoreSessionStore[]>;
/**
 * Insert a record in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreWhereInput} [where]
 * @returns {Promise<void>}
 */
declare function sessionStoreDelete(
  sql: import("@compas/store").Postgres,
  where?: import("../common/types").StoreSessionStoreWhereInput | undefined,
): Promise<void>;
/**
 * Upsert a record in the 'sessionStore' table
 *
 * @param {import("@compas/store").Postgres} sql
 * @param {import("../common/types").StoreSessionStoreInsertInput["insert"]} insert
 * @returns {Promise<import("../common/types").StoreSessionStore[]>}
 */
declare function sessionStoreUpsertOnId(
  sql: import("@compas/store").Postgres,
  insert: import("../common/types").StoreSessionStoreInsertInput["insert"],
): Promise<import("../common/types").StoreSessionStore[]>;
export {};
//# sourceMappingURL=sessionStore.d.ts.map
