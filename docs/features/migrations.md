# Migrations

Compas cli comes with a migration runner built-in. This is based on various
migration functions exported from @compas/store. The migration system supports
two types of migrations:

- Forward migrations
- Repeatable migrations

Forward migrations are a way of only advancing the schema state. So when you
need to rollback a change, a new forward migration needs to be created.

Repeatable migrations can be used in combination with `CREATE OR REPLACE` with
for example views. If the hash of the current repeatable migration is not equal
to the last execution stored in the database, the migration is executed.

Every migration file gets a new transaction by default. To skip transaction
creation, add `-- disable auto transaction` in your file.

The migrations files are expected to live in `$project/migrations` directory.
The file names should be in the following format: `001-name.sql` or
`002-r-long-name.sql` for repeatable migrations.

To start using the migration system, see
[Built-in migration requirements](#built-in-migration-requirements)

## Synopsis of @compas/cli

`compas docker migrate [rebuild|info] [--keep-alive]`

### `compas docker migrate`

Read the `$project/migrations` directory, print out migration information, see
`compas docker migrate info`, and execute the pending migrations. The process
exits afterwards.

### `compas docker migrate info`

Print information about the migration state and exit. The information consists
of migrations that are not applied yet, and migrations that have 'hashChanges',
basically saying that the file on disk is out of sync with the migration that
was applied in the past.

### `compas docker migrate rebuild`

Rebuild migration table with current file state. This allows for reordering
migrations, squashing migrations and other things that alter the migration
files, but do not affect the schema in any way. Note that Compas can't enforce
any consistency between the migration files and the current schema state. So use
with caution.

### `compas docker migrate --keep-alive`

Same as `compas docker migrate`, except keeping the Postgres connection running.
This is useful when your deploy solution doesn't allow for one of commands, but
allows private services that consume some sporadic resources.

## Built-in migration requirements

Since @compas/store also uses Postgres it also includes a migration. When you
start using @compas/store you should copy the current 'final' definition from
below. When Compas is bumped you'd need to check if the release notes contain a
migration that needs to be executed.

It is expected that the below migration is your first migration
(`001-compas-store-init.sql`) since it includes the 'migration' table.

```sql
-- Initial @compas/store migration for version vx.x.x
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE migration
(
  "namespace" varchar NOT NULL,
  "number"    int,
  "name"      varchar NOT NULL,
  "createdAt" timestamptz DEFAULT now(),
  "hash"      varchar
);

CREATE INDEX migration_namespace_number_idx ON "migration" ("namespace", "number");

CREATE TABLE "file"
(
  "id"            uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "contentLength" int              NOT NULL,
  "bucketName"    varchar          NOT NULL,
  "contentType"   varchar          NOT NULL,
  "name"          varchar          NOT NULL,
  "meta"          jsonb            NOT NULL,
  "createdAt"     timestamptz      NOT NULL DEFAULT now(),
  "updatedAt"     timestamptz      NOT NULL DEFAULT now(),
  "deletedAt"     timestamptz      NULL
);

CREATE INDEX "fileBucketNameIdx" ON "file" ("bucketName");
CREATE INDEX "fileDeletedAtIdx" ON "file" ("deletedAt");

CREATE TABLE "session"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "expires"   timestamptz      NOT NULL,
  "data"      jsonb            NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX "sessionExpiresIdx" ON "session" ("expires");

CREATE TABLE "job"
(
  "id"             bigserial PRIMARY KEY NOT NULL,
  "isComplete"     boolean               NOT NULL,
  "priority"       int                   NOT NULL,
  "retryCount"     int                   NOT NULL DEFAULT 0,
  "name"           varchar               NOT NULL,
  "scheduledAt"    timestamptz           NOT NULL DEFAULT now(),
  "data"           jsonb                 NOT NULL,
  "handlerTimeout" int                   NULL,
  "createdAt"      timestamptz           NOT NULL DEFAULT now(),
  "updatedAt"      timestamptz           NOT NULL DEFAULT now()
);

CREATE INDEX "jobIsCompleteScheduledAtIdx" ON "job" ("isComplete", "scheduledAt");
CREATE INDEX "jobNameIdx" ON "job" ("name");
CREATE INDEX "jobScheduledAtIdx" ON "job" ("scheduledAt");

CREATE TABLE "fileGroup"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "order"     int              NOT NULL,
  "file"      uuid             NULL,
  "parent"    uuid             NULL,
  "name"      varchar          NULL,
  "meta"      jsonb            NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now(),
  "deletedAt" timestamptz      NULL,
  -- Both file and parent fields are optional, since we expect either one of them to exists
  -- However we still want to cascade hard deletes
  CONSTRAINT "fileGroupFileFk" FOREIGN KEY ("file") REFERENCES "file" ("id") ON DELETE CASCADE,
  CONSTRAINT "fileGroupParentFk" FOREIGN KEY ("parent") REFERENCES "fileGroup" ("id") ON DELETE CASCADE
);

CREATE INDEX "fileGroupFileIdx" ON "fileGroup" ("file");
CREATE INDEX "fileGroupParentIdx" ON "fileGroup" ("parent");
CREATE INDEX "fileGroupDeletedAtIdx" ON "fileGroup" ("deletedAt");
CREATE INDEX "fileGroupOrderIdx" ON "fileGroup" ("order");
```
