import { once } from "events";
import { createReadStream, createWriteStream } from "fs";
import { pipeline as pipelineCallbacks, Readable } from "stream";
import { promisify } from "util";
import { isNil, pathJoin } from "@lbu/stdlib";
import { getFileStream } from "./files.js";

const pipeline = promisify(pipelineCallbacks);

/**
 * @name FileCacheOptions
 *
 * @typedef {object}
 * @property {number} inMemoryThreshold Maximum byte size of a file to be stored in
 *   memory
 * @property {string} cacheControlHeader Customize default Cache-Control header to give
 *   back
 */

/**
 * @name FileCache
 *
 * @class
 * A relatively simple local file cache implementation.
 * Supports saving files in memory and on local disk
 * Files#contentLength smaller than the provided threshold will be stored in memory.
 * A file will always be cached in full, and then the range requests will be evaluated
 *   after The FileCache#clear does not remove files from disk, but will overwrite the
 *   file when added to the cache again
 *
 * FileCache#getFileStream is compatible with `sendFile` in @lbu/server
 */
export class FileCache {
  static fileCachePath = "/tmp";

  /**
   * Create a new file cache
   *
   * @param {FileStoreContext} fileStore
   * @param {FileCacheOptions} [options]
   */
  constructor(fileStore, options) {
    this.fileStore = fileStore;

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
  }

  /**
   * Get a file(part) from the cache.
   * If the file(part) does not exist, it will try to fetch it from the FileStore
   * If the file store throws an error / it doesn't exist, the error is propagated to the
   * caller
   *
   * @public
   * @param {StoreFileStore} file
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
    } else {
      return this.cacheFileInMemory(cacheKey, file.id, start, end);
    }
  }

  /**
   * Remove a file from cache, but not from local disk
   *
   * @public
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
    const buffers = [];
    await pipeline(await getFileStream(this.fileStore, id), async function* (
      transform,
    ) {
      for await (const chunk of transform) {
        buffers.push(chunk);
        yield chunk;
      }
    });

    this.memoryCache.set(key, Buffer.concat(buffers));

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
      await getFileStream(this.fileStore, id),
      createWriteStream(pathJoin(FileCache.fileCachePath, key)),
    );

    this.fileCache.add(key);

    return {
      stream: createReadStream(path, { start, end }),
      cacheControl: this.cacheControlHeader,
    };
  }
}
