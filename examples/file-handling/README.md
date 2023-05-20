# CRUD basics

This project is created using the
[file-handling](https://github.com/compasjs/compas/tree/main/examples/file-handling)
template via [create-compas](https://www.npmjs.com/package/create-compas).

```shell
# Via NPM
npx create-compas@latest --template file-handling

# Or with Yarn
yarn create compas --template file-handling
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
