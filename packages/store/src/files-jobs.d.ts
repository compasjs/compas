/**
 * Returns a {@link QueueWorkerHandler} that syncs the deleted files from Postgres to
 * S3. via {@link fileSyncDeletedWithObjectStorage}.
 *
 * Recommended interval: daily
 * Recommended cronExpression: 0 2 * * *
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {string} bucketName
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileCleanup(
  s3Client: import("@aws-sdk/client-s3").S3Client,
  bucketName: string,
): import("./queue-worker.js").QueueWorkerHandler;
/**
 * Returns a {@link QueueWorkerHandler} that populates `meta.width` and `meta.height`,
 * and also generates a `meta.placeholderImage` for the provided `fileId`. The
 * `compas.file.generatePlaceholderImage` job is inserted when
 * `fileCreateOrUpdate` is provided with the `schedulePlaceholderImageJob` option.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {string} bucketName
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileGeneratePlaceholderImage(
  s3Client: import("@aws-sdk/client-s3").S3Client,
  bucketName: string,
): import("./queue-worker.js").QueueWorkerHandler;
/**
 * Returns a {@link QueueWorkerHandler} that generates a trasnformed image for the
 * provided `fileId` and other settings. This job is inserted by
 * {@link fileSendTransformedImageResponse} when it encounters an not yet transformed
 * option combination.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileTransformImage(
  s3Client: import("@aws-sdk/client-s3").S3Client,
): import("./queue-worker.js").QueueWorkerHandler;
//# sourceMappingURL=files-jobs.d.ts.map
