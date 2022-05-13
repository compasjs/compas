/**
 * @typedef {(
 *   file: StoreFile,
 *   start?: number | undefined,
 *   end?: number | undefined
 *   ) => Promise<{
 *     stream: NodeJS.ReadableStream,
 *     cacheControl: string,
 *   }>} GetStreamFn
 */
/**
 * Wraps 'server'.sendFile, to include an image transformer compatible with Next.js image
 * loader. Only works if the input file is an image. It caches the results on in the
 * file.meta.
 *
 * Supported extensions: image/png, image/jpeg, image/jpg, image/webp, image/avif,
 * image/gif. It does not supported 'animated' versions of image/webp and image/gif and
 * just sends those as is. See {@link FileType#mimeTypes} and {@link createOrUpdateFile}
 * to enforce this on file upload.
 *
 * Prefers to transform the image to `image/webp` or `image/avif` if the client supports
 * it.
 *
 * @param {typeof import("@compas/server").sendFile} sendFile
 * @param {import("koa").Context} ctx
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {import("../types/advanced-types").MinioClient} minio
 * @param {StoreFile} file
 * @param {GetStreamFn} getStreamFn
 * @returns {Promise<void>}
 */
export function sendTransformedImage(
  sendFile: typeof import("@compas/server").sendFile,
  ctx: import("koa").Context,
  sql: import("../types/advanced-types").Postgres,
  minio: import("../types/advanced-types").MinioClient,
  file: StoreFile,
  getStreamFn: GetStreamFn,
): Promise<void>;
export type GetStreamFn = (
  file: StoreFile,
  start?: number | undefined,
  end?: number | undefined,
) => Promise<{
  stream: NodeJS.ReadableStream;
  cacheControl: string;
}>;
//# sourceMappingURL=send-transformed-image.d.ts.map
