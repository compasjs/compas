/**
 * Create a minio client with the default environment variables as defaults.
 * Minio is an S3 compatible client, so can be used against any S3 compatible interface.
 *
 * @since 0.1.0
 *
 * @param {minio.ClientOptions} opts
 * @returns {import("../types/advanced-types").MinioClient}
 */
export function newMinioClient(
  opts: minio.ClientOptions,
): import("../types/advanced-types").MinioClient;
/**
 * Make sure a bucket exists and if it doesn't create it.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").MinioClient} minio
 * @param {string} bucketName
 * @param {string} region
 * @returns {Promise<void>}
 */
export function ensureBucket(
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
  region: string,
): Promise<void>;
/**
 * List all objects in a bucket.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").MinioClient} minio
 * @param {string} bucketName
 * @param {string} [filter]
 * @returns {Promise<{name: string, prefix: string, size: number, etag: string,
 *   lastModified: Date}[]>}
 */
export function listObjects(
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
  filter?: string | undefined,
): Promise<
  {
    name: string;
    prefix: string;
    size: number;
    etag: string;
    lastModified: Date;
  }[]
>;
/**
 * Remove the provided bucket name. Note that this will fail if a bucket has objects.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").MinioClient} minio
 * @param {string} bucketName
 * @returns {Promise<void>}
 */
export function removeBucket(
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
): Promise<void>;
/**
 * Force removal of a bucket by listing and removing it's objects.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").MinioClient} minio
 * @param {string} bucketName
 * @returns {Promise<void>}
 */
export function removeBucketAndObjectsInBucket(
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
): Promise<void>;
/**
 * Copy all objects from a bucket to the other bucket.
 * Batches the files in groups of 10 while copying.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").MinioClient} minio
 * @param {string} sourceBucket
 * @param {string} destinationBucket
 * @param {string} region
 * @returns {Promise<void>}
 */
export function copyAllObjects(
  minio: import("../types/advanced-types").MinioClient,
  sourceBucket: string,
  destinationBucket: string,
  region: string,
): Promise<void>;
export { minio };
import minio from "minio";
//# sourceMappingURL=minio.d.ts.map
