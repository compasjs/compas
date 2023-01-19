/**
 * Send a `StoreFile` instance as a `ctx` response.
 * Handles byte range requests as well. May need some improvements to set some better
 * cache headers.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {import("koa").Context} ctx
 * @param {import("./generated/common/types").StoreFile} file
 * @param {{
 *   cacheControlHeader?: string,
 * }} [options]
 * @returns {Promise<void>}
 */
export function fileSendResponse(
  s3Client: import("@aws-sdk/client-s3").S3Client,
  ctx: import("koa").Context,
  file: import("./generated/common/types").StoreFile,
  options?:
    | {
        cacheControlHeader?: string | undefined;
      }
    | undefined,
): Promise<void>;
/**
 * Wraps {@link fileSendResponse}, to include an image transformer compatible with Next.js
 * image loader. Only works if the input file is an image. It caches the results on in
 * the file.meta.
 *
 * Supported extensions: image/png, image/jpeg, image/jpg, image/webp, image/avif,
 * image/gif. It does not supported 'animated' versions of image/webp and image/gif and
 * just sends those as is. See {@link FileType#mimeTypes} and {@link fileCreateOrUpdate}
 * to enforce this on file upload.
 *
 * Prefers to transform the image to `image/webp` or `image/avif` if the client supports
 * it.
 *
 * @param {import("postgres").Sql} sql
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {import("koa").Context} ctx
 * @param {import("./generated/common/types").StoreFile} file
 * @param {{
 *   cacheControlHeader?: string,
 * }} [options]
 * @returns {Promise<void>}
 */
export function fileSendTransformedImageResponse(
  sql: import("postgres").Sql,
  s3Client: import("@aws-sdk/client-s3").S3Client,
  ctx: import("koa").Context,
  file: import("./generated/common/types").StoreFile,
  options?:
    | {
        cacheControlHeader?: string | undefined;
      }
    | undefined,
): Promise<void>;
//# sourceMappingURL=file-send.d.ts.map
