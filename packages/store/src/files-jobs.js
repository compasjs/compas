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
  TRANSFORMED_CONTENT_TYPES,
} from "./file.js";
import { queryFile } from "./generated/database/file.js";
import { queries } from "./generated.js";
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
 * Returns a {@link QueueWorkerHandler} that generates a `meta.placeholderImage` for the
 * provided `fileId`. The `compas.file.generatePlaceholderImage` job is inserted when
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
   * @param {import("./generated/common/types").StoreJob} job
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
    if (!TRANSFORMED_CONTENT_TYPES.includes(file?.contentType)) {
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

/**
 * Returns a {@link QueueWorkerHandler} that generates a trasnformed image for the
 * provided `fileId` and other settings. This job is inserted by {@link fileSendTransformedImageResponse} when it encounters an not yet transformed option combination.
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
   * @param {import("./generated/common/types").StoreJob} job
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

    const { width: currentWidth } = await sharpInstance.metadata();

    if (!isNil(currentWidth) && currentWidth > options.w) {
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
                                       ELSE jsonb_set(coalesce("meta", '{}'::jsonb), '{transforms}', '{}'::jsonb) END,
                                     ${`{transforms,${transformKey}}`}, ${JSON.stringify(
      newFileId,
    )}),
                  "updatedAt" = now()
                WHERE
                  id = ${fileId}`.exec(sql);
  }
}
