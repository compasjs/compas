# Store

The store package provides various wrappers that combine Postgres and Minio, for
persisting data.

## Postgres

The main entrypoint for setting up a postgres connection is by using
`newPostgresConnection`. This will use environment variables as specified in
[environment](/env.md), and return a new postgres connection based on the
[postgres](https://npmjs.com/packages/postgres) package.

### Testing

For integration testing purposes the package exports
`createTestPostgresDatabase` and `cleanupTestPostgresDatabase`. While creating a
test database, all connections to the default database are dropped, a copy is
made and then all data is truncated. This ensures a clean slate for every test
suite.

## Minio

The minio connector can be used to persist files easily. This starts with
calling `newMinioClient` to initialize the client. After that `ensureBucket` can
be used to create a bucket if not exists. `removeBucket` and
`removeBucketAndObjectsInBucket` are used to delete a bucket, where the latter
will also forcefully remove any object left in the bucket. To get insight
`listObjects` is available and will collect all objects and return them as an
array.

## Migrations

This is a forward only, repeatable supported migration tool. In other words, no
'down' scripts, and repeatable migrations will run when they are changed.

To achieve that the following structure is expected:

- A top level `migrations` directory
- Migration files follow this naming pattern `000-r-name-of-migration.sql`.
  - Where `-r` is optional, and `000` is incremented and used as a sorting key
- A special handling for `namespaces.txt` file in the migrations directory.
  - A single `import()`-able package per line
  - The imported package should export a
    `export const migrations = /path/to/migrations`
  - Note that `@lbu/store` is automatically added as a namespace

### Usage

The following script taken from this repository and provided in the template
should be all that you need. Run `yarn lbu migrate` and the thing should run,
provided that you already had a working database connection in this project.

```javascript
import { mainFn } from "@lbu/stdlib";
import {
  getMigrationsToBeApplied,
  newMigrateContext,
  newPostgresConnection,
  runMigrations,
} from "@lbu/store";

mainFn(import.meta, main);

async function main(logger) {
  const sql = newPostgresConnection({});
  const mc = await newMigrateContext(sql);
  logger.info(getMigrationsToBeApplied(mc) || "No migrations to be applied.");

  await runMigrations(mc);

  await sql.end();
}
```

### General notes

To calculate if a repeatable migration needs to run again, a sha1 is calculated
and stored in the database.

Migration namespaces shouldn't resolve in a graph. For example in the following
example you would get a hard crash when calling `newMigrateContext`

```text
// node_modules/A/migrations/namespaces.txt
B
// node_modules/B/migrations/namespaces.txt
C
// node_modules/C/migrations/namespaces.txt
A
```

The migration order is dependent on the following:

- An `import`-ed namespace will run first
- The numbers in migration files are sorted ascending per namespace.

The contents of the `migrations` table are applied to the on disk state. So if
you delete previous migrations nothing should fail.

All migrations run in a transaction. To escape from that put
`-- disable auto transaction` in the file.

## Files

@lbu/store also provides a way to store files in S3 and keeping a reference to
the file in Postgres. This is not designed to be strict about things. The user
should do checks if the user may access or not.

Some features:

- Multiple buckets supported
- Create and 'overwrite' files
- Get file info, file stream or partial file stream
- Delete files
- Sync deleted files to the s3 bucket

## FileCache

## SessionStore

## JobQueue

@lbu/store also comes with a Postgres backed queue implementation. The queue
supports the following:

- First In, First Out job handling
- Prioritize jobs
- Schedule jobs for execution in the future
- Run workers for specific jobs

Example usage:

```javascript
mainFn(import.meta, main);

async function main() {
  const sql = await newPostgresConnection();

  const jobHandler = async (sql, data) => {
    console.log(data.name); // "myJob"

    // simulate work
    await new Promise((r) => setTimeout(r, 100));
  };

  // parallelCount shouldn't be higher than Postgres pool size
  const queueWorker = new JobQueueWorker(sql, "myJob", {
    parallelCount: 5,
    pollInterval: 1500,
    handler: jobHandler,
  });

  // Start queue
  queueWorker.start();

  setInterval(() => {
    // Get current queue size
    queueWorker.pendingQueueSize().then(({ pendingCount, scheduledCount }) => {
      log.info({ pendingCount, scheduledCount });
    });
  }, 1500);

  setTimeout(() => {
    // running jobs are not cancelled
    // but no new job is started
    queueWorker.stop();
  }, 5000);

  // By default uses "myJob" as name
  await queueWorker.addJob({ data: {} });

  // Items with a lower priority value are prioritized, defaults to 0
  await queueWorker.addJob({ priority: 5, data: {} });

  // Add job with a different name
  await queueWorker.addJob({ name: "otherJob", data: {} });

  // Add job with scheduled time to run, defaults to immediately
  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 1); // Tomorrow
  await queueWorker.addJob({ scheduledAt, data: {} });

  // Returns a job id, so you can use it as a tracking id / use it as a foreign key
  const jobId = await queueWorker.addJob({ data: {} });

  // The same api is available in separate exported function, so you don't have to pass the queueWorker around
  const otherJobId = await addJobToQueue(sql, { name: "myJob", data: {} });

  // Get the average time to completion for jobs
  const start = new Date();
  start.setDate(start.getDate() - 1);
  const end = new Date();
  const average = await queueWorker.averageTimeToCompletion(start, end);
}
```

## Code-gen and structure

To reference to any of the postgres tables, or use any of the provided types,
this package exports its structure used for code generation with
[@lbu/code-gen](/code-gen.md).

This can be used as follows:

```js
import { storeStructure } from "@lbu/store";

// setup app
app.extend(storeStructure);

// Use group "store" if you want all of it,
// Else use references like `T.reference("store", "file)` so the generator will only include that type.
```
