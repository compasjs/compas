# Migrations integration

Combining the [Docker integration](/docs/integrations/docker.html) and the
[migrations features](/features/migrations.html) from `@compas/store`, Compas
can prompt you to migrate you Postgres database when necessary.

## Getting started

Enabling this integration can be done by running:

```shell
compas init migrations
```

This executes a few things:

- It creates a migration directory, if not exists.
- Adds `@compas/store` as a dependency to your project.
- Adds the following contents to your config in `config/compas.json`:

```json
{
  "migrations": {}
}
```

## Config

There is nothing to configure for this setup. Compas automatically prompts to
either migrate or rebuild the database.

- Migrate executes the pending migrations.
- Rebuild clears the full database and runs all migrations from scratch.

## Limitations

- Compas assumes that you have Postgres running.
- Compas only supports this feature when the
  [migrations are used from `@compas/store`](/features/migrations.html).
