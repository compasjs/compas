import { isNil } from "@lbu/stdlib";

/**
 * @name SendFile
 *
 * Compatible with @lbu/store files. Needs either updated_at or last_modified
 *
 * @typedef {object}
 * @property {*} id
 * @property {number} content_length
 * @property {string} content_type
 * @property {Date} [updated_at]
 * @property {Date} [last_modified]
 */

/**
 * @name GetStreamFn
 *
 * @typedef {Function}
 * @param {SendFile} fileInfo
 * @param {number} [start]
 * @param {number} [end]
 * @returns {Promise<{ stream: ReadableStream, cacheControl?: string}>}
 */

/**
 * Send any file to the ctx.body
 * User is free to set Cache-Control
 *
 * @param ctx
 * @param {SendFile} file
 * @param {GetStreamFn} getStreamFn
 */
export async function sendFile(ctx, file, getStreamFn) {
  ctx.set("Accept-Ranges", "bytes");
  ctx.set("Last-Modified", file.updated_at || file.last_modified);
  ctx.type = file.content_type;

  if (ctx.headers.range) {
    try {
      const rangeHeader = ctx.headers.range;
      const rangeValue = /=(.*)$/.exec(rangeHeader)[1];
      const range = /^[\w]*?(\d*)-(\d*)$/.exec(rangeValue);

      let start = range[1] ? parseInt(range[1]) : undefined;
      let end = range[2] ? parseInt(range[2]) : file.content_length;

      if (end > file.content_length) {
        end = file.content_length - 1;
      }

      if (isNil(start) || start > file.content_length) {
        start = file.content_length - end;
        end = file.content_length - 1;
      }

      const chunkSize = end - start + 1;

      ctx.status = 206;
      ctx.set("Content-Length", String(chunkSize));
      ctx.set("Content-Range", `bytes ${start}-${end}/${file.content_length}`);

      const { stream, cacheControl } = await getStreamFn(file, start, end);
      if (!isNil(cacheControl)) {
        ctx.set("Cache-Control", cacheControl);
      }

      ctx.body = stream;
    } catch {
      ctx.status = 416;
      ctx.set("Content-Length", String(file.content_length));
      ctx.set("Content-Range", `bytes */${file.content_length}`);

      const { stream, cacheControl } = await getStreamFn(file);
      if (!isNil(cacheControl)) {
        ctx.set("Cache-Control", cacheControl);
      }

      ctx.body = stream;
    }
  } else {
    ctx.set("Content-Length", String(file.content_length));

    const { stream, cacheControl } = await getStreamFn(file);
    if (!isNil(cacheControl)) {
      ctx.set("Cache-Control", cacheControl);
    }

    ctx.body = stream;
  }
}
