import * as minioVendor from "minio";
import * as postgresVendor from "postgres";
import { queries } from "./src/generated/index.js";

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
  namespace: string;
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
  namespaces: string[];
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

export interface NestedFileGroup {
  id: string;
  name?: string;
  order: number;
  meta: {};
  parent?: string;
  isDirectory: boolean;
  file?:
    | {
        id: string;
        bucketName?: string;
        contentLength?: number;
        contentType?: string;
        name?: string;
        createdAt?: string;
        updatedAt?: string;
      }
    | undefined
    | string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  children?: NestedFileGroup[];
}

/**
 * Assigns children of the provided fileGroup to the parent.
 * Returns the affected children.
 */
export function hoistChildrenToParent(
  sql: Postgres,
  fileGroup: FileGroup,
): Promise<FileGroup[]>;

/**
 * Update the order of the provided id's in relation to each other.
 * This function does not check if all files are in the same group.
 */
export function updateFileGroupOrder(
  sql: Postgres,
  ids: string[],
): Promise<void>;

/**
 * Return a result with nested file groups and files, sorted completely by the order id.
 */
export function getNestedFileGroups(
  sql: Postgres,
  where?: {
    deletedAtIncludeNotNull?: boolean;
    rootId?: string;
    excludeFiles?: boolean;
  },
): Promise<NestedFileGroup[]>;

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
 * FileCache#getFileStream is compatible with `sendFile` in @lbu/server
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
}

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

export interface JobQueueWorkerOptions {
  handler: (sql: Postgres, data: JobData) => void | Promise<void>;

  /**
   * Determine the poll interval in milliseconds if the queue was empty. Defaults to 1500 ms
   */
  pollInterval?: number;

  /**
   * Set the amount of parallel jobs to process. Defaults to 1.
   * Make sure it is not higher than the amount of Postgres connections in the pool
   */
  parallelCount?: number;
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

  /**
   * Uses this queue name and connection to add a job to the queue.
   * If name is already set, it will not be overwritten
   */
  addJob(job: JobInput): Promise<number>;
}

/**
 * Add a new item to the job queue
 * Defaults to `process.env.APP_NAME` if name is not specified
 */
export function addJobToQueue(sql: Postgres, job: JobInput): Promise<number>;

/**
 * Add a recurring job, if no existing job with the same name is scheduled.
 * Does not throw when a job is already pending with the same name.
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
 * Stripped down from @lbu/server SessionStore
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
 * Create a session store compatible with @lbu/server#session
 */
export function newSessionStore(sql: Postgres): SessionStore;

/**
 * Migration directory
 */
export const migrations: string;

/**
 * LBU structure.
 * Can be used to extend functionality or reference one of the columns
 */
export const storeStructure: any;

/**
 * Build safe, parameterized queries.
 */
export interface QueryPart {
  strings: string[];
  values: any[];

  append(part: QueryPart): QueryPart;

  exec(sql: Postgres): postgresVendor.PendingQuery<any>;
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
