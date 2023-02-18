/**
 * Wrap a queryPart & validator in something that can either be used directly, or can be chained.
 *
 * @template {function} T
 *
 * @param {import("@compas/store").QueryPart<any>} queryPart
 * @param {T} validator
 * @param {{ hasCustomReturning: boolean }} options
 * @returns {import("@compas/store").WrappedQueryPart<NonNullable<ReturnType<T>["value"]>>}
 */
export function wrapQueryPart<T extends Function>(
  queryPart: import("@compas/store").QueryPart<any>,
  validator: T,
  options: {
    hasCustomReturning: boolean;
  },
): import("../../../index.js").WrappedQueryPart<
  NonNullable<ReturnType<T>["value"]>
>;
export const queries: {
  sessionStoreTokenCount: (
    sql: import("postgres").Sql<{}>,
    where: import("./types.js").StoreSessionStoreTokenWhere,
  ) => Promise<number>;
  sessionStoreTokenInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreTokenInsertPartial
      | import("./types.js").StoreSessionStoreTokenInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreSessionStoreToken[]>;
  sessionStoreTokenUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreSessionStoreTokenUpdate,
  ) => Promise<import("./types.js").StoreSessionStoreToken[]>;
  sessionStoreTokenDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreSessionStoreTokenWhere | undefined,
  ) => Promise<void>;
  sessionStoreTokenUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreTokenInsertPartial
      | import("./types.js").StoreSessionStoreTokenInsertPartial[],
  ) => Promise<import("./types.js").StoreSessionStoreToken[]>;
  sessionStoreCount: (
    sql: import("postgres").Sql<{}>,
    where: import("./types.js").StoreSessionStoreWhere,
  ) => Promise<number>;
  sessionStoreInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreInsertPartial
      | import("./types.js").StoreSessionStoreInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreSessionStore[]>;
  sessionStoreUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreSessionStoreUpdate,
  ) => Promise<import("./types.js").StoreSessionStore[]>;
  sessionStoreDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreSessionStoreWhere | undefined,
  ) => Promise<void>;
  sessionStoreUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreInsertPartial
      | import("./types.js").StoreSessionStoreInsertPartial[],
  ) => Promise<import("./types.js").StoreSessionStore[]>;
  jobCount: (
    sql: import("postgres").Sql<{}>,
    where: import("./types.js").StoreJobWhere,
  ) => Promise<number>;
  jobInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreJobInsertPartial
      | import("./types.js").StoreJobInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreJob[]>;
  jobUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreJobUpdate,
  ) => Promise<import("./types.js").StoreJob[]>;
  jobDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreJobWhere | undefined,
  ) => Promise<void>;
  jobUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreJobInsertPartial
      | import("./types.js").StoreJobInsertPartial[],
  ) => Promise<import("./types.js").StoreJob[]>;
  fileCount: (
    sql: import("postgres").Sql<{}>,
    where: import("./types.js").StoreFileWhere,
  ) => Promise<number>;
  fileInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreFileInsertPartial
      | import("./types.js").StoreFileInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreFile[]>;
  fileUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreFileUpdate,
  ) => Promise<import("./types.js").StoreFile[]>;
  fileDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreFileWhere | undefined,
  ) => Promise<void>;
  fileUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreFileInsertPartial
      | import("./types.js").StoreFileInsertPartial[],
  ) => Promise<import("./types.js").StoreFile[]>;
};
//# sourceMappingURL=database.d.ts.map
