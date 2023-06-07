/**
 * Get the development config that works with the default `compas docker up` created
 * Minio container.
 *
 * Only use this container and default config when `!isProduction()`!
 *
 * @returns {Partial<import("@aws-sdk/client-s3").S3ClientConfig>}
 */
export function objectStorageGetDevelopmentConfig(): Partial<
  import("@aws-sdk/client-s3").S3ClientConfig
>;
/**
 * Create a new S3Client.
 *
 * @param {import("@aws-sdk/client-s3").S3ClientConfig} config
 * @returns {import("@aws-sdk/client-s3").S3Client}
 */
export function objectStorageCreateClient(
  config: import("@aws-sdk/client-s3").S3ClientConfig,
): import("@aws-sdk/client-s3").S3Client;
/**
 * Check if the supplied bucketName exists, else create it in the (optional) location.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 *   locationConstraint?: import("@aws-sdk/client-s3").BucketLocationConstraint
 * }} options
 * @returns {Promise<void>}
 */
export function objectStorageEnsureBucket(
  s3Client: import("@aws-sdk/client-s3").S3Client,
  options: {
    bucketName: string;
    locationConstraint?: import("@aws-sdk/client-s3").BucketLocationConstraint;
  },
): Promise<void>;
/**
 * Remove a bucket. Note that a bucket should be empty before it can be removed.
 * Pass `options.includeAllObjects` to remove any left over object in the bucket before
 * removing the bucket.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 *   includeAllObjects?: boolean,
 * }} options
 * @returns {Promise<void>}
 */
export function objectStorageRemoveBucket(
  s3Client: import("@aws-sdk/client-s3").S3Client,
  options: {
    bucketName: string;
    includeAllObjects?: boolean;
  },
): Promise<void>;
/**
 * Creates a listObjectsV2 async iterator.
 * Can be used like:
 * ```
 * for await (const objects of objectStorageListObjects(s3Client, { bucketName }) {
 *   // your code using `objects.Contents`;
 * }
 * ```
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 * }} options
 * @returns {ReturnType<typeof import("@aws-sdk/client-s3").paginateListObjectsV2>}
 */
export function objectStorageListObjects(
  s3Client: import("@aws-sdk/client-s3").S3Client,
  options: {
    bucketName: string;
  },
): ReturnType<typeof import("@aws-sdk/client-s3").paginateListObjectsV2>;
/**
 * Get a Readable stream for the specified `bucketName` and `objectKey` combination.
 * Normally, the objectKey is the same as `StoreFile#id`. You can also provide an
 * optional range, to support HTTP range requests, mostly used for video players.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 *   objectKey: string,
 *   range?: {
 *     start?: number,
 *     end?: number,
 *   },
 * }} options
 * @returns {Promise<NodeJS.ReadableStream>}
 */
export function objectStorageGetObjectStream(
  s3Client: import("@aws-sdk/client-s3").S3Client,
  options: {
    bucketName: string;
    objectKey: string;
    range?:
      | {
          start?: number | undefined;
          end?: number | undefined;
        }
      | undefined;
  },
): Promise<NodeJS.ReadableStream>;
//# sourceMappingURL=object-storage.d.ts.map
