# Postgres migrations

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

```ecmascript 6
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import {
  getMigrationsToBeApplied,
  newMigrateContext,
  newPostgresConnection,
  runMigrations,
} from "@lbu/store";

mainFn(import.meta, log, main);

async function main(logger) {
  const sql = newPostgresConnection({});
  const mc = await newMigrateContext(sql);
  logger.info(
    getMigrationsToBeApplied(mc).map((it) => ({
      namespace: it.namespace,
      number: it.number,
      repeatable: it.repeatable,
      fullPath: it.fullPath,
      isMigrated: it.isMigrated,
    })),
  );

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
