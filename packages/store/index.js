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
 * @template Type
 * @template {undefined | "*" | string[]} Selector
 * @typedef {import("./types/advanced-types.js").Returning<Type, Selector>} Returning
 */

/**
 * @typedef {import("./src/send-transformed-image").GetStreamFn} GetStreamFn
 */

/**
 * @typedef {import("./src/session-store.js").SessionStoreSettings} SessionStoreSettings
 */

/**
 * @typedef {import("./src/session-transport.js").SessionTransportSettings}
 *   SessionTransportSettings
 */

export { structure as storeStructure } from "./src/generated/common/structure.js";
export { queries as storeQueries } from "./src/generated/database/index.js";

export { setStoreQueries } from "./src/generated.js";

export {
  generatedWhereBuilderHelper,
  generatedUpdateHelper,
  generatedQueryBuilderHelper,
} from "./src/generator-helpers.js";

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
  fileSignAccessToken,
  fileVerifyAndDecodeAccessToken,
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

export {
  sessionStoreCreate,
  sessionStoreGet,
  sessionStoreUpdate,
  sessionStoreInvalidate,
  sessionStoreRefreshTokens,
  sessionStoreCleanupExpiredSessions,
} from "./src/session-store.js";

export {
  sessionTransportLoadFromContext,
  sessionTransportAddAsCookiesToContext,
} from "./src/session-transport.js";

export {
  query,
  isQueryPart,
  stringifyQueryPart,
  explainAnalyzeQuery,
} from "./src/query.js";

export { postgresTableSizes } from "./src/insight.js";

export { sendTransformedImage } from "./src/send-transformed-image.js";
