import { createBodyParser, getApp } from "@compas/server";
import {
  AppError,
  environment,
  isNil,
  isProduction,
  uuid,
} from "@compas/stdlib";
import {
  createTestPostgresDatabase,
  fileCreateOrUpdate,
  fileFormatMetadata,
  fileSendTransformedImageResponse,
  newPostgresConnection,
  objectStorageCreateClient,
  objectStorageEnsureBucket,
  objectStorageGetDevelopmentConfig,
} from "@compas/store";
import { queries } from "./generated/common/database.js";
import { router } from "./generated/common/router.js";
import { queryPost } from "./generated/database/post.js";

export let app = undefined;

export let sql = undefined;

export let s3Client = undefined;

export let bucketName = undefined;

export async function injectServices() {
  app = getApp({});
  sql = await newPostgresConnection({ max: 10 });

  s3Client = objectStorageCreateClient(
    isProduction() ? {} : objectStorageGetDevelopmentConfig(),
  );
  bucketName = environment.APP_NAME;
  await objectStorageEnsureBucket(s3Client, {
    bucketName,
    locationConstraint: "eu-central-1",
  });

  await loadRoutes();

  app.use(
    router(
      createBodyParser({
        multipart: true,
      }),
    ),
  );
}

export async function injectTestServices() {
  app = getApp({});
  sql = await createTestPostgresDatabase();

  s3Client = objectStorageCreateClient(objectStorageGetDevelopmentConfig());
  bucketName = uuid();
  await objectStorageEnsureBucket(s3Client, {
    bucketName,
    locationConstraint: "eu-central-1",
  });

  await loadRoutes();

  app.use(
    router(
      createBodyParser({
        multipart: true,
      }),
    ),
  );
}

/**
 * Register all routes
 */
async function loadRoutes() {
  const { postHandlers } = await import("./generated/post/controller.js");

  postHandlers.list = async (ctx) => {
    const posts = await queryPost({
      headerImage: {},
    }).exec(sql);

    ctx.body = {
      posts: posts.map((it) => ({
        id: it.id,
        title: it.title,
        contents: it.contents,
        headerImage: it.headerImage
          ? fileFormatMetadata(it.headerImage, {
              url: `http://${ctx.request.host}/post/${it.id}/header-image`,
            })
          : undefined,
      })),
    };
  };

  postHandlers.create = async (ctx) => {
    const { headerImage, ...props } = ctx.validatedBody;

    if (headerImage) {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName,
          allowedContentTypes: ["image/jpg", "image/png", "image/jpeg"],
        },
        {
          name: headerImage.originalFilename,
        },
        headerImage.filepath,
      );

      props.headerImage = file.id;
    }

    await queries.postInsert(sql, props);

    ctx.body = {};
  };

  postHandlers.headerImage = async (ctx) => {
    const [post] = await queryPost({
      where: {
        id: ctx.validatedParams.id,
      },
      headerImage: {},
    }).exec(sql);

    if (isNil(post?.headerImage)) {
      throw AppError.validationError(`post.headerImage.unknown`);
    }

    await fileSendTransformedImageResponse(
      sql,
      s3Client,
      ctx,
      post.headerImage,
    );
  };
}
