import { createReadStream } from "fs";
import { uuid } from "@compas/stdlib";
import mime from "mime-types";
import { queries } from "./generated.js";
import { listObjects } from "./minio.js";

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
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {StoreFileInsertPartial} props
 * @param {ReadStream|string} streamOrPath
 * @returns {Promise<StoreFile>}
 */
export async function createOrUpdateFile(
  sql,
  minio,
  bucketName,
  props,
  streamOrPath,
) {
  if (!props.name) {
    throw new Error("name is required on file props");
  }

  if (!props.contentType) {
    props.contentType = mime.lookup(props.name) || "*/*";
  }

  props.bucketName = bucketName;

  // Do a manual insert first to get an id
  if (!props.id) {
    props.contentLength = 0;
    const [intermediate] = await queries.fileInsert(sql, props);
    props.id = intermediate.id;
  }

  if (typeof streamOrPath === "string") {
    streamOrPath = createReadStream(streamOrPath);
  }

  await minio.putObject(bucketName, props.id, streamOrPath, {
    "content-type": props.contentType,
  });
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
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {string} id
 * @param {{ start?: number|undefined, end?: number|undefined }} [seek={}]
 * @returns {Promise<ReadableStream>}
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

    return minio.getPartialObject(bucketName, id, start, size);
  }
  return minio.getObject(bucketName, id);
}

/**
 * Create both a Postgres record copy and an S3 object copy of the provided file id, into
 * the provided bucket.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {minio.Client} minio
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

  await minio.copyObject(targetBucket, intermediate.id, `${bucketName}/${id}`);

  const [result] = await queries.fileSelect(sql, {
    id: intermediate.id,
  });

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
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @returns {Promise<undefined>}
 */
export async function syncDeletedFiles(sql, minio, bucketName) {
  const minioObjectsPromise = listObjects(minio, bucketName);
  const knownIds = await queries.fileSelect(sql, {
    bucketName: bucketName,
    deletedAtIncludeNotNull: true,
  });

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
