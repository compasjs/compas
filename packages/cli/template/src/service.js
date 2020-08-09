import { newLogger } from "@lbu/insight";
import { createBodyParsers, session } from "@lbu/server";
import { isStaging } from "@lbu/stdlib";
import {
  FileCache,
  newFileStoreContext,
  newMinioClient,
  newPostgresConnection,
  newSessionStore,
} from "@lbu/store";
import { createApp } from "./api.js";
import {
  app,
  ensureBuckets,
  fileStore,
  minio,
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
 * Create all services / service contexts upfront
 * We can do this because of how ES module exports are live bindings
 *
 * @returns {Promise<void>}
 */
export async function injectServices() {
  setServiceLogger(newLogger({ ctx: { type: "services" } }));

  setSql(
    await newPostgresConnection({
      createIfNotExists: isStaging(),
    }),
  );
  setAppBucket(process.env.APP_NAME);
  setMinio(newMinioClient({}));
  setFileStore(newFileStoreContext(sql, minio, process.env.APP_NAME));
  setSessionStore(newSessionStore(sql, {}));
  setFileCache(new FileCache(fileStore));

  setApp(createApp());
  setBodyParsers(createBodyParsers({}));
  setSessionMiddleware(session(app, { store: sessionStore }));

  await ensureBuckets("us-east-1");
}
