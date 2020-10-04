import { createReadStream } from "fs";
import { uuid } from "@lbu/stdlib";
import mime from "mime-types";
import { storeQueries } from "./generated/queries.js";
import { listObjects } from "./minio.js";

const queries = {
  copyFile: (sql, targetId, targetBucket, sourceId, sourceBucket) => sql`
    INSERT INTO "fileStore" ("id", "bucketName", "contentType", "contentLength", "filename")
    SELECT ${targetId},
           ${targetBucket},
           "contentType",
           "contentLength",
           "filename"
    FROM "fileStore"
    WHERE id = ${sourceId}
      AND "bucketName" = ${sourceBucket}
    RETURNING id
  `,
};

/**
 * @param {Postgres} sql
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {StoreFileStoreInsertPartial_Input & { id?: string }} props
 * @param {ReadStream|string} streamOrPath
 * @returns {Promise<StoreFileStore>}
 */
export async function createOrUpdateFile(
  sql,
  minio,
  bucketName,
  props,
  streamOrPath,
) {
  if (!props.filename) {
    throw new Error("filename is required on file props");
  }

  if (!props.contentType) {
    props.contentType = mime.lookup(props.filename) || "*/*";
  }

  props.bucketName = bucketName;

  // Do a manual insert first to get an id
  if (!props.id) {
    props.contentLength = 0;
    const [intermediate] = await storeQueries.fileStoreInsert(sql, props);
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

  const [result] = await storeQueries.fileStoreUpdate(sql, props, {
    id: props.id,
  });

  return result;
}

/**
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {string} id
 * @param {number} [start]
 * @param {number} [end]
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
 * @param {Postgres} sql
 * @param {minio.Client} minio
 * @param {string} bucketName
 * @param {string} id
 * @param {string} [targetBucket=bucketName]
 * @returns {Promise<StoreFileStore>}
 */
export async function copyFile(
  sql,
  minio,
  bucketName,
  id,
  targetBucket = bucketName,
) {
  const [intermediate] = await queries.copyFile(
    sql,
    uuid(),
    targetBucket,
    id,
    bucketName,
  );

  await minio.copyObject(targetBucket, intermediate.id, `${bucketName}/${id}`);

  const [result] = await storeQueries.fileStoreSelect(sql, {
    id: intermediate.id,
  });

  return result;
}

/**
 * @param {Postgres} sql
 * @param {minio.Client} minio
 * @param {string} bucketName
 */
export async function syncDeletedFiles(sql, minio, bucketName) {
  const minioObjectsPromise = listObjects(minio, bucketName);
  const knownIds = await storeQueries.fileStoreSelect(sql, {
    bucketName: bucketName,
    deletedAtInclude: true,
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
