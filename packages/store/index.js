/**
 * @typedef {import("./types/advanced-types.js").Postgres} Postgres
 */

/**
 * @typedef {import("./types/advanced-types.js").MinioClient} MinioClient
 */

/**
 * @template T
 * @typedef {import("./types/advanced-types.js").QueryPart<T>} QueryPart
 */

/**
 * @typedef {import("./types/advanced-types.js").QueryPartArg} QueryPartArg
 */

/**
 * @typedef {import("./src/send-transformed-image").GetStreamFn} GetStreamFn
 */

/**
 * @typedef {import("./src/sessions.js").SessionStore} SessionStore
 */

/**
 * @typedef {import("./src/session-store.js").StoreSessionStoreSettings} StoreSessionStoreSettings
 */

export { structure as storeStructure } from "./src/generated/common/structure.js";
export { queries as storeQueries } from "./src/generated/database/index.js";

export { setStoreQueries } from "./src/generated.js";

export { generatedWhereBuilderHelper } from "./src/generator-helpers.js";

export {
  newMinioClient,
  minio,
  ensureBucket,
  removeBucket,
  listObjects,
  removeBucketAndObjectsInBucket,
  copyAllObjects,
} from "./src/minio.js";

export { newPostgresConnection, postgres } from "./src/postgres.js";

export {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
  cleanupPostgresDatabaseTemplate,
} from "./src/testing.js";

export {
  newMigrateContext,
  getMigrationsToBeApplied,
  runMigrations,
} from "./src/migrations.js";

export {
  createOrUpdateFile,
  copyFile,
  getFileStream,
  syncDeletedFiles,
} from "./src/files.js";

export {
  hoistChildrenToParent,
  updateFileGroupOrder,
} from "./src/file-group.js";

export { FileCache } from "./src/file-cache.js";

export {
  JobQueueWorker,
  addEventToQueue,
  addJobToQueue,
  addJobWithCustomTimeoutToQueue,
  addRecurringJobToQueue,
  getUncompletedJobsByName,
} from "./src/queue.js";

export { sessionStoreCreate } from "./src/session-store.js";

export { newSessionStore } from "./src/sessions.js";

export {
  query,
  isQueryPart,
  stringifyQueryPart,
  explainAnalyzeQuery,
} from "./src/query.js";

export { postgresTableSizes } from "./src/insight.js";

export { sendTransformedImage } from "./src/send-transformed-image.js";
