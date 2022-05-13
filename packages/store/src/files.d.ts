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
 * {@link sendTransformedImage}.
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
export function createOrUpdateFile(
  sql: import("../types/advanced-types").Postgres,
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
  props: {
    id?: undefined | string;
    contentLength?: number;
    bucketName?: string;
    contentType: string;
    name: string;
    meta?:
      | undefined
      | {
          transforms?: undefined | any;
          transformedFromOriginal?: undefined | string;
        }
      | object;
    createdAt?: undefined | Date;
    updatedAt?: undefined | Date;
    deletedAt?: undefined | Date;
  },
  source: NodeJS.ReadableStream | string | Buffer,
  {
    allowedContentTypes,
  }?:
    | {
        allowedContentTypes?: string[] | undefined;
      }
    | undefined,
): Promise<StoreFile>;
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
export function getFileStream(
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
  id: string,
  {
    start,
    end,
  }?:
    | {
        start?: number | undefined;
        end?: number | undefined;
      }
    | undefined,
): Promise<NodeJS.ReadableStream>;
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
export function copyFile(
  sql: import("../types/advanced-types").Postgres,
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
  id: string,
  targetBucket?: string | undefined,
): Promise<StoreFile>;
/**
 * File deletes should be done via `queries.storeFileDelete()`. By calling this
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
export function syncDeletedFiles(
  sql: import("../types/advanced-types").Postgres,
  minio: import("../types/advanced-types").MinioClient,
  bucketName: string,
): Promise<number>;
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
export function fileSignAccessToken(options: {
  fileId: string;
  signingKey: string;
  maxAgeInSeconds: number;
}): string;
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
export function fileVerifyAccessToken(options: {
  fileAccessToken: string;
  signingKey: string;
  expectedFileId: string;
}): void;
//# sourceMappingURL=files.d.ts.map
