# Postgres and Minio

::: tip

Requires `@compas/store` to be installed

:::

Most projects also require some way of persisting data. Compas aides in
providing a PostgreSQL client and some utilities around setting up a database.

## Starting PostgreSQL

First that we need to make sure we have a running PostgreSQL instance. Compas
helps here, by managing a Docker based PostgreSQL server. Previously you have
already installed `@compas/cli`, which contains the necessary commands.

```shell
compas docker up
```

As you may have seen in the output, it does not only start a PostgreSQL
container, but also a Minio container. Minio is a S3 compatible document store,
which can be used for saving files.

Some other docker commands provided by `@compas/cli`:

```shell
# Stop the running containers
compas docker down
# Remove all created Docker containers and volumes
compas docker clean
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
yet in our database, so we execute a sum query and log the result. So let's run
it:

```shell
compas database
# or
node ./scripts/database.js
```
