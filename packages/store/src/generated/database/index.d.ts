export const queries: {
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
