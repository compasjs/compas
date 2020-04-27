import { merge } from "@lbu/stdlib";
import minio from "minio";

/**
 * @param {object} opts
 * @return {minio.Client}
 */
export function newMinioClient(opts) {
  const config = {
    endPoint: process.env.MINIO_URI,
    port: process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : undefined,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: process.env.NODE_ENV === "production",
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
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {string} [filter]
 * @return {Promise<{name: string, prefix: string, size: number, etag: string,
 *   lastModified: Date}[]>}
 */
export async function listObjects(minio, bucketName, filter = "") {
  const result = [];
  return new Promise((resolve, reject) => {
    const str = minio.listObjects(bucketName, filter);

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

export { minio };
