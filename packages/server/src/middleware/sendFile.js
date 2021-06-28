import { isNil } from "@compas/stdlib";

/**
 * Send a `StoreFile` instance from @compas/store as a `ctx` response.
 * Handles byte range requests as well. May need some improvements to set some better
 * cache headers.
 *
 * @since 0.1.0
 *
 * @param {Context} ctx
 * @param {SendFileItem} file
 * @param {GetStreamFn} getStreamFn
 * @returns {Promise<undefined>}
 */
export async function sendFile(ctx, file, getStreamFn) {
  ctx.set("Accept-Ranges", "bytes");
  ctx.set("Last-Modified", file.updatedAt || file.lastModified);
  ctx.type = file.contentType;

  if (ctx.headers["if-modified-since"]?.length > 0) {
    const dateValue = new Date(ctx.headers["if-modified-since"]);
    const currentDate = new Date(file.updatedAt ?? file.lastModified);

    // Weak validation ignores the milli-seconds part, hence 'weak'.
    currentDate.setMilliseconds(0);

    if (dateValue.getTime() === currentDate.getTime()) {
      // File is not modified
      ctx.status = 304;
      return;
    }
  }

  if (ctx.headers.range) {
    try {
      const rangeHeader = ctx.headers.range;
      const range = /=(\d*)-(\d*)$/.exec(rangeHeader);

      let start = range[1] ? parseInt(range[1]) : undefined;
      let end = range[2] ? parseInt(range[2]) : file.contentLength;

      if (end > file.contentLength) {
        end = file.contentLength - 1;
      }

      if (isNil(start) || start > file.contentLength) {
        start = file.contentLength - end;
        end = file.contentLength - 1;
      }

      const chunkSize = end - start + 1;

      ctx.status = 206;
      ctx.set("Content-Length", String(chunkSize));
      ctx.set("Content-Range", `bytes ${start}-${end}/${file.contentLength}`);

      const { stream, cacheControl } = await getStreamFn(file, start, end);
      if (!isNil(cacheControl)) {
        ctx.set("Cache-Control", cacheControl);
      }

      ctx.body = stream;
    } catch {
      ctx.status = 416;
      ctx.set("Content-Length", String(file.contentLength));
      ctx.set("Content-Range", `bytes */${file.contentLength}`);

      const { stream, cacheControl } = await getStreamFn(file);
      if (!isNil(cacheControl)) {
        ctx.set("Cache-Control", cacheControl);
      }

      ctx.body = stream;
    }
  } else {
    ctx.set("Content-Length", String(file.contentLength));

    const { stream, cacheControl } = await getStreamFn(file);
    if (!isNil(cacheControl)) {
      ctx.set("Cache-Control", cacheControl);
    }

    ctx.body = stream;
  }
}
