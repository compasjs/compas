import { environment, isProduction, merge } from "@compas/stdlib";
import minio from "minio";

/**
 * @typedef {import("../types/advanced-types").MinioClient} MinioClient
 */

/**
 * Create a minio client with the default environment variables as defaults.
 * Minio is an S3 compatible client, so can be used against any S3 compatible interface.
 *
 * @since 0.1.0
 *
 * @param {minio.ClientOptions} opts
 * @returns {MinioClient}
 */
export function newMinioClient(opts) {
  const config = /** @type {minio.ClientOptions} */ merge(
    {
      endPoint: environment.MINIO_URI,
      port: environment.MINIO_PORT ? Number(environment.MINIO_PORT) : undefined,
      accessKey: environment.MINIO_ACCESS_KEY,
      secretKey: environment.MINIO_SECRET_KEY,
      useSSL: isProduction(),
    },
    opts,
  );

  return new minio.Client(config);
}

/**
 * Make sure a bucket exists and if it doesn't create it.
 *
 * @since 0.1.0
 *
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @param {string} region
 * @returns {Promise<void>}
 */
export async function ensureBucket(minio, bucketName, region) {
  const exists = await minio.bucketExists(bucketName);
  if (!exists) {
    await minio.makeBucket(bucketName, region);
  }
}

/**
 * List all objects in a bucket.
 *
 * @since 0.1.0
 *
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @param {string} [filter]
 * @returns {Promise<{name: string, prefix: string, size: number, etag: string,
 *   lastModified: Date}[]>}
 */
export async function listObjects(minio, bucketName, filter = "") {
  const result = [];
  return await new Promise((resolve, reject) => {
    const str = minio.listObjectsV2(bucketName, filter);

    str.once("end", () => resolve(result));
    str.on("data", (it) => {
      result.push(it);
    });
    str.once("error", (e) => reject(e));
  });
}

/**
 * Remove the provided bucket name. Note that this will fail if a bucket has objects.
 *
 * @since 0.1.0
 *
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @returns {Promise<void>}
 */
export async function removeBucket(minio, bucketName) {
  await minio.removeBucket(bucketName);
}

/**
 * Force removal of a bucket by listing and removing it's objects.
 *
 * @since 0.1.0
 *
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @returns {Promise<void>}
 */
export async function removeBucketAndObjectsInBucket(minio, bucketName) {
  const remainingObjects = await listObjects(minio, bucketName);
  await minio.removeObjects(
    bucketName,
    remainingObjects.map((it) => it.name),
  );
  return removeBucket(minio, bucketName);
}

/**
 * Copy all objects from a bucket to the other bucket.
 * Batches the files in groups of 10 while copying.
 *
 * @since 0.1.0
 *
 * @param {MinioClient} minio
 * @param {string} sourceBucket
 * @param {string} destinationBucket
 * @param {string} region
 * @returns {Promise<void>}
 */
export async function copyAllObjects(
  minio,
  sourceBucket,
  destinationBucket,
  region,
) {
  await ensureBucket(minio, destinationBucket, region);
  const objects = await listObjects(minio, sourceBucket);

  while (objects.length) {
    const subset = objects.splice(0, 10);

    const pArr = [];
    for (const object of subset) {
      pArr.push(
        // @ts-ignore
        minio.copyObject(
          destinationBucket,
          object.name,
          `${sourceBucket}/${object.name}`,
        ),
      );
    }
    await Promise.all(pArr);
  }
}

export { minio };
