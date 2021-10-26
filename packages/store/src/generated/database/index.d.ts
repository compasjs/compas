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
  sessionStoreTokenUpdate: (
    sql: import("../../../types/advanced-types.js").Postgres,
    update: StoreSessionStoreTokenUpdatePartial,
    where?: StoreSessionStoreTokenWhere | undefined,
  ) => Promise<StoreSessionStoreToken[]>;
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
  sessionStoreUpdate: (
    sql: import("../../../types/advanced-types.js").Postgres,
    update: StoreSessionStoreUpdatePartial,
    where?: StoreSessionStoreWhere | undefined,
  ) => Promise<StoreSessionStore[]>;
  sessionCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreSessionWhere | undefined,
  ) => Promise<number>;
  sessionDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreSessionWhere | undefined,
  ) => Promise<void>;
  sessionInsert: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreSessionInsertPartial | StoreSessionInsertPartial[],
    options?:
      | {
          withPrimaryKey?: boolean | undefined;
        }
      | undefined,
  ) => Promise<StoreSession[]>;
  sessionUpsertOnId: (
    sql: import("../../../types/advanced-types.js").Postgres,
    insert: StoreSessionInsertPartial | StoreSessionInsertPartial[],
    options?: {} | undefined,
  ) => Promise<StoreSession[]>;
  sessionUpdate: (
    sql: import("../../../types/advanced-types.js").Postgres,
    update: StoreSessionUpdatePartial,
    where?: StoreSessionWhere | undefined,
  ) => Promise<StoreSession[]>;
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
  jobUpdate: (
    sql: import("../../../types/advanced-types.js").Postgres,
    update: StoreJobUpdatePartial,
    where?: StoreJobWhere | undefined,
  ) => Promise<StoreJob[]>;
  fileCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileWhere | undefined,
  ) => Promise<number>;
  fileDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileWhere | undefined,
    options?:
      | {
          skipCascade?: boolean | undefined;
        }
      | undefined,
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
  fileUpdate: (
    sql: import("../../../types/advanced-types.js").Postgres,
    update: StoreFileUpdatePartial,
    where?: StoreFileWhere | undefined,
  ) => Promise<StoreFile[]>;
  fileDeletePermanent: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileWhere | undefined,
  ) => Promise<void>;
  fileGroupCount: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileGroupWhere | undefined,
  ) => Promise<number>;
  fileGroupDelete: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileGroupWhere | undefined,
    options?:
      | {
          skipCascade?: boolean | undefined;
        }
      | undefined,
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
  fileGroupUpdate: (
    sql: import("../../../types/advanced-types.js").Postgres,
    update: StoreFileGroupUpdatePartial,
    where?: StoreFileGroupWhere | undefined,
  ) => Promise<StoreFileGroup[]>;
  fileGroupDeletePermanent: (
    sql: import("../../../types/advanced-types.js").Postgres,
    where?: StoreFileGroupWhere | undefined,
  ) => Promise<void>;
};
//# sourceMappingURL=index.d.ts.map
