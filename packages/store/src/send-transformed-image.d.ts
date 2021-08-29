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
 * @typedef {import("../types/advanced-types").Postgres} Postgres
 */
/**
 * @typedef {import("../types/advanced-types").MinioClient} MinioClient
 */
/**
 * @typedef {import("koa").Context} Context
 */
/**
 * Wraps 'server'.sendFile, to include an image transformer compatible with Next.js image
 * loader. Only works if the input file is an image.
 *
 * @param {typeof import("@compas/server").sendFile} sendFile
 * @param {Context} ctx
 * @param {Postgres} sql
 * @param {MinioClient} minio
 * @param {StoreFile} file
 * @param {GetStreamFn} getStreamFn
 * @returns {Promise<void>}
 */
export function sendTransformedImage(sendFile: typeof import("@compas/server").sendFile, ctx: Context, sql: Postgres, minio: MinioClient, file: StoreFile, getStreamFn: GetStreamFn): Promise<void>;
export type GetStreamFn = (file: StoreFile, start?: number | undefined, end?: number | undefined) => Promise<{
    stream: NodeJS.ReadableStream;
    cacheControl: string;
}>;
export type Postgres = import("../types/advanced-types").Postgres;
export type MinioClient = import("../types/advanced-types").MinioClient;
export type Context = import("koa").Context;
//# sourceMappingURL=send-transformed-image.d.ts.map