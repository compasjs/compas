import { AppError, isNil, streamToBuffer } from "@compas/stdlib";
import isAnimated from "is-animated";
import sharp from "sharp";
import { fileCreateOrUpdate } from "./file.js";
import { queryFile } from "./generated/database/file.js";
import { objectStorageGetObjectStream } from "./object-storage.js";

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

  let loadedFile = file.meta?.transforms?.[transformKey];

  // Make sure we only read the buffer once
  let buffer = undefined;
  // Make sure that we don't have to query the just created file again
  let createdFile = undefined;

  if (!loadedFile) {
    file.meta = file.meta ?? {};
    file.meta.transforms = file.meta.transforms ?? {};

    if (file.contentLength === 0) {
      // Empty files can't be transformed
      file.meta.transforms[transformKey] = file.id;
    } else if (file.contentType === "image/svg+xml") {
      // SVG's are not transformed, so use the original file id here.
      file.meta.transforms[transformKey] = file.id;
    } else if (
      ["image/webp", "image/png", "image/gif"].includes(file.contentType)
    ) {
      buffer = await streamToBuffer(
        await objectStorageGetObjectStream(s3Client, {
          bucketName: file.bucketName,
          objectKey: file.id,
        }),
      );

      if (isAnimated(buffer)) {
        // Don't transform animated gifs and the like
        file.meta.transforms[transformKey] = file.id;
      }
    }

    if (isNil(file.meta.transforms[transformKey])) {
      if (isNil(buffer)) {
        // We only read the stream once, except when the original file is returned :)
        buffer = await streamToBuffer(
          await objectStorageGetObjectStream(s3Client, {
            bucketName: file.bucketName,
            objectKey: file.id,
          }),
        );
      }

      const sharpInstance = sharp(buffer);
      sharpInstance.rotate();

      const { width: currentWidth } = await sharpInstance.metadata();

      if (!isNil(currentWidth) && currentWidth > w) {
        // Only resize if width is greater than the needed with, so we don't accidentally
        // upscale
        sharpInstance.resize(w);
      }

      let contentType = file.contentType;

      // Transform with the expected quality
      if (acceptsWebp) {
        contentType = "image/webp";
        sharpInstance.webp({ quality: q });
      } else if (acceptsAvif) {
        contentType = "image/avif";
        sharpInstance.avif({ quality: q });
      } else if (file.contentType === "image/png") {
        sharpInstance.png({ quality: q });
      } else if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/jpg"
      ) {
        sharpInstance.jpeg({ quality: q });
      } else if (file.contentType === "image/gif") {
        sharpInstance.gif({ quality: q });
      }

      const image = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: file.bucketName,
        },
        {
          name: transformKey,
          contentType,
          meta: {
            transformedFromOriginal: file.id,
          },
        },
        await sharpInstance.toBuffer(),
      );

      file.meta.transforms[transformKey] = image.id;
      createdFile = image;
    }

    // We should have an file id here in all cases.
    loadedFile = file.meta.transforms[transformKey];

    // Atomic update transforms object
    await sql.unsafe(
      `UPDATE "file"
                      SET
                        "meta" = jsonb_set(CASE
                                             WHEN coalesce(meta, '{}'::jsonb) ? 'transforms'
                                               THEN meta
                                             ELSE jsonb_set(coalesce(meta, '{}'::jsonb), '{transforms}', '{}') END,
                                           '{transforms,${transformKey}}',
                                           '${JSON.stringify(loadedFile)}')
                      WHERE
                        id = $1`,
      [file.id],
    );
  }

  // Short circuit the known id's
  if (loadedFile === file.id) {
    return fileSendResponse(s3Client, ctx, file, options);
  } else if (createdFile && loadedFile === createdFile?.id) {
    return fileSendResponse(s3Client, ctx, createdFile, options);
  }

  const [alreadyTransformedFile] = await queryFile({
    where: {
      id: loadedFile,
    },
  }).exec(sql);

  if (!alreadyTransformedFile) {
    // File does not exist for some reason, so recursively try again.
    // To be sure that we don't try with the same transformKey again, we atomically
    // delete it from the database as well
    await sql.unsafe(
      `UPDATE "file"
                      SET
                        "meta" = "meta" #- '{transforms,${transformKey}}'
                      WHERE
                        id = $1`,
      [file.id],
    );

    // Since we pass the in memory file again, we also need to remove the key from memory.
    delete file.meta.transforms[transformKey];
    return fileSendTransformedImageResponse(sql, s3Client, ctx, file, options);
  }

  return fileSendResponse(s3Client, ctx, alreadyTransformedFile, options);
}
