import {
  eventStart,
  eventStop,
  isNil,
  isPlainObject,
  streamToBuffer,
} from "@compas/stdlib";
import isAnimated from "is-animated";
import sharp from "sharp";
import {
  fileCreateOrUpdate,
  fileSyncDeletedWithObjectStorage,
  STORE_FILE_IMAGE_TYPES,
} from "./file.js";
import { queryFile } from "./generated/database/file.js";
import { objectStorageGetObjectStream } from "./object-storage.js";
import { query } from "./query.js";

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
 * Returns a {@link QueueWorkerHandler} that populates `meta.width` and `meta.height`,
 * and also generates a `meta.placeholderImage` for the provided `fileId`. The
 * `compas.file.generatePlaceholderImage` job is inserted when
 * `fileCreateOrUpdate` is provided with the `schedulePlaceholderImageJob` option.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {string} bucketName
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileGeneratePlaceholderImage(s3Client, bucketName) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @param {import("./generated/common/types.d.ts").StoreJob} job
   * @returns {Promise<void>}
   */
  return async function jobFileGeneratePlaceholderImage(event, sql, job) {
    eventStart(event, "job.fileGeneratePlaceholderImage");

    const [file] = await queryFile({
      where: {
        id: job.data.fileId,
      },
    }).execRaw(sql);

    // @ts-expect-error
    if (!STORE_FILE_IMAGE_TYPES.includes(file?.contentType)) {
      // not supported
      eventStop(event);
      return;
    }

    const buffer = await streamToBuffer(
      await objectStorageGetObjectStream(s3Client, {
        bucketName,

        // @ts-expect-error
        objectKey: file.id,
      }),
    );

    if (isAnimated(buffer)) {
      eventStop(event);

      return;
    }

    const sharpInstance = sharp(buffer).rotate();
    const metadata = await sharpInstance.metadata();

    const placeholderImageBuffer = await sharpInstance
      .resize(10)
      .jpeg()
      .toBuffer();

    // Set placeholderImage, originalWidth and originalHeight atomically.
    await query`UPDATE "file"
                SET
                  "meta" = jsonb_set(jsonb_set(
                                       jsonb_set("meta", '{placeholderImage}', ${`"data:image/jpeg;base64,${placeholderImageBuffer.toString(
                                         "base64",
                                       )}"`}::jsonb), '{originalHeight}',
                                       ${String(metadata.height)}::jsonb),
                                     '{originalWidth}', ${String(
                                       metadata.width,
                                     )}::jsonb)
                WHERE
                  id = ${file.id}`.exec(sql);

    eventStop(event);
  };
}

/**
 * Returns a {@link QueueWorkerHandler} that generates a trasnformed image for the
 * provided `fileId` and other settings. This job is inserted by
 * {@link fileSendTransformedImageResponse} when it encounters an not yet transformed
 * option combination.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobFileTransformImage(s3Client) {
  // Disable the Sharp cache. We shouldn't be hitting much of the same files.
  sharp.cache(false);

  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @param {import("./generated/common/types.d.ts").StoreJob} job
   * @returns {Promise<void>}
   */
  return async function jobFileTransformImage(event, sql, job) {
    eventStart(event, "job.fileTransformImage");

    const { fileId, transformKey, options } = job.data;

    if (isNil(fileId) || isNil(transformKey) || !isPlainObject(options)) {
      event.log.info({
        message: "Invalid file transform options",
        data: job.data,
      });

      eventStop(event);
      return;
    }

    const [file] = await queryFile({
      where: {
        id: job.data.fileId,
      },
    }).execRaw(sql);

    if (isNil(file)) {
      event.log.info({
        message: "Unknown fileId",
        data: job.data,
      });

      eventStop(event);
      return;
    }

    if (file.contentLength === 0 || file.contentType === "image/svg+xml") {
      // Empty file is an empty transform, SVG's are not supported
      // @ts-expect-error
      await atomicSetTransformKey(sql, file.id, transformKey, file.id);

      eventStop(event);
      return;
    }

    const buffer = await streamToBuffer(
      await objectStorageGetObjectStream(s3Client, {
        // @ts-expect-error
        bucketName: file.bucketName,

        // @ts-expect-error
        objectKey: file.id,
      }),
    );

    if (isAnimated(buffer)) {
      // Animated gifs can't be transformed
      // Empty file is an empty transform, SVG's are not supported
      // @ts-expect-error
      await atomicSetTransformKey(sql, file.id, transformKey, file.id);

      eventStop(event);
      return;
    }

    const sharpInstance = sharp(buffer);
    sharpInstance.rotate();

    const metadataPromise = sharpInstance.metadata();

    const originalWidth =
      file.meta?.originalWidth ?? (await metadataPromise).width;
    const originalHeight =
      file.meta?.originalHeight ?? (await metadataPromise).height;

    if (!isNil(originalWidth) && originalWidth > options.w) {
      // Only resize if width is greater than the needed with, so we don't upscale
      sharpInstance.resize(options.w);
    }

    if (options.contentType === "image/webp") {
      sharpInstance.webp({ quality: options.q });
    } else if (options.contentType === "image/avif") {
      sharpInstance.avif({ quality: options.q });
    } else if (options.contentType === "image/png") {
      sharpInstance.png({ quality: options.q });
    } else if (
      options.contentType === "image/jpg" ||
      options.contentType === "image/jpeg"
    ) {
      sharpInstance.jpeg({ quality: options.q });
    } else if (options.contentType === "image/gif") {
      sharpInstance.gif({});
    }

    const image = await fileCreateOrUpdate(
      sql,
      s3Client,
      {
        // @ts-expect-error
        bucketName: file.bucketName,
      },
      {
        name: transformKey,
        contentType: options.contentType,
        meta: {
          transformedFromOriginal: file.id,
        },
      },
      await sharpInstance.toBuffer(),
    );

    // @ts-expect-error
    await atomicSetTransformKey(sql, file.id, transformKey, image.id);

    if (
      (isNil(file.meta?.originalWidth) || isNil(file.meta?.originalHeight)) &&
      !isNil(originalWidth) &&
      !isNil(originalHeight)
    ) {
      // Update the original image to include the width and height.
      await query`UPDATE "file"
                  SET
                    "meta" = jsonb_set(jsonb_set("meta", '{originalHeight}', ${String(
                      originalHeight,
                    )}::jsonb), '{originalWidth}',
                                       ${String(originalWidth)}::jsonb)
                  WHERE
                    id = ${file.id}`.exec(sql);
    }

    eventStop(event);
  };

  /**
   * Atomically add a transform key
   *
   * @param {import("postgres").Sql<{}>} sql
   * @param {string} fileId
   * @param {string} transformKey
   * @param {string} newFileId
   * @returns {Promise<void>}
   */
  async function atomicSetTransformKey(sql, fileId, transformKey, newFileId) {
    await query`UPDATE "file"
                SET
                  "meta" = jsonb_set(CASE
                                       WHEN coalesce("meta", '{}'::jsonb) ? 'transforms'
                                         THEN "meta"
                                       ELSE jsonb_set(coalesce("meta", '{}'::jsonb),
                                                      '{transforms}', '{}'::jsonb) END,
                                     ${`{transforms,${transformKey}}`},
                                     ${JSON.stringify(newFileId)}),
                  "updatedAt" = now()
                WHERE
                  id = ${fileId}`.exec(sql);
  }
}
