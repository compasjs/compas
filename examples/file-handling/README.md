# CRUD basics

This project is created using the
[file-handling](https://github.com/compasjs/compas/tree/main/examples/file-handling)
template.

## Maintenance mode

Compas is in maintenance mode. The packages will be maintained for the foreseeable future.
New features might be added, but some will also be dropped in favor of other
ecosystem-available libraries. Please don't start new projects using Compas.

## Getting started

- Start up the development Postgres and Minio instances
  - `compas docker up`
- Apply the Postgres migrations
  - `compas migrate`
- Regenerate router, validators, types, sql, etc.
  - `compas run generate`
- Run the tests
  - `compas test --serial`
- Start the API
  - `compas run api`
