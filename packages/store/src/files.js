import { uuid } from "@lbu/stdlib";
import { createReadStream } from "fs";
import mime from "mime-types";
import { listObjects } from "./minio.js";

/**
 * @typedef {object} FileStoreContext
 * @property {postgres} sql
 * @property {minio.Client} minio
 * @property {string} bucketName
 */

/**
 * @typedef {object} FileProps
 * @property {string} [id]
 * @property {string} bucket_name
 * @property {number} content_length
 * @property {string} content_type
 * @property {string} filename
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @param {postgres} sql
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
 * Create or update a file
 * @param {FileStoreContext} fc
 * @param {FileProps} props
 * @param {ReadStream|string} streamOrPath
 * @return {Promise<FileProps>}
 */
export async function createFile(fc, props, streamOrPath) {
  if (!props.id) {
    props.id = uuid();
  }
  if (!props.filename) {
    throw new Error("filename is required on file props");
  }
  if (!props.content_type) {
    props.content_type = mime.lookup(props.filename);
  }
  props.updated_at = new Date();
  props.bucket_name = fc.bucketName;

  if (typeof streamOrPath === "string") {
    streamOrPath = createReadStream(streamOrPath);
  }

  await fc.minio.putObject(fc.bucketName, props.id, streamOrPath, {
    "content-type": props.content_type,
  });
  const stat = await fc.minio.statObject(fc.bucketName, props.id);
  props.content_length = stat.size;

  const [result] = await fc.sql`INSERT INTO file_store ${fc.sql(
    props,
    "id",
    "bucket_name",
    "content_length",
    "content_type",
    "filename",
    "updated_at",
  )} ON CONFLICT(id) DO UPDATE SET ${fc.sql(
    props,
    "content_length",
    "content_type",
    "filename",
    "updated_at",
  )} RETURNING *`;

  return result;
}

/**
 * @param {FileStoreContext} fc
 * @param {string} id
 * @return {Promise<FileProps|undefined>}
 */
export async function getFileById(fc, id) {
  const [
    result,
  ] = await fc.sql`SELECT id, bucket_name, content_type, content_length, filename, created_at, updated_at FROM file_store WHERE id = ${id} AND bucket_name = ${fc.bucketName}`;

  return result;
}

/**
 * @param {FileStoreContext} fc
 * @param {string} id
 * @param {number} [start]
 * @param {number} [end]
 * @return {Promise<ReadableStream>}
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
 * @return {Promise<FileProps>}
 */
export async function copyFile(fc, id, targetBucket = fc.bucketName) {
  const [
    result,
  ] = await fc.sql`INSERT INTO file_store (id, bucket_name, content_type, content_length, filename) SELECT ${uuid()}, ${targetBucket}, content_type, content_length, filename FROM file_store WHERE id = ${id} AND bucket_name = ${
    fc.bucketName
  } RETURNING *`;

  await fc.minio.copyObject(targetBucket, result.id, `${fc.bucketName}/${id}`);

  return result;
}

export async function deleteFile(fc, id) {
  return fc.sql`DELETE FROM file_store WHERE id = ${id} AND bucket_name = ${fc.bucketName}`;
}

export async function syncDeletedFiles(fc) {
  const minioObjectsPromise = listObjects(fc.minio, fc.bucketName);
  const knownIds = await fc.sql`SELECT DISTINCT(id)
                                FROM file_store WHERE bucket_name = ${fc.bucketName}`;

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
