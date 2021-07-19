# Postgres setup

Most projects also require some way of persisting data. Compas aides in
providing a PostgreSQL client and some utilities around setting up a database.

## Starting PostgreSQL

First that we need to make sure we have a running PostgreSQL instance. Compas
helps here, by managing a Docker based PostgreSQL server. Previously you have
already installed `@compas/cli`, which contains the necessary commands.

```shell
yarn compas docker up
```

As you may have seen in the output, it does not only start a PostgreSQL
container, but also a Minio container. Minio is a S3 compatible document store,
which can be used for saving files.

Some other docker commands provided by `@compas/cli`:

```shell
# Stop the running containers
yarn compas docker down
# Remove all created Docker containers and volumes
yarn compas docker clean
```

## Setup @compas/store

The `@compas/store` packages provides a few abstractions over PostgreSQL and
Minio:

- Schema migration runner
- Persistent file storage
- Cache files on local disk
- Job queue implementation, supporting priority, recurring jobs, scheduled jobs
  and multiple workers
- Session store compatible with the `session` middleware exported by
  `@compas/server`.
- Test databases for integration testing

These features are mostly powered by a set of environment variables. Add the
following to you `.env` file:

```txt
APP_NAME=compastodo
# Postgres
POSTGRES_HOST=localhost:5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
# Minio
MINIO_URI=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
```

Let's break it down a bit. `APP_NAME` is used in various places, but most
importantly it is the default name for your database, file bucket and logs. Then
we have some PostgreSQL connection configuration, kept as simple as possible,
and the same for Minio.

And lastly we need to install `@compas/store`:

```shell
yarn add @compas/store --exact
```

## Connecting

Now that we have everything setup, let's see if we can make a connection to
PostgreSQL. Create a file at `scripts/database.js` with the following contents:

```js
import { mainFn } from "@compas/stdlib";
import { newPostgresConnection } from "@compas/store";

// Remember, mainFn reads our `.env` file automatically
mainFn(import.meta, main);

async function main(logger) {
  const sql = await newPostgresConnection({
    createIfNotExists: true, // Create a new database if `compastodo` is not found
  });

  logger.info({
    result: await sql`SELECT 1 + 1 as "sum"`,
  });

  // Close the connection
  await sql.end();
}
```

This ties in various parts of your local environment. We don't have any tables
yet in our database, so we execute a ' simple' sum query and log the result. So
let's run it:

```shell
yarn compas database
# or
node ./scripts/database.js
```

## Services and testing

The database connection is most likely the best example where ES Module live
bindings shine. By setting the connection as such, we can quickly swap out the
database connection used in tests. Add the following to `src/services/core.js`

```js
export let sql = undefined;

export function setSql(connection) {
  if (logger) {
    logger.info("setting services->sql");
  }
  sql = connection;
}
```

Now create a file for some logic at `src/todo/events.js` with the following:

```js
import { sql } from "../services/core.js";

/**
 * Count all rows in "myTable"
 * @returns {Promise<number>}
 */
export async function todoCount() {
  const [result] = await sql`select COUNT(*) as sum from "myTable"`;

  return result.sum;
}
```

Notice that we don't have `myTable` yet, but we can still write a test for it.
Create `src/todo/events.test.js` and add the following contents:

```js
import { test, mainTestFn } from "@compas/cli";
import {
  createTestPostgresDatabase,
  cleanupTestPostgresDatabase,
} from "@compas/store";
import { sql, setSql } from "../services/core.js";
import { todoCount } from "./events.js";

test("todo/events", async (t) => {
  t.test("setup", async () => {
    // A sub test doesn't need to do any assertions
    setSql(await createTestPostgresDatabase());

    // Create `myTable`
    await sql`CREATE TABLE "myTable" ( id SERIAL PRIMARY KEY );`;
    // Insert some values
    await sql`INSERT INTO "myTable" ("id") VALUES (DEFAULT), (DEFAULT);`;
  });

  t.test("todoCount - return the correct number", async (t) => {
    // This uses our test connection, created above.
    const result = await todoCount();
    t.equal(result, 2);
  });

  t.test("teardown", async () => {
    // Cleans up the created database
    await cleanupTestPostgresDatabase(sql);
    // Make sure to reset the 'sql' variable
    setSql(undefined);
  });
});
```

For these cases `@compas/store` exports the function
`createTestPostgresDatabase` and `cleanupTestPostgresDatabase`. This creates a
structural copy of your database, truncating all tables and returns the
connection.
