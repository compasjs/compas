import { environment, isProduction, merge } from "@compas/stdlib";
import minio from "minio";

/**
 * @param {object} opts
 * @returns {minio.Client}
 */
export function newMinioClient(opts) {
  const config = {
    endPoint: environment.MINIO_URI,
    port: environment.MINIO_PORT ? Number(environment.MINIO_PORT) : undefined,
    accessKey: environment.MINIO_ACCESS_KEY,
    secretKey: environment.MINIO_SECRET_KEY,
    useSSL: isProduction(),
  };
  return new minio.Client(merge(config, opts));
}

/**
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {string} region
 */
export async function ensureBucket(minio, bucketName, region) {
  const exists = await minio.bucketExists(bucketName);
  if (!exists) {
    await minio.makeBucket(bucketName, region);
  }
}

/**
 * List all objects in a bucket
 *
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {string} [filter]
 * @returns {Promise<{name: string, prefix: string, size: number, etag: string,
 *   lastModified: Date}[]>}
 */
export async function listObjects(minio, bucketName, filter = "") {
  const result = [];
  return new Promise((resolve, reject) => {
    const str = minio.listObjectsV2(bucketName, filter);

    str.once("end", () => resolve(result));
    str.on("data", (it) => {
      result.push(it);
    });
    str.once("error", (e) => reject(e));
  });
}

/**
 * @param {minio.Client} minio
 * @param {string} bucketName
 */
export async function removeBucket(minio, bucketName) {
  await minio.removeBucket(bucketName);
}

/**
 * @param {minio.Client} minio
 * @param {string} bucketName
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
 * @param {minio.Client} minio
 * @param {string} sourceBucket
 * @param {string} destinationBucket
 * @returns {Promise<void>}
 */
export async function copyAllObjects(minio, sourceBucket, destinationBucket) {
  await ensureBucket(minio, destinationBucket);
  const objects = await listObjects(minio, sourceBucket);

  const pArr = [];
  for (const object of objects) {
    pArr.push(
      minio.copyObject(
        destinationBucket,
        object.name,
        `${sourceBucket}/${object.name}`,
      ),
    );
  }

  await Promise.all(pArr);
}

export { minio };
