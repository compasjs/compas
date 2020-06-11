// File contains buckets used in this application

import { ensureBucket } from "@lbu/store";
import { minio } from "./index.js";
import { serviceLogger } from "./loggers.js";

export let appBucket = undefined;

/**
 * @param appBucketName
 */
export function setAppBucket(appBucketName) {
  serviceLogger.info("setting appBucket");
  appBucket = appBucketName;
  return appBucket;
}

/**
 * Make sure all buckets exists
 *
 * @param {string} region
 * @returns {Promise<void>}
 */
export async function ensureBuckets(region) {
  await ensureBucket(minio, appBucket, region);
}
