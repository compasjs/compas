import { AppError, isNil, streamToBuffer } from "@compas/stdlib";
import isAnimated from "is-animated";
import sharp from "sharp";
import { createOrUpdateFile } from "./files.js";
import { queryFile } from "./generated/database/file.js";

export const TRANSFORMED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
];

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
export async function sendTransformedImage(
  sendFile,
  ctx,
  sql,
  minio,
  file,
  getStreamFn,
) {
  const { w, q } = ctx.validatedQuery ?? {};
  if (isNil(w) || isNil(q)) {
    throw AppError.serverError({
      message: `'sendTransformedImage' is used, but 'T.reference("store", "imageTransformOptions")' is not referenced in the '.query()' call of this route definition.`,
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
      buffer = await streamToBuffer((await getStreamFn(file)).stream);

      if (isAnimated(buffer)) {
        // Don't transform animated gifs and the like
        file.meta.transforms[transformKey] = file.id;
      }
    }

    if (isNil(file.meta.transforms[transformKey])) {
      if (isNil(buffer)) {
        // We only read the stream once, except when the original file is returned :)
        buffer = await streamToBuffer((await getStreamFn(file)).stream);
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

      const image = await createOrUpdateFile(
        sql,
        minio,
        file.bucketName,
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
    return sendFile(ctx, file, getStreamFn);
  } else if (loadedFile === createdFile?.id) {
    // @ts-ignore
    return sendFile(ctx, createdFile, getStreamFn);
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
    delete file.meta.transforms[transformKey];
    return sendTransformedImage(sendFile, ctx, sql, minio, file, getStreamFn);
  }

  return sendFile(ctx, alreadyTransformedFile, getStreamFn);
}
