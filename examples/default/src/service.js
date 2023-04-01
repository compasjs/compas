import { createBodyParsers, getApp } from "@compas/server";
import { environment, isProduction, newLogger, uuid } from "@compas/stdlib";
import {
  createTestPostgresDatabase,
  newPostgresConnection,
  objectStorageCreateClient,
  objectStorageEnsureBucket,
  objectStorageGetDevelopmentConfig,
} from "@compas/store";
import { router } from "./generated/application/common/router.js";
import { postRegisterCrud } from "./generated/application/post/crud.js";
import {
  app,
  bucketName,
  s3Client,
  setApp,
  setBucketName,
  setS3Client,
  setServiceLogger,
  setSql,
  sql,
} from "./services/core.js";

/**
 * Set the services that can be used throughout your app
 */
export async function initializeServices() {
  setServiceLogger(
    newLogger({
      ctx: {
        type: "services",
      },
    }),
  );

  setSql(
    await newPostgresConnection({
      createIfNotExists: !isProduction(),
    }),
  );

  setS3Client(
    objectStorageCreateClient(
      isProduction() ? {} : objectStorageGetDevelopmentConfig(),
    ),
  );
  setBucketName(environment.APP_NAME);

  await createAppAndLoadControllers();
}

/**
 * Set test variants of services that are used throughout your app.
 */
export async function initializeTestServices() {
  setServiceLogger(
    newLogger({
      ctx: {
        type: "test-services",
      },
    }),
  );

  setSql(await createTestPostgresDatabase());

  setS3Client(objectStorageCreateClient(objectStorageGetDevelopmentConfig()));
  setBucketName(uuid());

  await objectStorageEnsureBucket(s3Client, {
    bucketName,
    locationConstraint: "eu-central-1",
  });

  await createAppAndLoadControllers();
}

/**
 * Initialize the Koa app, use the generated router and load the controller
 * implementations.
 */
async function createAppAndLoadControllers() {
  setApp(
    getApp({
      headers: {
        cors: {
          maxAge: 7200,
        },
      },
      logOptions: {
        requestInformation: {
          includeEventName: true,
          includePath: false,
          includeValidatedParams: true,
        },
      },
    }),
  );

  // Use the generated router
  app.use(router(createBodyParsers()));

  postRegisterCrud({ sql });

  // Controller imports;
  // These files are not imported in any other file, but since they are needed to add the
  // implementation to the generated handlers, we need to import them here.
  // Another way to go here, would be to export a function like `postRegisterCrud` that
  // you call here.
  await Promise.all([import("./post/controller.js") /* add others */]);
}
