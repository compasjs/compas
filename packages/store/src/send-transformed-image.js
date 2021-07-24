import { AppError, isNil, streamToBuffer } from "@compas/stdlib";
import isAnimated from "is-animated";
import sharp from "sharp";
import { createOrUpdateFile } from "./files.js";
import { queryFile } from "./generated/database/file.js";

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
export async function sendTransformedImage(
  sendFile,
  ctx,
  sql,
  minio,
  file,
  getStreamFn,
) {
  const { w, q } = ctx.validatedQuery ?? {};
  if (isNil(w) || isNil(w)) {
    throw AppError.serverError({
      message: `'sendTransformedImage' is used, but 'T.reference("store", "imageTransformOptions")' is not referenced in the '.query()' call of this route definition.`,
    });
  }

  // Always try to serve 'webp', else the original content type is used or defaults to
  // jpeg
  const acceptsWebp = !!ctx.accepts("image/webp");
  const transformKey = `compas-image-transform-webp${
    acceptsWebp ? 1 : 0
  }-w${w}-q${q}`;

  let loadedFile = file.meta?.transforms?.[transformKey];

  // Make sure we only read the buffer once
  let buffer = undefined;
  // Make sure that we don't have to query the just created file again
  let createdFile = undefined;

  if (!loadedFile) {
    file.meta = file.meta ?? {};
    file.meta.transforms = file.meta.transforms ?? {};

    if (file.contentType === "image/svg+xml") {
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
        sharpInstance.webp({ quality: q });
        contentType = "image/webp";
      } else if (file.contentType === "image/png") {
        sharpInstance.png({ quality: q });
      } else if (file.contentType === "image/jpeg") {
        sharpInstance.jpeg({ quality: q });
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
                        "meta" = jsonb_set(meta, '{transforms,${transformKey}}', '${JSON.stringify(
        loadedFile,
      )}', TRUE)
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
    // File does not exists for some reason, so recursively try again.
    // To be sure that we don't try with the same transformKey again, we atomically
    // delete it from the database as well
    await sql.unsafe(
      `UPDATE "file"
                      SET
                        "meta" = "meta" #- '{transforms,${transformKey}}',
                        '${JSON.stringify(loadedFile)}'
                      WHERE
                        id = $1`,
      [file.id],
    );
    delete file.meta.transforms[transformKey];
    return sendTransformedImage(sendFile, ctx, sql, minio, file, getStreamFn);
  }

  return sendFile(ctx, alreadyTransformedFile, getStreamFn);
}
