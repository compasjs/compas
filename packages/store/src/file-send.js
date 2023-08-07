import { AppError, isNil } from "@compas/stdlib";
import { queryFile } from "./generated/database/file.js";
import { objectStorageGetObjectStream } from "./object-storage.js";
import { queueWorkerAddJob } from "./queue-worker.js";

/**
 * Send a `StoreFile` instance as a `ctx` response.
 * Handles byte range requests as well. May need some improvements to set some better
 * cache headers.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {import("koa").Context} ctx
 * @param {import("./generated/common/types.d.ts").StoreFile} file
 * @param {{
 *   cacheControlHeader?: string,
 * }} [options]
 * @returns {Promise<void>}
 */
export async function fileSendResponse(s3Client, ctx, file, options) {
  options = options ?? {};
  options.cacheControlHeader =
    options.cacheControlHeader ?? "max-age=120, must-revalidate";

  ctx.set("Accept-Ranges", "bytes");
  ctx.set(
    "Last-Modified",
    typeof file.updatedAt === "string"
      ? file.updatedAt
      : file.updatedAt.toString(),
  );
  ctx.set("Cache-Control", options.cacheControlHeader);
  ctx.set("Content-Type", file.contentType);

  // @ts-ignore
  if (ctx.headers["if-modified-since"]?.length > 0) {
    // @ts-ignore
    const dateValue = new Date(ctx.headers["if-modified-since"]);
    // @ts-ignore
    const currentDate = new Date(file.updatedAt);

    // Weak validation ignores the milliseconds part, hence 'weak'.
    currentDate.setMilliseconds(0);

    if (dateValue.getTime() === currentDate.getTime()) {
      // File is not modified
      ctx.status = 304;

      // We always set a Buffer here to conform to response validators.
      // Koa discards this for status codes that should not send a response.
      // See https://github.com/koajs/koa/blob/bec13ecccdf7c734bccd5dd0ee9892621415af41/lib/application.js#L272
      ctx.body = Buffer.alloc(0, 0);
      return;
    }
  }

  if (ctx.headers.range) {
    try {
      const rangeHeader = ctx.headers.range;
      const range = /=(\d*)-(\d*)$/.exec(rangeHeader);

      // @ts-ignore
      let start = range[1] ? parseInt(range[1]) : undefined;
      // @ts-ignore
      let end = range[2] ? parseInt(range[2]) : file.contentLength;

      if (end > file.contentLength) {
        end = file.contentLength - 1;
      }

      if (isNil(start) || start > file.contentLength) {
        // '-500' results in the last 500 bytes send
        start = file.contentLength - end;
        end = file.contentLength - 1;
      }

      const chunkSize = end - start + 1;

      ctx.status = 206;
      ctx.set("Content-Length", String(chunkSize));
      ctx.set("Content-Range", `bytes ${start}-${end}/${file.contentLength}`);

      ctx.body = await objectStorageGetObjectStream(s3Client, {
        bucketName: file.bucketName,
        objectKey: file.id,
        range: {
          start,
          end,
        },
      });
    } catch {
      ctx.status = 416;
      ctx.set("Content-Length", String(file.contentLength));
      ctx.set("Content-Range", `bytes */${file.contentLength}`);

      ctx.body = await objectStorageGetObjectStream(s3Client, {
        bucketName: file.bucketName,
        objectKey: file.id,
      });
    }
  } else {
    ctx.set("Content-Length", String(file.contentLength));

    ctx.body = await objectStorageGetObjectStream(s3Client, {
      bucketName: file.bucketName,
      objectKey: file.id,
    });
  }
}

/**
 * Wraps {@link fileSendResponse}, to include an image transformer compatible with Next.js
 * image loader. Only works if the input file is an image. It caches the results on in
 * the file.meta.
 *
 * Supported extensions: image/png, image/jpeg, image/jpg, image/webp, image/avif,
 * image/gif. It does not support 'animated' versions of image/webp and image/gif and
 * just sends those as is. See {@link FileType#mimeTypes} and {@link fileCreateOrUpdate}
 * to enforce this on file upload.
 *
 * Prefers to transform the image to `image/webp` or `image/avif` if the client supports
 * it.
 *
 * The transform happens via {@link jobFileTransformImage}. When a transform is not yet possible, the original file is send out, while a transform job is inserted.
 *
 * @param {import("postgres").Sql} sql
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {import("koa").Context} ctx
 * @param {import("./generated/common/types.d.ts").StoreFile} file
 * @param {{
 *   cacheControlHeader?: string,
 * }} [options]
 * @returns {Promise<void>}
 */
export async function fileSendTransformedImageResponse(
  sql,
  s3Client,
  ctx,
  file,
  options,
) {
  options = options ?? {};
  options.cacheControlHeader =
    options.cacheControlHeader ?? "max-age=120, must-revalidate";

  const { w, q } = ctx.validatedQuery ?? {};
  if (isNil(w) || isNil(q)) {
    throw AppError.serverError({
      message: `'fileSendTransformedImageResponse' is used, but 'T.reference("store", "imageTransformOptions")' is not referenced in the '.query()' call of this route definition.`,
    });
  }

  // Always try to serve 'webp', else the original content type is used or defaults to
  // jpeg
  const acceptsWebp = !!ctx.accepts("image/webp");
  const acceptsAvif = !!ctx.accepts("image/avif");
  const transformKey = `compas-image-transform-${
    acceptsWebp ? "webp" : acceptsAvif ? "avif" : "none"
  }-w${w}-q${q}`;

  const loadedFile =
    w === "original" ? file.id : file.meta?.transforms?.[transformKey];

  if (!loadedFile) {
    await queueWorkerAddJob(sql, {
      name: "compas.file.transformImage",
      data: {
        fileId: file.id,
        transformKey,
        options: {
          w,
          q,
          contentType: acceptsWebp
            ? "image/webp"
            : acceptsAvif
            ? "image/avif"
            : file.contentType,
        },
      },
    });

    return fileSendResponse(s3Client, ctx, file, options);
  }

  if (loadedFile === file.id) {
    // No transform operation happened
    return fileSendResponse(s3Client, ctx, file, options);
  }

  const [transformedFile] = await queryFile({
    where: {
      id: loadedFile,
    },
  }).execRaw(sql);

  if (isNil(transformedFile)) {
    // The transformed file is not correctly saved. Trying again.
    await queueWorkerAddJob(sql, {
      name: "compas.file.transformImage",
      data: {
        fileId: file.id,
        transformKey,
        options: {
          w,
          q,
          contentType: acceptsWebp
            ? "image/webp"
            : acceptsAvif
            ? "image/avif"
            : file.contentType,
        },
      },
    });
  }

  // @ts-expect-error
  return fileSendResponse(s3Client, ctx, transformedFile ?? file, options);
}
