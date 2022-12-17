import { createReadStream } from "fs";
import { DeleteObjectsCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
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
import { objectStorageListObjects } from "./object-storage.js";
import { query } from "./query.js";
import { queueWorkerAddJob } from "./queue-worker.js";

export const TRANSFORMED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
];

/**
 * Create or update a file. The file store is backed by a Postgres table and S3 object.
 * If no 'contentType' is passed, it is inferred from the 'magic bytes' from the source.
 * Defaulting to a wildcard.
 *
 * By passing in an `allowedContentTypes` array via the last options object, it is
 * possible to validate the inferred content type. This also overwrites the passed in
 * content type.
 *
 * You can set `allowedContentTypes` to `image/png, image/jpeg, image/jpg, image/webp,
 * image/avif, image/gif` if you only want to accept files that can be sent by
 * {@link fileSendTransformedImageResponse}.
 *
 * @param {import("postgres").Sql} sql
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 *   allowedContentTypes?: string[],
 *   schedulePlaceholderImageJob?: boolean,
 * }} options
 * @param {Partial<StoreFile> & Pick<StoreFile, "name">} props
 * @param {NodeJS.ReadableStream|string|Buffer} source
 * @returns {Promise<StoreFile>}
 */
export async function fileCreateOrUpdate(
  sql,
  s3Client,
  options,
  props,
  source,
) {
  if (!props?.name) {
    throw AppError.validationError(`file.createOrUpdate.invalidName`);
  }

  if (isNil(source)) {
    throw AppError.validationError(`file.createOrUpdate.missingSource`);
  }

  if (isNil(props.id)) {
    // Generate a random id if none specified. The user can also specify a random ID
    // since we use upsert below.
    props.id = uuid();
  }

  props.contentLength = props.contentLength ?? 0;

  // Since the client can lie to us, we can try to find the used content-type and save
  // that.
  if (
    Array.isArray(options.allowedContentTypes) ||
    isNil(props.contentType) ||
    props.contentType === "*/*"
  ) {
    const deduceResult = await fileCheckContentType(options, props, source);
    props.contentType = deduceResult.contentType;
    source = deduceResult.source ?? source;
  }

  props.bucketName = options.bucketName;
  props.meta = props.meta ?? {};

  if (typeof source === "string") {
    source = createReadStream(source);
  }

  const upload = new Upload({
    client: s3Client,
    params: {
      Key: props.id,
      Bucket: props.bucketName,
      ContentType: props.contentType,
      Body: source,
    },
  });

  await upload.done();

  const headResult = await s3Client.send(
    new HeadObjectCommand({
      Bucket: props.bucketName,
      Key: props.id,
    }),
  );

  props.contentLength = headResult.ContentLength;

  // @ts-expect-error
  const [result] = await queries.fileUpsertOnId(sql, props);

  if (
    options.schedulePlaceholderImageJob &&
    TRANSFORMED_CONTENT_TYPES.includes(props.contentType ?? "")
  ) {
    await queueWorkerAddJob(sql, {
      name: "compas.file.generatePlaceholderImage",
      data: {
        fileId: result.id,
      },
    });
  }

  return result;
}

/**
 * Infer the contentType and check against the allowed content types.
 * This checks the magic bytes of the provided source to deduce the content type.
 *
 * @param {{
 *   bucketName: string,
 *   allowedContentTypes?: string[],
 *   schedulePlaceholderImageJob?: boolean,
 * }} options
 * @param {Partial<StoreFile> & Pick<StoreFile, "name">} props
 * @param {NodeJS.ReadableStream|string|Buffer} source
 * @returns {Promise<{
 *   source: NodeJS.ReadableStream|string|Buffer,
 *   contentType: string,
 * }>}
 */
async function fileCheckContentType(options, props, source) {
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

  contentType = contentType ?? mime.lookup(props.name) ?? "*/*";

  if (
    Array.isArray(options.allowedContentTypes) &&
    !options.allowedContentTypes.includes(contentType)
  ) {
    throw AppError.validationError("file.createOrUpdate.invalidContentType", {
      found: contentType,
      allowed: options.allowedContentTypes,
    });
  }

  return {
    source,
    contentType,
  };
}

/**
 * File deletes should be done via `queries.storeFileDelete()`. By calling this
 * function, all files that don't exist in the database will be removed from the S3
 * bucket
 *
 * @param {import("postgres").Sql} sql
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 * }} options
 * @returns {Promise<void>}
 */
export async function fileSyncDeletedWithObjectStorage(sql, s3Client, options) {
  // Delete transformations where the original is already removed
  await queries.fileDelete(sql, {
    $raw: query`meta->>'transformedFromOriginal' IS NOT NULL AND NOT EXISTS (SELECT FROM "file" f2 WHERE f2.id = (meta->>'transformedFromOriginal')::uuid)`,
  });

  const objectsInStore = (
    await queryFile({
      select: ["id"],
      where: {
        bucketName: options.bucketName,
      },
    }).exec(sql)
  ).map((it) => it.id);

  const deletingSet = [];

  for await (const part of objectStorageListObjects(s3Client, {
    bucketName: options.bucketName,
  })) {
    for (const obj of part?.Contents ?? []) {
      if (!obj.Key) {
        continue;
      }

      if (objectsInStore.includes(obj.Key)) {
        continue;
      }

      deletingSet.push({
        Key: obj.Key,
      });
    }
  }

  if (deletingSet.length === 0) {
    return;
  }

  // S3 supports up to 1000 deletions in a single request
  const maxSetSize = 999;
  const deleteCommands = [];

  while (deletingSet.length) {
    deleteCommands.push({
      Bucket: options.bucketName,
      Delete: {
        Objects: deletingSet.splice(0, maxSetSize),
      },
    });
  }

  await Promise.all(
    deleteCommands.map((it) => s3Client.send(new DeleteObjectsCommand(it))),
  );
}

/**
 * Format a StoreFile, so it can be used in the response.
 *
 * @param {StoreFile} file
 * @param {object} options
 * @param {string} options.url
 * @param {{
 *   signingKey: string,
 *   maxAgeInSeconds: number,
 * }} [options.signAccessToken]
 * @returns {StoreFileResponse}
 */
export function fileFormatMetadata(file, options) {
  if (!options.url) {
    throw AppError.serverError({
      message: `'fileFormatResponse' requires that the url is provided.`,
    });
  }

  if (options.signAccessToken) {
    options.url += `?accessToken=${fileSignAccessToken({
      fileId: file.id,
      maxAgeInSeconds: options.signAccessToken.maxAgeInSeconds,
      signingKey: options.signAccessToken.signingKey,
    })}`;
  } else {
    options.url += `?v=${file.id}`;
  }

  return {
    id: file.id,
    name: file.name,
    contentType: file.contentType,
    altText: file.meta?.altText,
    placeholderImage: file.meta?.placeholderImage,
    url: options.url,
  };
}

/**
 * Generate a signed string, based on the file id and the max age that it is allowed ot
 * be accessed.
 *
 * @see {fileVerifyAccessToken}
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
 *   expectedFileId: string,
 * }} options
 * @returns {void}
 */
export function fileVerifyAccessToken(options) {
  if (
    typeof options.fileAccessToken !== "string" ||
    typeof options.signingKey !== "string" ||
    typeof options.expectedFileId !== "string" ||
    !options.fileAccessToken ||
    !options.signingKey
  ) {
    throw AppError.serverError({
      message:
        "Incorrect arguments to 'fileVerifyAndDecodeSignedAccessToken'. Expects fileAccessToken: string, signingKey: string.",
    });
  }

  let isValid;
  try {
    isValid = verify(options.fileAccessToken, "HS256", options.signingKey);
  } catch {
    isValid = false;
  }

  if (!isValid) {
    throw AppError.validationError(
      "file.verifyAndDecodeAccessToken.invalidToken",
      {},
    );
  }

  const decoded = decode(options.fileAccessToken);

  if (decoded.payload.exp * 1000 < Date.now()) {
    throw AppError.validationError(
      `file.verifyAndDecodeAccessToken.expiredToken`,
    );
  }

  if (decoded.payload.fileId !== options.expectedFileId) {
    throw AppError.validationError(
      `file.verifyAndDecodeAccessToken.invalidToken`,
    );
  }
}
