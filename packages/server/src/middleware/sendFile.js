import { isNil } from "@compas/stdlib";

/**
 * @param ctx
 * @param {SendFileItem} file
 * @param {GetStreamFn} getStreamFn
 */
export async function sendFile(ctx, file, getStreamFn) {
  ctx.set("Accept-Ranges", "bytes");
  ctx.set("Last-Modified", file.updatedAt || file.lastModified);
  ctx.type = file.contentType;

  if (ctx.headers.range) {
    try {
      const rangeHeader = ctx.headers.range;
      const rangeValue = /=(.*)$/.exec(rangeHeader)[1];
      const range = /^[\w]*?(\d*)-(\d*)$/.exec(rangeValue);

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
