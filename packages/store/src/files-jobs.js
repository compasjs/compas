import { eventStart, eventStop, streamToBuffer } from "@compas/stdlib";
import isAnimated from "is-animated";
import sharp from "sharp";
import { getFileStream, syncDeletedFiles } from "./files.js";
import { queries } from "./generated.js";
import { queryFile } from "./generated/database/file.js";
import { TRANSFORMED_CONTENT_TYPES } from "./send-transformed-image.js";

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

/**
 * Returns a {@link QueueWorkerHandler} that generates a `meta.placeholderImage` for the
 * provided `fileId`. The `compas.file.generatePlaceholderImage` job is inserted when
 * `createOrUpdateFile` is provided with the `schedulePlaceholderImageJob` option.
 *
 *
 * @param {import("../types/advanced-types.js").MinioClient} minioClient
 * @param {string} bucketName
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileGeneratePlaceholderImage(minioClient, bucketName) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("../types/advanced-types").Postgres} sql
   * @param {StoreJob} job
   * @returns {Promise<void>}
   */
  return async function jobFileGeneratePlaceholderImage(event, sql, job) {
    eventStart(event, "job.fileGeneratePlaceholderImage");

    const [file] = await queryFile({
      where: {
        id: job.data.fileId,
      },
    }).exec(sql);

    if (!TRANSFORMED_CONTENT_TYPES.includes(file?.contentType)) {
      // not supported
      eventStop(event);
      return;
    }

    const buffer = await streamToBuffer(
      await getFileStream(minioClient, bucketName, file.id),
    );

    if (isAnimated(buffer)) {
      eventStop(event);

      return;
    }

    const placeholderImageBuffer = await sharp(buffer)
      .rotate()
      .resize(10)
      .jpeg()
      .toBuffer();

    await queries.fileUpdate(sql, {
      update: {
        meta: {
          $set: {
            path: ["placeholderImage"],
            value: `data:image/jpeg;base64,${placeholderImageBuffer.toString(
              "base64",
            )}`,
          },
        },
      },
      where: {
        id: file.id,
      },
    });

    eventStop(event);
  };
}
