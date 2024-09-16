# Postgres migrations

::: tip

Requires `@compas/cli` and `@compas/store` to be installed

:::

## Migration files

Compas cli comes with a migration runner built-in. This is based on various migration
functions exported from @compas/store. The migration system supports two types of
migrations:

- Forward migrations
- Repeatable migrations

Forward migrations are a way of only advancing the schema state. So when you need to
rollback a change, a new forward migration needs to be created.

Repeatable migrations can be used in combination with `CREATE OR REPLACE` with for example
views. If the hash of the current repeatable migration is not equal to the last execution
stored in the database, the migration is executed.

Every migration file gets a new transaction by default. To skip transaction creation, add
`-- disable auto transaction` in your file.

The migrations files are expected to live in `$project/migrations` directory. The file
names should be in the following format: `001-name.sql` or `002-r-long-name.sql` for
repeatable migrations.

We also support JavaScript based migrations, this allows you to do conditional logic based
on environment settings. A JavaScript migration file follows the same file format as sql
files: `002-my-js-migration.js`. To disable automatic transactions you can use
`// disable auto transaction` anywhere in the file.

The file is imported by the migration runner and expected to export the following
migration function:

```js
export async function migrate(sql) {
	// Do migrations
}
```

Note that it is suggested to keep the amount of differences per environment to a minimal,
since it makes issues harder to debug.

See the CLI reference for [`compas migrate`](/references/cli.html#compas-migrate) for the
build-in migration runner.
