# CRUD basics

This project is created using the
[crud-nested](https://github.com/compasjs/compas/tree/main/examples/crud-nested)
template via [create-compas](https://www.npmjs.com/package/create-compas).

```shell
# Via NPM
npx create-compas@latest --template crud-nested

# Or with Yarn
yarn create compas --template crud-nested
```

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
