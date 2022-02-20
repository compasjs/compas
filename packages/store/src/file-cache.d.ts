export class FileCache {
  static fileCachePath: string;
  /**
   * @param {import("../types/advanced-types").Postgres} sql
   * @param {import("../types/advanced-types").MinioClient} minio
   * @param {string} bucketName
   * @param {{
   *   cacheControlHeader?: string,
   *   inMemoryThreshold?: number,
   * }} [options]
   */
  constructor(
    sql: import("../types/advanced-types").Postgres,
    minio: import("../types/advanced-types").MinioClient,
    bucketName: string,
    options?:
      | {
          cacheControlHeader?: string | undefined;
          inMemoryThreshold?: number | undefined;
        }
      | undefined,
  );
  sql: import("../types/advanced-types").Postgres;
  minio: import("minio").Client;
  bucketName: string;
  inMemoryThreshold: number;
  cacheControlHeader: string;
  memoryCache: Map<any, any>;
  fileCache: Set<any>;
  /**
   * Pre-bind call to this#getFileStream
   *
   * @type {FileCache["getFileStream"]}
   */
  getStreamFn: FileCache["getFileStream"];
  /**
   * @private
   * @param {StoreFile} file
   * @param {number} [start]
   * @param {number} [end]
   * @returns {Promise<{ stream: NodeJS.ReadableStream, cacheControl: string }>}
   */
  private getFileStream;
  /**
   * @param {string} fileId
   */
  clear(fileId: string): void;
  /**
   * @private
   * @param {string} key
   * @param {number} start
   * @param {number} end
   */
  private loadFromMemoryCache;
  /**
   * Load file from disk, if not exists, will pull it in.
   *
   * @private
   *
   * @param key
   * @param id
   * @param start
   * @param end
   */
  private loadFromDiskCache;
  /**
   * Load file from memory.
   * Transforms the buffer to a stream for consistency
   *
   * @private
   *
   * @param {string} key
   * @param {string} id
   * @param {number} start
   * @param {number} end
   * @returns {Promise<{
   *    stream: NodeJS.ReadableStream,
   *    cacheControl: string,
   * }>}
   */
  private cacheFileInMemory;
  /**
   * Save file on disk and return a new Readable
   *
   * @private
   *
   * @param key
   * @param id
   * @param start
   * @param end
   */
  private cacheFileOnDisk;
}
//# sourceMappingURL=file-cache.d.ts.map
