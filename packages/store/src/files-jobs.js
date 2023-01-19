import { eventStart, eventStop, streamToBuffer } from "@compas/stdlib";
import isAnimated from "is-animated";
import sharp from "sharp";
import {
  fileSyncDeletedWithObjectStorage,
  TRANSFORMED_CONTENT_TYPES,
} from "./file.js";
import { queryFile } from "./generated/database/file.js";
import { queries } from "./generated.js";
import { objectStorageGetObjectStream } from "./object-storage.js";

/**
 * Returns a {@link QueueWorkerHandler} that syncs the deleted files from Postgres to
 * S3. via {@link fileSyncDeletedWithObjectStorage}.
 *
 * Recommended interval: daily
 * Recommended cronExpression: 0 2 * * *
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {string} bucketName
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileCleanup(s3Client, bucketName) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @returns {Promise<void>}
   */
  return async function jobFileCleanup(event, sql) {
    eventStart(event, "job.fileCleanup");

    await fileSyncDeletedWithObjectStorage(sql, s3Client, {
      bucketName,
    });
    eventStop(event);
  };
}

/**
 * Returns a {@link QueueWorkerHandler} that generates a `meta.placeholderImage` for the
 * provided `fileId`. The `compas.file.generatePlaceholderImage` job is inserted when
 * `fileCreateOrUpdate` is provided with the `schedulePlaceholderImageJob` option.
 *
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {string} bucketName
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileGeneratePlaceholderImage(s3Client, bucketName) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @param {import("./generated/common/types").StoreJob} job
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
      await objectStorageGetObjectStream(s3Client, {
        bucketName,
        objectKey: file.id,
      }),
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
