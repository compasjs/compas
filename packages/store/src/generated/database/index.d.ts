export const queries: {
  sessionStoreTokenCount: (
    sql: import("postgres").Sql<{}>,
    where?: StoreSessionStoreTokenWhere | undefined,
  ) => Promise<number>;
  sessionStoreTokenDelete: (
    sql: import("postgres").Sql<{}>,
    where?: StoreSessionStoreTokenWhere | undefined,
  ) => Promise<void>;
  sessionStoreTokenInsert: (
    sql: import("postgres").Sql<{}>,
    insert:
      | StoreSessionStoreTokenInsertPartial
      | StoreSessionStoreTokenInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreSessionStoreToken[]>;
  sessionStoreTokenUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert:
      | StoreSessionStoreTokenInsertPartial
      | StoreSessionStoreTokenInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreSessionStoreToken[]>;
  sessionStoreTokenUpdate: StoreSessionStoreTokenUpdateFnInput;
  sessionStoreCount: (
    sql: import("postgres").Sql<{}>,
    where?: StoreSessionStoreWhere | undefined,
  ) => Promise<number>;
  sessionStoreDelete: (
    sql: import("postgres").Sql<{}>,
    where?: StoreSessionStoreWhere | undefined,
  ) => Promise<void>;
  sessionStoreInsert: (
    sql: import("postgres").Sql<{}>,
    insert: StoreSessionStoreInsertPartial | StoreSessionStoreInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreSessionStore[]>;
  sessionStoreUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert: StoreSessionStoreInsertPartial | StoreSessionStoreInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreSessionStore[]>;
  sessionStoreUpdate: StoreSessionStoreUpdateFnInput;
  jobCount: (
    sql: import("postgres").Sql<{}>,
    where?: StoreJobWhere | undefined,
  ) => Promise<number>;
  jobDelete: (
    sql: import("postgres").Sql<{}>,
    where?: StoreJobWhere | undefined,
  ) => Promise<void>;
  jobInsert: (
    sql: import("postgres").Sql<{}>,
    insert: StoreJobInsertPartial | StoreJobInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreJob[]>;
  jobUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert: StoreJobInsertPartial | StoreJobInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreJob[]>;
  jobUpdate: StoreJobUpdateFnInput;
  fileCount: (
    sql: import("postgres").Sql<{}>,
    where?: StoreFileWhere | undefined,
  ) => Promise<number>;
  fileDelete: (
    sql: import("postgres").Sql<{}>,
    where?: StoreFileWhere | undefined,
  ) => Promise<void>;
  fileInsert: (
    sql: import("postgres").Sql<{}>,
    insert: StoreFileInsertPartial | StoreFileInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreFile[]>;
  fileUpsertOnId: (
    sql: import("postgres").Sql<{}>,
    insert: StoreFileInsertPartial | StoreFileInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreFile[]>;
  fileUpdate: StoreFileUpdateFnInput;
};
//# sourceMappingURL=index.d.ts.map
