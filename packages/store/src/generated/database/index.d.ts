export const queries: {
  sessionStoreTokenCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreSessionStoreTokenWhere | undefined,
  ) => Promise<number>;
  sessionStoreTokenDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreSessionStoreTokenWhere | undefined,
  ) => Promise<void>;
  sessionStoreTokenInsert: (
    sql: import("../../../types/advanced-types.js").Postgres,
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
    sql: import("../../../types/advanced-types.js").Postgres,
    insert:
      | StoreSessionStoreTokenInsertPartial
      | StoreSessionStoreTokenInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreSessionStoreToken[]>;
  sessionStoreTokenUpdate: StoreSessionStoreTokenUpdateFnInput;
  sessionStoreCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreSessionStoreWhere | undefined,
  ) => Promise<number>;
  sessionStoreDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreSessionStoreWhere | undefined,
  ) => Promise<void>;
  sessionStoreInsert: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreSessionStoreInsertPartial | StoreSessionStoreInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreSessionStore[]>;
  sessionStoreUpsertOnId: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreSessionStoreInsertPartial | StoreSessionStoreInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreSessionStore[]>;
  sessionStoreUpdate: StoreSessionStoreUpdateFnInput;
  jobCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreJobWhere | undefined,
  ) => Promise<number>;
  jobDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreJobWhere | undefined,
  ) => Promise<void>;
  jobInsert: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreJobInsertPartial | StoreJobInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreJob[]>;
  jobUpsertOnId: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreJobInsertPartial | StoreJobInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreJob[]>;
  jobUpdate: StoreJobUpdateFnInput;
  fileCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileWhere | undefined,
  ) => Promise<number>;
  fileDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileWhere | undefined,
  ) => Promise<void>;
  fileInsert: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreFileInsertPartial | StoreFileInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreFile[]>;
  fileUpsertOnId: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreFileInsertPartial | StoreFileInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreFile[]>;
  fileUpdate: StoreFileUpdateFnInput;
  fileGroupCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileGroupWhere | undefined,
  ) => Promise<number>;
  fileGroupDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileGroupWhere | undefined,
  ) => Promise<void>;
  fileGroupInsert: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreFileGroupInsertPartial | StoreFileGroupInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreFileGroup[]>;
  fileGroupUpsertOnId: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreFileGroupInsertPartial | StoreFileGroupInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreFileGroup[]>;
  fileGroupUpdate: StoreFileGroupUpdateFnInput;
};
//# sourceMappingURL=index.d.ts.map
