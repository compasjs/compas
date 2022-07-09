/**
 * Returns a {@link QueueWorkerHandler} that syncs the deleted files from Postgres to
 * Minio. via {@link syncDeletedFiles}.
 *
 * Recommended interval: daily
 * Recommended cronExpression: 0 2 * * *
 *
 * @param {import("../types/advanced-types.js").MinioClient} minioClient
 * @param {string} bucketName
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileCleanup(
  minioClient: import("../types/advanced-types.js").MinioClient,
  bucketName: string,
): import("./queue-worker.js").QueueWorkerHandler;
//# sourceMappingURL=files-jobs.d.ts.map
