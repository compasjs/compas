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
 * Send a `StoreFile` instance from @compas/store as a `ctx` response.
 * Handles byte range requests as well. May need some improvements to set some better
 * cache headers.
 *
 * @since 0.1.0
 *
 * @param {import("koa").Context} ctx
 * @param {StoreFile} file
 * @param {GetStreamFn} getStreamFn
 * @returns {Promise<void>}
 */
export function sendFile(ctx: import("koa").Context, file: StoreFile, getStreamFn: GetStreamFn): Promise<void>;
export type GetStreamFn = (file: StoreFile, start?: number | undefined, end?: number | undefined) => Promise<{
    stream: NodeJS.ReadableStream;
    cacheControl: string;
}>;
//# sourceMappingURL=sendFile.d.ts.map