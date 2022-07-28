/**
 * Get all fields for sessionStore
 *
 * @param {string} [tableName="ss."]
 * @param {{ excludePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreFields(
  tableName?: string | undefined,
  options?:
    | {
        excludePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'WHERE ' part for sessionStore
 *
 * @param {StoreSessionStoreWhere} [where={}]
 * @param {string} [tableName="ss."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreWhere(
  where?: StoreSessionStoreWhere | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'ORDER BY ' part for sessionStore
 *
 * @param {StoreSessionStoreOrderBy} [orderBy=["createdAt", "updatedAt", "id"]]
 * @param {StoreSessionStoreOrderBySpec} [orderBySpec={}]
 * @param {string} [tableName="ss."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreOrderBy(
  orderBy?: StoreSessionStoreOrderBy | undefined,
  orderBySpec?: StoreSessionStoreOrderBySpec | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'VALUES ' part for sessionStore
 *
 * @param {StoreSessionStoreInsertPartial|StoreSessionStoreInsertPartial[]} insert
 * @param {{ includePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function sessionStoreInsertValues(
  insert: StoreSessionStoreInsertPartial | StoreSessionStoreInsertPartial[],
  options?:
    | {
        includePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Query Builder for sessionStore
 * Session data store, used by 'sessionStore\*' functions.
 *
 * @param {StoreSessionStoreQueryBuilder} [builder={}]
 * @returns {{
 *  then: () => void,
 *  exec: (sql: Postgres) => Promise<QueryResultStoreSessionStore[]>,
 *  execRaw: (sql: Postgres) => Promise<any[]>,
 *  queryPart: QueryPart<any>,
 * }}
 */
export function querySessionStore(
  builder?: StoreSessionStoreQueryBuilder | undefined,
): {
  then: () => void;
  exec: (sql: Postgres) => Promise<QueryResultStoreSessionStore[]>;
  execRaw: (sql: Postgres) => Promise<any[]>;
  queryPart: QueryPart<any>;
};
/**
 * NOTE: At the moment only intended for internal use by the generated queries!
 *
 * Transform results from the query builder that adhere to the known structure
 * of 'sessionStore' and its relations.
 *
 * @param {any[]} values
 * @param {StoreSessionStoreQueryBuilder} [builder={}]
 */
export function transformSessionStore(
  values: any[],
  builder?: StoreSessionStoreQueryBuilder | undefined,
): void;
/** @type {any} */
export const sessionStoreWhereSpec: any;
/** @type {any} */
export const sessionStoreUpdateSpec: any;
export namespace sessionStoreQueries {
  export { sessionStoreCount };
  export { sessionStoreDelete };
  export { sessionStoreInsert };
  export { sessionStoreUpsertOnId };
  export { sessionStoreUpdate };
}
export namespace sessionStoreQueryBuilderSpec {
  export const name: string;
  export const shortName: string;
  export { sessionStoreOrderBy as orderBy };
  export { sessionStoreWhereSpec as where };
  export const columns: string[];
  export namespace relations {
    namespace accessTokens {
      const builderKey: string;
      const ownKey: string;
      const referencedKey: string;
      const returnsMany: boolean;
      function entityInformation(): {
        name: string;
        shortName: string;
        orderBy: typeof import("./sessionStoreToken.js").sessionStoreTokenOrderBy;
        where: any;
        columns: string[];
        relations: {
          session: {
            builderKey: string;
            ownKey: string;
            referencedKey: string;
            returnsMany: boolean;
            entityInformation: () => {
              name: string;
              shortName: string;
              orderBy: typeof sessionStoreOrderBy;
              where: any;
              columns: string[];
              relations: {
                accessTokens: {
                  builderKey: string;
                  ownKey: string;
                  referencedKey: string;
                  returnsMany: boolean;
                  entityInformation: () => any;
                };
              };
            };
          };
          refreshToken: {
            builderKey: string;
            ownKey: string;
            referencedKey: string;
            returnsMany: boolean;
            entityInformation: () => any;
          };
          accessToken: {
            builderKey: string;
            ownKey: string;
            referencedKey: string;
            returnsMany: boolean;
            entityInformation: () => any;
          };
        };
      };
    }
  }
}
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreWhere} [where]
 * @returns {Promise<number>}
 */
declare function sessionStoreCount(
  sql: Postgres,
  where?: StoreSessionStoreWhere | undefined,
): Promise<number>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreWhere} [where={}]
 * @returns {Promise<void>}
 */
declare function sessionStoreDelete(
  sql: Postgres,
  where?: StoreSessionStoreWhere | undefined,
): Promise<void>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreInsertPartial|(StoreSessionStoreInsertPartial[])} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<StoreSessionStore[]>}
 */
declare function sessionStoreInsert(
  sql: Postgres,
  insert: StoreSessionStoreInsertPartial | StoreSessionStoreInsertPartial[],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<StoreSessionStore[]>;
/**
 * @param {Postgres} sql
 * @param {StoreSessionStoreInsertPartial|(StoreSessionStoreInsertPartial[])} insert
 * @param {{}} [options={}]
 * @returns {Promise<StoreSessionStore[]>}
 */
declare function sessionStoreUpsertOnId(
  sql: Postgres,
  insert: StoreSessionStoreInsertPartial | StoreSessionStoreInsertPartial[],
  options?: {} | undefined,
): Promise<StoreSessionStore[]>;
/**
 * (Atomic) update queries for sessionStore
 *
 * @type {StoreSessionStoreUpdateFn}
 */
declare const sessionStoreUpdate: StoreSessionStoreUpdateFn;
export {};
//# sourceMappingURL=sessionStore.d.ts.map
