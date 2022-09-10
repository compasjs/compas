/**
 * TODO: Link to Live bindings docs
 */

/**
 * Logger that can be used outside the request & job lifecycles.
 * Prefer to use `t.log`, `event.log` or `ctx.log` where possible.
 *
 * @type {Logger}
 */
export let serviceLogger = undefined;

/**
 * Global sql connection pool
 *
 * @type {Postgres}
 */
export let sql = undefined;

/**
 * Global s3 client
 *
 * @type {S3Client}
 */
export let s3Client = undefined;

/**
 * Bucket name that should be used
 *
 * @type {string}
 */
export let bucketName = undefined;

/**
 * Koa instance
 *
 * @type {Application}
 */
export let app = undefined;

/**
 * @param {Logger} newServiceLogger
 */
export function setServiceLogger(newServiceLogger) {
  newServiceLogger.info({ message: "Setting serviceLogger" });
  serviceLogger = newServiceLogger;
}

/**
 * @param {Postgres} newSql
 */
export function setSql(newSql) {
  serviceLogger.info({ message: "Setting sql" });
  sql = newSql;
}

/**
 * @param {S3Client} newS3Client
 */
export function setS3Client(newS3Client) {
  serviceLogger.info({ message: "Setting s3Client" });
  s3Client = newS3Client;
}

/**
 * @param {string} newBucketName
 */
export function setBucketName(newBucketName) {
  serviceLogger.info({ message: "Setting bucketName" });
  bucketName = newBucketName;
}

/**
 * @param {Application} newApp
 */
export function setApp(newApp) {
  serviceLogger.info({ message: "Setting app" });
  app = newApp;
}
