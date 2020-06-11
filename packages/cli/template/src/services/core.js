import { FileCache } from "@lbu/store";
import { serviceLogger } from "./loggers.js";

/**
 * Postgres client
 * There are currently no types available
 */
export let sql = undefined;

/**
 * @type {minio.Client}
 */
export let minio = undefined;

/**
 * @type {FileStoreContext}
 */
export let fileStore = undefined;
/**
 * @type {SessionStore}
 */
export let sessionStore = undefined;

/**
 * @type {FileCache}
 */
export let fileCache = undefined;

/**
 * @type {Application}
 */
export let app = undefined;

/**
 * @type {{bodyParser: Function, multipartBodyParser: Function}}
 */
export let bodyParsers = undefined;

/**
 * @type {Function}
 */
export let sessionMiddleware = undefined;

/**
 * @param newSql
 */
export function setSql(newSql) {
  serviceLogger.info("setting sql");
  sql = newSql;
  return sql;
}

/**
 * @param newMinio
 */
export function setMinio(newMinio) {
  serviceLogger.info("setting minio");
  minio = newMinio;
  return minio;
}

/**
 * @param newFileStore
 */
export function setFileStore(newFileStore) {
  serviceLogger.info("setting fileStore");
  fileStore = newFileStore;
  return fileStore;
}

/**
 * @param newSessionStore
 */
export function setSessionStore(newSessionStore) {
  serviceLogger.info("setting sessionStore");
  sessionStore = newSessionStore;
  return sessionStore;
}

/**
 * @param newFileCache
 */
export function setFileCache(newFileCache) {
  serviceLogger.info("setting fileCache");
  fileCache = newFileCache;
  return fileCache;
}

/**
 * @param newApp
 */
export function setApp(newApp) {
  serviceLogger.info("setting app");
  app = newApp;
  return app;
}

/**
 * @param newBodyParsers
 */
export function setBodyParsers(newBodyParsers) {
  serviceLogger.info("setting bodyParsers");
  bodyParsers = newBodyParsers;
  return bodyParsers;
}

/**
 * @param newSessionMiddleware
 */
export function setSessionMiddleware(newSessionMiddleware) {
  serviceLogger.info("setting sessionMiddleware");
  sessionMiddleware = newSessionMiddleware;
  return sessionMiddleware;
}
