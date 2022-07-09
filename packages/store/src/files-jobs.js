import { eventStart, eventStop } from "@compas/stdlib";
import { syncDeletedFiles } from "./files.js";

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
export function jobFileCleanup(minioClient, bucketName) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("../types/advanced-types").Postgres} sql
   * @returns {Promise<void>}
   */
  return async function jobFileCleanup(event, sql) {
    eventStart(event, "job.fileCleanup");

    await syncDeletedFiles(sql, minioClient, bucketName);

    eventStop(event);
  };
}
