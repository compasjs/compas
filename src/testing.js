import { mkdir, rm } from "node:fs/promises";
import { threadId } from "node:worker_threads";
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
 * A temporary directory to write files to. Automatically accounts for multiple threads
 * when running in tests.
 *
 * @type {string}
 */
export let testTemporaryDirectory = ".cache/tmp";

/**
 * Inject services that can be used in tests across this repo.
 *
 * @returns {Promise<void>}
 */
export async function injectTestServices() {
  sql = await createTestPostgresDatabase({});

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

  testTemporaryDirectory = `.cache/tmp/${threadId}`;
  await mkdir(testTemporaryDirectory, { recursive: true });
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

  await rm(testTemporaryDirectory, { recursive: true, force: true });
}
