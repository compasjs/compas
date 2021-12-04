import { createReadStream } from "fs";
import { AppError, isNil, uuid } from "@compas/stdlib";
import {
  fileTypeFromBuffer,
  fileTypeFromFile,
  fileTypeStream,
} from "file-type";
import mime from "mime-types";
import { queries } from "./generated.js";
import { queryFile } from "./generated/database/file.js";
import { listObjects } from "./minio.js";
import { query } from "./query.js";

/**
 * @typedef {import("../types/advanced-types").Postgres} Postgres
 */

/**
 * @typedef {import("../types/advanced-types").MinioClient} MinioClient
 */

const fileQueries = {
  copyFile: (sql, targetId, targetBucket, sourceId, sourceBucket) => sql`
    INSERT INTO "file" ("id", "bucketName", "contentType", "contentLength", "name", "meta")
    SELECT ${targetId},
           ${targetBucket},
           "contentType",
           "contentLength",
           "name",
           "meta"
    FROM "file"
    WHERE
      id = ${sourceId}
    AND "bucketName" = ${sourceBucket}
    RETURNING id
  `,
};

/**
 * Create or update a file. The file store is backed by a Postgres table and S3 object.
 * If no 'contentType' is passed, it is inferred from the 'magic bytes' from the source.
 * Defaulting to a wildcard.
 *
 * By passing in an `allowedContentTypes` array via the last options object, it is
 * possible to validate the inferred content type. This also overwrites the passed in
 * content type.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @param {{ id?: undefined | string;
 *  contentLength?: number;
 *  bucketName?: string;
 *  contentType: string;
 *  name: string;
 *  meta?:
 *    | undefined
 *    | {
 *        transforms?: undefined | any;
 *        transformedFromOriginal?: undefined | string;
 *      }
 *    | object;
 *  createdAt?: undefined | Date;
 *  updatedAt?: undefined | Date;
 *  deletedAt?: undefined | Date;
 * }} props
 * @param {NodeJS.ReadableStream|string|Buffer} source
 * @param {{
 *   allowedContentTypes?: string[]
 * }} [options]
 * @returns {Promise<StoreFile>}
 */
export async function createOrUpdateFile(
  sql,
  minio,
  bucketName,
  props,
  source,
  { allowedContentTypes } = {},
) {
  if (!props.name) {
    throw AppError.validationError("store.createOrUpdateFile.invalidName");
  }

  if (
    Array.isArray(allowedContentTypes) ||
    isNil(props.contentType) ||
    props.contentType === "*/*"
  ) {
    let contentType = undefined;

    if (source instanceof Uint8Array || source instanceof ArrayBuffer) {
      const result = await fileTypeFromBuffer(source);
      contentType = result?.mime;
    } else if (typeof source === "string") {
      const result = await fileTypeFromFile(source);
      contentType = result?.mime;
    } else if (
      typeof source?.pipe === "function" &&
      typeof source?._read === "function"
    ) {
      const sourceWithFileType = await fileTypeStream(source);

      // Set source to the new pass through stream created by `fileTypeStream`
      source = sourceWithFileType;
      contentType = sourceWithFileType.fileType?.mime;
    }

    props.contentType = contentType ?? mime.lookup(props.name) ?? "*/*";

    if (
      Array.isArray(allowedContentTypes) &&
      !allowedContentTypes.includes(props.contentType)
    ) {
      throw AppError.validationError(
        "store.createOrUpdateFile.invalidContentType",
        {
          found: props.contentType,
          allowed: allowedContentTypes,
        },
      );
    }
  }

  props.bucketName = bucketName;
  props.meta = props.meta ?? {};

  // Do a manual insert first to get an id
  if (!props.id) {
    props.contentLength = 0;
    // @ts-ignore
    const [intermediate] = await queries.fileInsert(sql, props);
    props.id = intermediate.id;
  }

  if (typeof source === "string") {
    source = createReadStream(source);
  }

  // @ts-ignore
  await minio.putObject(bucketName, props.id, source, {
    "content-type": props.contentType,
  });
  // @ts-ignore
  const stat = await minio.statObject(bucketName, props.id);
  props.contentLength = stat.size;

  const [result] = await queries.fileUpdate(sql, props, {
    id: props.id,
  });

  return result;
}

/**
 * Get a file stream based on the 'id'. It is expected that an object exists with the
 * 'id'. A 'start' and 'end' value can optionally be specified.
 *
 * @since 0.1.0
 *
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @param {string} id
 * @param {{ start?: number|undefined, end?: number|undefined }} [seek={}]
 * @returns {Promise<NodeJS.ReadableStream>}
 */
export async function getFileStream(
  minio,
  bucketName,
  id,
  { start, end } = {},
) {
  if (start !== undefined || end !== undefined) {
    start = start || 0;
    const size = end === undefined ? 0 : end - start;

    return await minio.getPartialObject(bucketName, id, start, size);
  }
  return await minio.getObject(bucketName, id);
}

/**
 * Create both a Postgres record copy and an S3 object copy of the provided file id, into
 * the provided bucket.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @param {string} id
 * @param {string} [targetBucket=bucketName]
 * @returns {Promise<StoreFile>}
 */
export async function copyFile(
  sql,
  minio,
  bucketName,
  id,
  targetBucket = bucketName,
) {
  const [intermediate] = await fileQueries.copyFile(
    sql,
    uuid(),
    targetBucket,
    id,
    bucketName,
  );

  // @ts-ignore
  await minio.copyObject(targetBucket, intermediate.id, `${bucketName}/${id}`);

  const [result] = await queryFile({
    where: {
      id: intermediate.id,
    },
  }).exec(sql);

  return result;
}

/**
 * File deletes should be done via `queries.storeFileDeletePermanent()`. By calling this
 * function, all files that don't exist in the database will be removed from the S3
 * bucket.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {MinioClient} minio
 * @param {string} bucketName
 * @returns {Promise<number>}
 */
export async function syncDeletedFiles(sql, minio, bucketName) {
  // Delete transformed copies of deleted files
  await queries.fileDeletePermanent(sql, {
    $raw: query`meta->>'transformedFromOriginal' IS NOT NULL AND NOT EXISTS (SELECT FROM "file" f2 WHERE f2.id = (meta->>'transformedFromOriginal')::uuid)`,
    deletedAtIncludeNotNull: true,
  });

  const minioObjectsPromise = listObjects(minio, bucketName);
  const knownIds = await queryFile({
    where: {
      bucketName: bucketName,
      deletedAtIncludeNotNull: true,
    },
  }).exec(sql);

  const ids = knownIds.map((it) => it.id);

  const minioList = (await minioObjectsPromise).map((it) => it.name);

  const deletingSet = [];
  for (const item of minioList) {
    if (ids.indexOf(item) === -1) {
      deletingSet.push(item);
    }
  }

  await minio.removeObjects(bucketName, deletingSet);

  return deletingSet.length;
}
