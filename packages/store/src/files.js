import { createReadStream } from "fs";
import { AppError, isNil, uuid } from "@compas/stdlib";
import {
  fileTypeFromBuffer,
  fileTypeFromFile,
  fileTypeStream,
} from "file-type";
import { decode, sign, verify } from "jws";
import mime from "mime-types";
import { queries } from "./generated.js";
import { queryFile } from "./generated/database/file.js";
import { listObjects } from "./minio.js";
import { query } from "./query.js";

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
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {import("../types/advanced-types").MinioClient} minio
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

  if (isNil(props.id)) {
    props.id = uuid();
    props.contentLength = 0;
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
      typeof source?.pipe === "function" && // @ts-ignore
      typeof source?._read === "function"
    ) {
      // @ts-ignore
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

  // @ts-ignore
  const [result] = await queries.fileUpsertOnId(sql, props);

  return result;
}

/**
 * Get a file stream based on the 'id'. It is expected that an object exists with the
 * 'id'. A 'start' and 'end' value can optionally be specified.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").MinioClient} minio
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
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {import("../types/advanced-types").MinioClient} minio
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
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {import("../types/advanced-types").MinioClient} minio
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

/**
 * Generate a signed string, based on the file id and the max age that it is allowed ot
 * be accessed.
 *
 * @see {fileVerifyAndDecodeAccessToken}
 *
 * @param {{
 *   fileId: string,
 *   signingKey: string,
 *   maxAgeInSeconds: number,
 * }} options
 * @returns {string}
 */
export function fileSignAccessToken(options) {
  if (
    typeof options.fileId !== "string" ||
    typeof options.signingKey !== "string" ||
    typeof options.maxAgeInSeconds !== "number"
  ) {
    throw AppError.serverError({
      message:
        "Incorrect arguments to 'fileSignAccessToken'. Expects fileId: string, signingKey: string, maxAgeInSeconds: number.",
    });
  }

  const d = new Date();
  d.setSeconds(d.getSeconds() + options.maxAgeInSeconds);

  return sign({
    header: {
      alg: "HS256",
      typ: "JWT",
    },
    secret: options.signingKey,
    payload: {
      fileId: options.fileId,
      exp: Math.floor(d.getTime() / 1000),
    },
  });
}

/**
 * Verify and decode the fileAccessToken returning the fileId that it was signed for.
 * Returns an Either<fileId: string, AppError>
 *
 * @see {fileSignAccessToken}
 *
 * @param {{
 *   fileAccessToken: string,
 *   signingKey: string,
 * }} options
 * @returns {import("@compas/stdlib").Either<string, import("@compas/stdlib").AppError>}
 */
export function fileVerifyAndDecodeAccessToken(options) {
  if (
    typeof options.fileAccessToken !== "string" ||
    typeof options.signingKey !== "string"
  ) {
    throw AppError.serverError({
      message:
        "Incorrect arguments to 'fileVerifyAndDecodeSignedAccessToken'. Expects fileAccessToken: string, signingKey: string.",
    });
  }

  const isValid = verify(options.fileAccessToken, "HS256", options.signingKey);

  if (!isValid) {
    return {
      error: AppError.validationError(
        "file.verifyAndDecodeAccessToken.invalidToken",
        {},
      ),
    };
  }

  const decoded = decode(options.fileAccessToken);

  if (decoded.payload.exp * 1000 < Date.now()) {
    return {
      error: AppError.validationError(
        `file.verifyAndDecodeAccessToken.expiredToken`,
      ),
    };
  }

  if (isNil(decoded.payload.fileId)) {
    return {
      error: AppError.validationError(
        `file.verifyAndDecodeAccessToken.invalidToken`,
      ),
    };
  }

  return {
    value: decoded.payload.fileId,
  };
}
