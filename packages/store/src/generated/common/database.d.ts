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
    where: import("./types.js").StoreSessionStoreTokenWhereInput,
  ) => Promise<number>;
  sessionStoreTokenInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreTokenInsertPartialInput
      | import("./types.js").StoreSessionStoreTokenInsertPartialInput[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreSessionStoreToken[]>;
  sessionStoreTokenUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreSessionStoreTokenUpdateInput,
  ) => Promise<import("./types.js").StoreSessionStoreToken[]>;
  sessionStoreTokenDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreSessionStoreTokenWhereInput | undefined,
  ) => Promise<void>;
  sessionStoreTokenUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreTokenInsertPartialInput
      | import("./types.js").StoreSessionStoreTokenInsertPartialInput[],
  ) => Promise<import("./types.js").StoreSessionStoreToken[]>;
  sessionStoreCount: (
    sql: import("postgres").Sql<{}>,
    where: import("./types.js").StoreSessionStoreWhereInput,
  ) => Promise<number>;
  sessionStoreInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreInsertPartialInput
      | import("./types.js").StoreSessionStoreInsertPartialInput[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreSessionStore[]>;
  sessionStoreUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreSessionStoreUpdateInput,
  ) => Promise<import("./types.js").StoreSessionStore[]>;
  sessionStoreDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreSessionStoreWhereInput | undefined,
  ) => Promise<void>;
  sessionStoreUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreSessionStoreInsertPartialInput
      | import("./types.js").StoreSessionStoreInsertPartialInput[],
  ) => Promise<import("./types.js").StoreSessionStore[]>;
  jobCount: (
    sql: import("postgres").Sql<{}>,
    where: import("./types.js").StoreJobWhereInput,
  ) => Promise<number>;
  jobInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreJobInsertPartialInput
      | import("./types.js").StoreJobInsertPartialInput[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreJob[]>;
  jobUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreJobUpdateInput,
  ) => Promise<import("./types.js").StoreJob[]>;
  jobDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreJobWhereInput | undefined,
  ) => Promise<void>;
  jobUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreJobInsertPartialInput
      | import("./types.js").StoreJobInsertPartialInput[],
  ) => Promise<import("./types.js").StoreJob[]>;
  fileCount: (
    sql: import("postgres").Sql<{}>,
    where: import("./types.js").StoreFileWhereInput,
  ) => Promise<number>;
  fileInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreFileInsertPartialInput
      | import("./types.js").StoreFileInsertPartialInput[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<import("./types.js").StoreFile[]>;
  fileUpdate: (
    sql: import("postgres").Sql<{}>,
    update: import("./types.js").StoreFileUpdateInput,
  ) => Promise<import("./types.js").StoreFile[]>;
  fileDelete: (
    sql: import("postgres").Sql<{}>,
    where?: import("./types.js").StoreFileWhereInput | undefined,
  ) => Promise<void>;
  fileUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | import("./types.js").StoreFileInsertPartialInput
      | import("./types.js").StoreFileInsertPartialInput[],
  ) => Promise<import("./types.js").StoreFile[]>;
};
//# sourceMappingURL=database.d.ts.map
