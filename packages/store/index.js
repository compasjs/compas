/**
 * @typedef {import("postgres").Sql<{}>} Postgres
 */

/**
 * @typedef {import("@aws-sdk/client-s3").S3Client} S3Client
 */

/**
 * @template [T=any]
 * @typedef {import("./types/advanced-types.js").QueryPart<T>} QueryPart
 */

/**
 * @typedef {import("./types/advanced-types.js").QueryPartArg} QueryPartArg
 */

/**
 * @template Type
 * @typedef {import("./types/advanced-types.js").WrappedQueryPart<Type>} WrappedQueryPart
 */

/**
 * @template Type
 * @typedef {import("./types/advanced-types.js").WrappedQueryResult<Type>} WrappedQueryResult
 */

/**
 * @template Base
 * @template Expansion
 * @typedef {import("./types/advanced-types.js").QueryBuilderDefinition<Base, Expansion>} QueryBuilderDefinition
 */

/**
 * @template DefinitionType
 * @template QueryBuilder
 * @template {string} OptionalJoins
 * @typedef {import("./types/advanced-types.js").QueryBuilderResolver<DefinitionType, QueryBuilder, OptionalJoins>} QueryBuilderResolver
 */

/**
 * @template Expansion
 * @typedef {import("./types/advanced-types.js").ResolveOptionalJoins<Expansion>} ResolveOptionalJoins
 */

/**
 * @typedef {import("./src/session-store.js").SessionStoreSettings} SessionStoreSettings
 */

/**
 * @typedef {import("./src/session-transport.js").SessionTransportSettings}
 *   SessionTransportSettings
 */

export { storeGetStructure } from "./src/structure.js";

export { setStoreQueries } from "./src/generated.js";

export {
  generatedWhereBuilderHelper,
  generatedUpdateHelper,
  generatedQueryBuilderHelper,
} from "./src/generator-helpers.js";

export { newPostgresConnection, postgres } from "./src/postgres.js";

export {
  objectStorageGetDevelopmentConfig,
  objectStorageCreateClient,
  objectStorageEnsureBucket,
  objectStorageRemoveBucket,
  objectStorageListObjects,
  objectStorageGetObjectStream,
} from "./src/object-storage.js";

export {
  STORE_FILE_IMAGE_TYPES,
  fileCreateOrUpdate,
  fileTransformInPlace,
  fileFormatMetadata,
  fileVerifyAccessToken,
  fileSignAccessToken,
  fileSyncDeletedWithObjectStorage,
} from "./src/file.js";

export {
  fileSendResponse,
  fileSendTransformedImageResponse,
} from "./src/file-send.js";

export {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
  cleanupPostgresDatabaseTemplate,
} from "./src/testing.js";

export {
  migrationsInitContext,
  migrationsGetInfo,
  migrationsRun,
  migrationsRebuildState,
} from "./src/migrations.js";

export {
  jobFileCleanup,
  jobFileGeneratePlaceholderImage,
  jobFileTransformImage,
} from "./src/files-jobs.js";

export {
  queueWorkerAddJob,
  queueWorkerRegisterCronJobs,
  queueWorkerCreate,
} from "./src/queue-worker.js";
export { jobQueueInsights, jobQueueCleanup } from "./src/queue-worker-jobs.js";

export {
  SESSION_STORE_POTENTIAL_LEAKED_SESSION_JOB_NAME,
  sessionStoreCreate,
  sessionStoreGet,
  sessionStoreUpdate,
  sessionStoreInvalidate,
  sessionStoreRefreshTokens,
  sessionStoreCleanupExpiredSessions,
} from "./src/session-store.js";
export {
  jobSessionStoreCleanup,
  jobSessionStoreProcessLeakedSession,
} from "./src/session-store-jobs.js";

export { sessionTransportLoadFromContext } from "./src/session-transport.js";

export {
  query,
  isQueryPart,
  stringifyQueryPart,
  explainAnalyzeQuery,
} from "./src/query.js";

export { postgresTableSizes } from "./src/insight.js";
