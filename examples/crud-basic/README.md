# CRUD basics

This project is created using the
[crud-basic](https://github.com/compasjs/compas/tree/main/examples/crud-basic) template.

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
