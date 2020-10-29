import { newLogger } from "@lbu/insight";
import { createBodyParsers, session } from "@lbu/server";
import { environment, isStaging } from "@lbu/stdlib";
import {
  FileCache,
  newMinioClient,
  newPostgresConnection,
  newSessionStore,
} from "@lbu/store";
import { createApp } from "./api.js";
import {
  app,
  appBucket,
  ensureBuckets,
  minio,
  sessionStore,
  setApp,
  setAppBucket,
  setBodyParsers,
  setFileCache,
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
  setAppBucket(environment.APP_NAME);
  setMinio(newMinioClient({}));
  setSessionStore(newSessionStore(sql));
  setFileCache(new FileCache(sql, minio, appBucket));

  setApp(createApp());
  setBodyParsers(createBodyParsers({}));
  setSessionMiddleware(session(app, { store: sessionStore }));

  await ensureBuckets("us-east-1");
}
