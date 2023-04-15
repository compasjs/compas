# Minimal CRUD api for managing todo's

This project is created using the
[crud-simple-todo](https://github.com/compasjs/compas/tree/main/examples/crud-simple-todo)
template via [create-compas](https://www.npmjs.com/package/create-compas).

```shell
# Via NPM
npx create-compas@latest --template crud-simple-todo

# Or with Yarn
yarn create compas --template crud-simple-todo
```

It uses a few Compas features, most notably:

- The code-generators, more specifically, CRUD generators and the generated api
  clients
- Postgres related features like migrations and test databases

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
