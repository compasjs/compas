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
 * @param {Partial<import("./generated/common/types").StoreFile> & Pick<import("./generated/common/types").StoreFile,
 *   "name">} props
 * @param {NodeJS.ReadableStream|string|Buffer} source
 * @returns {Promise<import("./generated/common/types").StoreFile>}
 */
export function fileCreateOrUpdate(
  sql: import("postgres").Sql,
  s3Client: import("@aws-sdk/client-s3").S3Client,
  options: {
    bucketName: string;
    allowedContentTypes?: string[];
    schedulePlaceholderImageJob?: boolean;
  },
  props: Partial<import("./generated/common/types").StoreFile> &
    Pick<import("./generated/common/types").StoreFile, "name">,
  source: NodeJS.ReadableStream | string | Buffer,
): Promise<import("./generated/common/types").StoreFile>;
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
export function fileSyncDeletedWithObjectStorage(
  sql: import("postgres").Sql,
  s3Client: import("@aws-sdk/client-s3").S3Client,
  options: {
    bucketName: string;
  },
): Promise<void>;
/**
 * Format a StoreFile, so it can be used in the response.
 *
 * @param {import("./generated/common/types").StoreFile} file
 * @param {object} options
 * @param {string} options.url
 * @param {{
 *   signingKey: string,
 *   maxAgeInSeconds: number,
 * }} [options.signAccessToken]
 * @returns {import("./generated/common/types").StoreFileResponse}
 */
export function fileFormatMetadata(
  file: import("./generated/common/types").StoreFile,
  options: {
    url: string;
    signAccessToken?:
      | {
          signingKey: string;
          maxAgeInSeconds: number;
        }
      | undefined;
  },
): import("./generated/common/types").StoreFileResponse;
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
export const TRANSFORMED_CONTENT_TYPES: string[];
//# sourceMappingURL=file.d.ts.map
