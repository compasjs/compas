# Default Compas template

This project is created using the
[default](https://github.com/compasjs/compas/tree/main/examples/default)
template via [create-compas](https://www.npmjs.com/package/create-compas).

```shell
# Via NPM
npx create-compas@latest --template default

# Or with Yarn
yarn create compas --template default
```

## Getting started

- Start up the development Postgres and Minio instances
  - `compas docker up`
- Apply the Postgres migrations
  - `compas migrate`
- Regenerate router, validators, types, sql, etc.
  - `compas generate` / `compas generate application`
- Run the tests
  - `compas test --serial`

## Structure and features

This project is structured according to the
[default Compas template](https://github.com/compasjs/compas/tree/main/examples/default).

- Uses `@compas/eslint-plugin` with `compas lint` for running ESLint and
  Prettier
- Has code generation based on `@compas/code-gen`, with the definitions stored
  in `gen/*` and a custom command in `commands/generate.js`
- Contains 'global' services via
  [ES Module live bindings](https://stackoverflow.com/a/57552682) in
  `services/core.js`.
- Entrypoint for both starting the api via `compas run api` /
  `node ./scripts/api.js` and a background queue via `compas run queue` /
  `node ./scripts/queue.js`.
- Tests running on a temporary Postgres database, temporary S3 bucket and
  validating responses.
