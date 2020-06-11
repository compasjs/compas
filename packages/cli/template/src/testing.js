import { newLogger } from "@lbu/insight";
import { createBodyParsers, session } from "@lbu/server";
import { uuid } from "@lbu/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  FileCache,
  newFileStoreContext,
  newMinioClient,
  newSessionStore,
  removeBucketAndObjectsInBucket,
} from "@lbu/store";
import { createApp } from "./api.js";
import {
  app,
  appBucket,
  ensureBuckets,
  fileStore,
  minio,
  serviceLogger,
  sessionStore,
  setApp,
  setAppBucket,
  setBodyParsers,
  setFileCache,
  setFileStore,
  setMinio,
  setServiceLogger,
  setSessionMiddleware,
  setSessionStore,
  setSql,
  sql,
} from "./services/index.js";

/**
 *
 */
export async function injectTestServices() {
  setServiceLogger(newLogger({ ctx: { type: "test-services" } }));

  setSql(await createTestPostgresDatabase());
  setAppBucket(uuid());
  setMinio(newMinioClient({}));
  setFileStore(newFileStoreContext(sql, minio, appBucket));
  setSessionStore(
    newSessionStore(sql, {
      disableInterval: true,
    }),
  );
  setFileCache(new FileCache(fileStore));

  setApp(createApp());
  setBodyParsers(createBodyParsers({}));
  setSessionMiddleware(session(app, { store: sessionStore }));

  await ensureBuckets("us-east-1");
}

/**
 *
 */
export async function cleanupTestServices() {
  serviceLogger.info("cleanup test services");
  await cleanupTestPostgresDatabase(sql);
  setSql(undefined);
  await removeBucketAndObjectsInBucket(minio, appBucket);
  setMinio(undefined);
  setAppBucket(undefined);
}
