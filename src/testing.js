import { uuid } from "@compas/stdlib";
import {
  createTestPostgresDatabase,
  objectStorageCreateClient,
  objectStorageEnsureBucket,
  objectStorageGetDevelopmentConfig,
  objectStorageRemoveBucket,
} from "@compas/store";

/**
 * @type {import("@compas/store").Postgres}
 */
export let sql;

/**
 * @type {import("@compas/store").S3Client}
 */
export let s3Client;

/**
 * @type {string}
 */
export const testBucketName = uuid();

/**
 * Inject services that can be used in tests across this repo.
 *
 * @returns {Promise<void>}
 */
export async function injectTestServices() {
  sql = await createTestPostgresDatabase({
    onnotice: () => {},
  });

  s3Client = objectStorageCreateClient(objectStorageGetDevelopmentConfig());

  await objectStorageEnsureBucket(s3Client, {
    bucketName: testBucketName,
    locationConstraint: "eu-central-1",
  });

  // Check the offset between system time and Postgres (Docker VM) time.
  // sql.systemTimeOffset is the amount of milliseconds system is ahead of Docker
  const [result] =
    await sql`SELECT now() AS db, ${new Date()}::timestamptz AS js`;
  sql.systemTimeOffset =
    new Date(result.js).getTime() - new Date(result.db).getTime();
}

/**
 * Destroy services that are used for testing
 *
 * @returns {Promise<void>}
 */
export async function destroyTestServices() {
  await sql.end({});
  await objectStorageRemoveBucket(s3Client, {
    bucketName: testBucketName,
    includeAllObjects: true,
  });
}
