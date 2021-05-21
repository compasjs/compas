import * as stdlib from "@compas/stdlib";
import * as minioVendor from "minio";
import * as postgresVendor from "postgres";
import { queries } from "./src/generated";

/**
 * Reexported all of minio package
 */
export const minio: typeof minioVendor;

/**
 * Reexported all of postgres package
 */
export const postgres: typeof postgresVendor;

export type Postgres = postgresVendor.Sql<{}>;

/**
 * Create a new minio client.
 * By defaults reads configuration from environment variables as specified in docs/env.md
 */
export function newMinioClient(
  options: minioVendor.ClientOptions,
): minioVendor.Client;

/**
 * Create a bucket if it doesn't exist
 */
export function ensureBucket(
  minio: minioVendor.Client,
  bucketName: string,
  region: minioVendor.Region,
): Promise<void>;

/**
 * Remove a bucket
 */
export function removeBucket(
  minio: minioVendor.Client,
  bucketName: string,
): Promise<void>;

/**
 * List all objects in a bucket.
 * Note that this is not a fast operation
 */
export function listObjects(
  minio: minioVendor.Client,
  bucketName: string,
  filter?: string,
): Promise<
  {
    name: string;
    prefix: string;
    size: number;
    etag: string;
    lastModified: Date;
  }[]
>;

/**
 * Copy all objects from sourceBucket to destination bucket
 */
export function copyAllObjects(
  minio: minioVendor.Client,
  sourceBucket: string,
  destinationBucket: string,
  region: string,
): Promise<void>;

/**
 * Removes all objects and then deletes the bucket
 */
export function removeBucketAndObjectsInBucket(
  minio: minioVendor.Client,
  bucketName: string,
): Promise<void>;

/**
 * Create a new postgres client.
 * By defaults reads configuration from environment variables as specified in docs/env.md
 *
 * Will attempt database creation if `createIfNotExists` is set to true
 */
export function newPostgresConnection(
  opts?: postgresVendor.Options<{}> & { createIfNotExists?: boolean },
): Promise<Postgres>;

/**
 * Set test database.
 * New createTestPostgresConnection calls will use this as a template,
 * so things like seeding only need to happen once
 */
export function setPostgresDatabaseTemplate(
  databaseNameOrConnection: Postgres | string,
): Promise<void>;

/**
 * Cleanup the database, set with `setPostgresDatabaseTemplate`
 */
export function cleanupPostgresDatabaseTemplate(): Promise<void>;

/**
 * Drops connections to 'normal' database and creates a new one based on the 'normal' database.
 * It will truncate all tables and return a connection to the new database.
 */
export function createTestPostgresDatabase(
  verboseSql?: boolean,
): Promise<Postgres>;

/**
 * Drop the test database created with `createTestPostgresDatabase` and end the connection
 */
export function cleanupTestPostgresDatabase(sql: Postgres): Promise<void>;

/**
 * Internal representation of a migration file
 */
export interface MigrateFile {
  number: number;
  repeatable: boolean;
  name: string;
  fullPath: string;
  isMigrated: boolean;
  source: string;
  hash: string;
}

/**
 * Information used for doing migrations
 */
export interface MigrateContext {
  files: MigrateFile[];
  storedHashes: Record<string, string>;
  sql: Postgres;
}

/**
 * Create a new MigrateContext, requires an advisory lock and does the necessary queries to
 * get the state.
 */
export function newMigrateContext(sql: Postgres): Promise<MigrateContext>;

/**
 * Get a list of migrations to be applied
 * Returns false if no migrations need to run
 */
export function getMigrationsToBeApplied(
  mc: MigrateContext,
): false | { name: string; number: number; repeatable: boolean }[];

/**
 * Run the migrations, as returned by `getMigrationsToBeApplied`
 */
export function runMigrations(mc: MigrateContext): Promise<void>;

export interface StoreFile {
  id: string;
  bucketName: string;
  contentLength: number;
  contentType: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create or update a file.
 * If you pass in a non-existent id, the function will not error, but also not update the
 * file
 */
export function createOrUpdateFile(
  sql: Postgres,
  minio: minioVendor.Client,
  bucketName: string,
  props: {
    id?: string;
    bucketName?: string;
    contentLength?: number;
    contentType?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  },
  streamOrPath: string | NodeJS.ReadStream,
): Promise<StoreFile>;

/**
 * Sync deleted files to the minio bucket
 */
export function syncDeletedFiles(
  sql: Postgres,
  minio: minioVendor.Client,
  bucketName: string,
);

/**
 * Create a file copy both in postgres and in minio
 */
export function copyFile(
  sql: Postgres,
  minio: minioVendor.Client,
  bucketName: string,
  id: string,
  targetBucket?: string,
): Promise<StoreFile>;

/**
 * Open a ReadStream for a (partial) file
 */
export function getFileStream(
  minio: minioVendor.Client,
  bucketName: string,
  id: string,
  range?: { start?: number; end?: number },
): Promise<NodeJS.ReadStream>;

export interface FileGroup {
  id: string;
  name?: string;
  order: number;
  meta: {};
  file?: string;
  parent?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

/**
 * Update the order of the provided id's in relation to each other.
 * This function does not check if all files are in the same group.
 */
export function updateFileGroupOrder(
  sql: Postgres,
  ids: string[],
): Promise<void>;

/**
 * Assigns children of the provided fileGroup to the parent.
 * Returns the affected children.
 */
export function hoistChildrenToParent(
  sql: Postgres,
  fileGroup: FileGroup,
): Promise<FileGroup[]>;

export interface FileCacheOptions {
  /**
   * Maximum byte size of a file to be stored in memory
   */
  inMemoryThreshold?: number;

  /**
   * Customize default Cache-Control header to give back
   */
  cacheControlHeader?: string;
}

/**
 * A relatively simple local file cache implementation.
 * Supports saving files in memory and on local disk
 * Files#contentLength smaller than the provided threshold will be stored in memory.
 * A file will always be cached in full, and then the range requests will be evaluated
 *   after The FileCache#clear does not remove files from disk, but will overwrite the
 *   file when added to the cache again
 *
 * FileCache#getFileStream is compatible with `sendFile` in @compas/server
 */
export class FileCache {
  static fileCachePath: string;

  constructor(
    sql: Postgres,
    minio: minioVendor.Client,
    bucketName: string,
    options?: FileCacheOptions,
  );

  /**
   * Get a file(part) from the cache.
   * If the file(part) does not exist, it will try to fetch it from the FileStore
   * If the file store throws an error / it doesn't exist, the error is propagated to the
   * caller
   */
  public getStreamFn: (
    file: StoreFile,
    start?: number,
    end?: number,
  ) => Promise<{ stream: NodeJS.ReadStream; cacheControl: string }>;

  /**
   * Remove a file from cache, but not from local disk
   */
  clear(fileId: string): void;
}

/**
 * Raw data for a specific job
 */
export interface JobData {
  id: number;
  createdAt: Date;
  scheduledAt: Date;
  name: string;
  data: any;
  priority: number;
  handlerTimeout?: number;
  retryCount: number;
}

/**
 * Get all uncompleted jobs from the queue.
 * Useful for testing if jobs are created.
 */
export function getUncompletedJobsByName(
  sql: Postgres,
): Promise<Record<string, JobData[]>>;

/**
 * Job creation parameters
 */
export interface JobInput {
  /**
   * Defaults to 0
   */
  priority?: number;

  /**
   * Defaults to empty object
   */
  data?: Record<string, any>;

  /**
   * Defaults to now
   */
  scheduledAt?: Date;

  name: string;
}

export type JobQueueHandlerFunction = (
  event: stdlib.InsightEvent,
  sql: Postgres,
  data: JobData,
) => void | Promise<void>;

export interface JobQueueWorkerOptions {
  /**
   * Set a global handler, a handler based on job name, or also specify a different timeout
   * for the specific job handler.
   * If no timeout for a specific handler is provided, the handlerTimeout value is used.
   * The timeout should be in milliseconds.
   */
  handler:
    | JobQueueHandlerFunction
    | Record<
        string,
        | JobQueueHandlerFunction
        | { handler: JobQueueHandlerFunction; timeout: number }
      >;

  /**
   * Determine the poll interval in milliseconds if the queue was empty. Defaults to 1500 ms
   */
  pollInterval?: number;

  /**
   * Set the amount of parallel jobs to process. Defaults to 1.
   * Make sure it is not higher than the amount of Postgres connections in the pool
   */
  parallelCount?: number;

  /**
   * The worker will automatically catch any errors thrown by the handler, and retry the job
   * at a later stage. This property defines the max amount of retries before forcing the job
   * to be completed.
   * Defaults to 5 retries
   */
  maxRetryCount?: number;

  /**
   * Maximum time the handler could take to fulfill a job in milliseconds
   * Defaults to 30 seconds.
   */
  handlerTimeout?: number;
}

/**
 * Job Queue worker. Supports scheduling, priorities and parallel workers
 * If a name is provided, this worker will only accept jobs with the exact same name
 */
export class JobQueueWorker {
  constructor(
    sql: Postgres,
    nameOrOptions: string | JobQueueWorkerOptions,
    options?: JobQueueWorkerOptions,
  );

  /**
   * Start the JobQueueWorker
   */
  start(): void;

  /**
   * Stop the JobQueueWorker
   * Running jobs will continue to run, but no new jobs are fetched
   */
  stop(): void;

  /**
   * Get the number of jobs that need to run
   */
  pendingQueueSize(): Promise<
    { pendingCount: number; scheduledCount: number } | undefined
  >;

  /**
   * Return the average time between scheduled and completed for jobs completed in the
   * provided time range in milliseconds
   */
  averageTimeToCompletion(startDate: Date, endDate: Date): Promise<number>;
}

/**
 * Add an event to the job queue.
 * Use this if the default priority is important, like sending the user an email to
 *    verify their email. Runs with priority '2', the only higher priority values are
 *    priority '0' and '1'.
 *
 * Custom timeouts can't be described via this mechanism.
 */
export function addEventToQueue(
  sql: Postgres,
  eventName: string,
  data: Record<string, any>,
): Promise<number>;

/**
 * Add a new job to the queue.
 * Use this for normal jobs or to customize the job priority.
 * The default priority is '5'.
 */
export function addJobToQueue(sql: Postgres, job: JobInput): Promise<number>;

/**
 * Add a new job to the queue.
 * Use this for normal jobs or to customize the job priority.
 * The default priority is '5'.
 *
 * The timeout value must be an integer higher than 10. The timeout value represents the
 *    number of milliseconds the handler may run, before the 'InsightEvent' is aborted.
 */
export function addJobWithCustomTimeoutToQueue(
  sql: Postgres,
  job: JobInput,
  timeout: number,
): Promise<number>;

/**
 * Add a recurring job, if no existing job with the same name is scheduled.
 * Does not throw when a job is already pending with the same name.
 * If exists will update the interval.
 * The default priority is '4', which is a bit more important than other jobs.
 */
export function addRecurringJobToQueue(
  sql: Postgres,
  {
    name,
    priority,
    interval,
  }: {
    name: string;
    priority?: number;
    interval: {
      years?: number;
      months?: number;
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
    };
  },
): Promise<void>;

/**
 * Stripped down from @compas/server SessionStore
 */
export interface SessionStore {
  get(id: string): Promise<object | boolean>;

  set(id: string, session: object, age: number): Promise<void>;

  destroy(id: string): Promise<void>;

  /**
   * Remove all expired sessions
   */
  clean(): Promise<void>;
}

/**
 * Create a session store compatible with @compas/server#session
 */
export function newSessionStore(sql: Postgres): SessionStore;

/**
 * Migration directory
 */
export const migrations: string;

/**
 * Compas structure.
 * Can be used to extend functionality or reference one of the columns
 */
export const storeStructure: any;

/**
 * Build safe, parameterized queries.
 */
export interface QueryPart<T = any> {
  strings: string[];
  values: any[];

  append(part: QueryPart): QueryPart<T>;

  exec(sql: Postgres): postgresVendor.PendingQuery<T[]>;
}

/**
 * Format and append query parts, and exec the final result in a safe way.
 * Undefined values are skipped, as they are not allowed in queries.
 * The provided values may contain other 'query``' calls, and they will be inserted
 * appropriately.
 *
 * @example
 *   ```
 *   const getWhere = (value) => query`WHERE foo = ${value}`;
 *   const selectResult = await query`SELECT * FROM "myTable" ${getWhere(5)}`.exec(sql);
 *   // sql: SELECT * FROM "myTable" WHERE foo = $1
 *   // arguments: [ 5 ]
 *   ```
 */
export function query(strings: string[], ...values: any[]): QueryPart;

/**
 * Simple check if the passed in value is a query part
 */
export function isQueryPart(value: any): value is QueryPart;

/**
 * Stringify a queryPart.
 * When interpolateParameters is true, we do a best effort in replacing the parameterized
 * query with the real params. If the result doesn't look right, please turn it off.
 */
export function stringifyQueryPart(queryPart: QueryPart): {
  sql: string;
  params: any[];
};

/**
 * Stringify a queryPart.
 * When interpolateParameters is true, we do a best effort in replacing the parameterized
 * query with the real params. If the result doesn't look right, please turn it off.
 */
export function stringifyQueryPart(
  queryPart: QueryPart,
  { interpolateParameters }: { interpolateParameters: true },
): string;

/**
 * Creates a transaction, executes the query, and rollback the transaction afterwards.
 * This is safe to use with insert, update and delete queries.
 *
 * By default returns text, but can also return json.
 * Note that explain output is highly depended on the current data and usage of the tables.
 */
export function explainAnalyzeQuery(
  sql: Postgres,
  queryPart: QueryPart,
  options?: { jsonResult?: true },
): Promise<string | any>;

/**
 * Overwrite used generated queries.
 * This is needed when you want cascading soft deletes to any of the exposed types
 */
export function setStoreQueries(q: typeof queries): void;

/**
 * Get the disk size (in bytes) and estimated row count for all tables and views.
 * To improve accuracy, run sql`ANALYZE` before this query, however make sure to read the
 * Postgres documentation for implications.
 *
 * Accepts the @compas/store based sql instance, but not strongly typed so we don't have the
 * dependency
 */
export function postgresTableSizes(
  sql: any,
): Promise<Record<string, { diskSize: number; rowCount: number }>>;
