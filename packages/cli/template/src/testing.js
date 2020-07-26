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
import Axios from "axios";
import axiosCookieJar from "axios-cookiejar-support";
import thoughCookie from "tough-cookie";
import { createApp } from "./api.js";
import { createApiClient } from "./generated/apiClient.js";
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

/**
 * Creates an axios instance with cookie support and injects it into the generated api
 * client.
 *
 * @return {AxiosInstance}
 */
export function createAndInjectApiClient() {
  const axiosInstance = Axios.create({
    withCredentials: true,
  });

  // Add cookie jar support
  axiosCookieJar.default(axiosInstance);
  axiosInstance.defaults.jar = new thoughCookie.CookieJar();

  createApiClient(axiosInstance);

  return axiosInstance;
}
