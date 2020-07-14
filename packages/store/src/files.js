import { createReadStream } from "fs";
import { uuid } from "@lbu/stdlib";
import mime from "mime-types";
import { storeQueries } from "./generated/queries.js";
import { listObjects } from "./minio.js";

const queries = {
  copyFile: (sql, targetId, targetBucket, sourceId, sourceBucket) =>
    sql`INSERT INTO file_store (id, bucket_name, content_type, content_length, filename) SELECT ${targetId}, ${targetBucket}, content_type, content_length, filename FROM file_store WHERE id = ${sourceId} AND bucket_name = ${sourceBucket} RETURNING id`,
};

/**
 * @name FileStoreContext
 *
 * @typedef {object}
 * @property sql
 * @property {minio.Client} minio
 * @property {string} bucketName
 */

/**
 * @param sql
 * @param {minio.Client} minio
 * @param {string} bucketName
 */
export function newFileStoreContext(sql, minio, bucketName) {
  return {
    sql,
    minio,
    bucketName,
  };
}

/**
 * Create or update a file.
 * If you pass in a non-existent id, the function will not error, but also not update the
 * file
 *
 * @param {FileStoreContext} fc
 * @param {StoreFileStoreInsertPartial_Input & { id?: string }} props
 * @param {ReadStream|string} streamOrPath
 * @returns {Promise<StoreFileStore>}
 */
export async function createOrUpdateFile(fc, props, streamOrPath) {
  if (!props.filename) {
    throw new Error("filename is required on file props");
  }

  if (!props.contentType) {
    props.contentType = mime.lookup(props.filename) || "*/*";
  }

  props.bucketName = fc.bucketName;

  // Do a manual insert first to get an id
  if (!props.id) {
    props.contentLength = 0;
    const [intermediate] = await storeQueries.fileStoreInsert(fc.sql, props);
    props.id = intermediate.id;
  }

  if (typeof streamOrPath === "string") {
    streamOrPath = createReadStream(streamOrPath);
  }

  await fc.minio.putObject(fc.bucketName, props.id, streamOrPath, {
    "content-type": props.contentType,
  });
  const stat = await fc.minio.statObject(fc.bucketName, props.id);
  props.contentLength = stat.size;

  const [result] = await storeQueries.fileStoreUpdate(fc.sql, props, {
    id: props.id,
  });

  return result;
}

/**
 * @param {FileStoreContext} fc
 * @param {string} id
 * @returns {Promise<StoreFileStore|undefined>}
 */
export async function getFileById(fc, id) {
  const [result] = await storeQueries.fileStoreSelect(fc.sql, {
    id,
    bucketName: fc.bucketName,
  });

  return result;
}

/**
 * @param {FileStoreContext} fc
 * @param {string} id
 * @param {number} [start]
 * @param {number} [end]
 * @returns {Promise<ReadableStream>}
 */
export async function getFileStream(fc, id, { start, end } = {}) {
  if (start !== undefined || end !== undefined) {
    start = start || 0;
    const size = end === undefined ? 0 : end - start;

    return fc.minio.getPartialObject(fc.bucketName, id, start, size);
  } else {
    return fc.minio.getObject(fc.bucketName, id);
  }
}

/**
 * @param {FileStoreContext} fc
 * @param {string} id
 * @param {string} [targetBucket=fc.bucketName]
 * @returns {Promise<StoreFileStore>}
 */
export async function copyFile(fc, id, targetBucket = fc.bucketName) {
  const [intermediate] = await queries.copyFile(
    fc.sql,
    uuid(),
    targetBucket,
    id,
    fc.bucketName,
  );

  await fc.minio.copyObject(
    targetBucket,
    intermediate.id,
    `${fc.bucketName}/${id}`,
  );

  const [result] = await storeQueries.fileStoreSelect(fc.sql, {
    id: intermediate.id,
  });

  return result;
}

/**
 * @param fc
 * @param id
 */
export async function deleteFile(fc, id) {
  return storeQueries.fileStoreDelete(fc.sql, {
    id,
    bucketName: fc.bucketName,
  });
}

/**
 * @param fc
 */
export async function syncDeletedFiles(fc) {
  const minioObjectsPromise = listObjects(fc.minio, fc.bucketName);
  const knownIds = await storeQueries.fileStoreSelect(fc.sql, {
    bucketName: fc.bucketName,
  });

  const ids = knownIds.map((it) => it.id);

  const minioList = (await minioObjectsPromise).map((it) => it.name);

  const deletingSet = [];
  for (const item of minioList) {
    if (ids.indexOf(item) === -1) {
      deletingSet.push(item);
    }
  }

  await fc.minio.removeObjects(fc.bucketName, deletingSet);

  return deletingSet.length;
}
