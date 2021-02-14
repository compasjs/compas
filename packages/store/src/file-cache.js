import { once } from "events";
import { createReadStream, createWriteStream, mkdirSync } from "fs";
import { pipeline as pipelineCallbacks, Readable } from "stream";
import { promisify } from "util";
import { isNil, pathJoin, streamToBuffer, uuid } from "@compas/stdlib";
import { getFileStream } from "./files.js";

const pipeline = promisify(pipelineCallbacks);

export class FileCache {
  static fileCachePath = `/tmp/compas-cache/${uuid()}/`;

  /**
   * @param {Postgres} sql
   * @param {minio.Client} minio
   * @param {string} bucketName
   * @param {FileCacheOptions} [options]
   */
  constructor(sql, minio, bucketName, options) {
    this.sql = sql;
    this.minio = minio;
    this.bucketName = bucketName;

    this.inMemoryThreshold = options?.inMemoryThreshold ?? 8 * 1024;
    this.cacheControlHeader = options?.cacheControlHeader ?? "max-age=1200";

    this.memoryCache = new Map();
    this.fileCache = new Set();

    /**
     * Pre-bind call to this#getFileStream
     *
     * @type {typeof FileCache#getFileStream}
     */
    this.getStreamFn = this.getFileStream.bind(this);

    // Create the directory synchronously
    // So we don't have to track if it was made or not
    mkdirSync(FileCache.fileCachePath, { recursive: true });
  }

  /**
   * @param {StoreFile} file
   * @param {number} [start]
   * @param {number} [end]
   * @returns {Promise<{ stream: ReadableStream, cacheControl: string }>}
   */
  getFileStream(file, start, end) {
    if (isNil(start) || start < 0) {
      start = 0;
    }
    if (isNil(end) || end > file.contentLength) {
      end = file.contentLength;
    }
    const cacheKey = file.id;

    if (this.memoryCache.has(cacheKey)) {
      return this.loadFromMemoryCache(cacheKey, start, end);
    } else if (this.fileCache.has(cacheKey)) {
      return this.loadFromDiskCache(cacheKey, file.id, start, end);
    } else if (file.contentLength > this.inMemoryThreshold) {
      return this.cacheFileOnDisk(cacheKey, file.id, start, end);
    }
    return this.cacheFileInMemory(cacheKey, file.id, start, end);
  }

  /**
   * @param {string} fileId
   */
  clear(fileId) {
    if (this.memoryCache.has(fileId)) {
      this.memoryCache.delete(fileId);
    }
    if (this.fileCache.has(fileId)) {
      this.fileCache.delete(fileId);
    }
  }

  /**
   * @private
   * @param {string} key
   * @param {number} start
   * @param {number} end
   */
  loadFromMemoryCache(key, start, end) {
    return {
      stream: Readable.from(this.memoryCache.get(key).slice(start, end)),
      cacheControl: this.cacheControlHeader,
    };
  }

  /**
   * Load file from disk, if not exists, will pull it in.
   *
   * @param key
   * @param id
   * @param start
   * @param end
   */
  async loadFromDiskCache(key, id, start, end) {
    try {
      const str = createReadStream(pathJoin(FileCache.fileCachePath, key), {
        start,
        end,
      });
      await once(str, "open");
      return {
        stream: str,
        cacheControl: this.cacheControlHeader,
      };
    } catch (e) {
      if (e?.code === "ENOENT") {
        return this.cacheFileOnDisk(key, id, start, end);
      }
      throw e;
    }
  }

  /**
   * Load file from memory.
   * Transforms the buffer to a stream for consistency
   *
   * @param key
   * @param id
   * @param start
   * @param end
   */
  async cacheFileInMemory(key, id, start, end) {
    const stream = await getFileStream(this.minio, this.bucketName, id);
    const buffer = await streamToBuffer(stream);

    this.memoryCache.set(key, buffer);

    return {
      stream: Readable.from(this.memoryCache.get(key).slice(start, end)),
      cacheControl: this.cacheControlHeader,
    };
  }

  /**
   * Save file on disk and return a new Readable
   *
   * @param key
   * @param id
   * @param start
   * @param end
   */
  async cacheFileOnDisk(key, id, start, end) {
    const path = pathJoin(FileCache.fileCachePath, key);
    await pipeline(
      await getFileStream(this.minio, this.bucketName, id),
      createWriteStream(pathJoin(FileCache.fileCachePath, key)),
    );

    this.fileCache.add(key);

    return {
      stream: createReadStream(path, { start, end }),
      cacheControl: this.cacheControlHeader,
    };
  }
}
