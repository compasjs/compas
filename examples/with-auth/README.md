# With Auth Compas template

This project is created using the
[with-auth](https://github.com/compasjs/compas/tree/main/examples/with-auth) template.

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

- Uses `@compas/eslint-plugin` with `compas lint` for running ESLint and Prettier
- Has code generation based on `@compas/code-gen`, with the definitions stored in `gen/*`
  and a custom command in `commands/generate.js`
- Contains 'global' services via
  [ES Module live bindings](https://stackoverflow.com/a/57552682) in `services/core.js`.
- Entrypoint for both starting the api via `compas run api` / `node ./scripts/api.js` and
  a background queue via `compas run queue` / `node ./scripts/queue.js`.
- Tests running on a temporary Postgres database, temporary S3 bucket and validating
  responses.

## Auth

This project is created with support for sessions provided by
[@compas/store](https://compasjs.com/features/session-handling.html). It is a minimal
setup where someone can register with email and password, is able to login, logout and get
information about when they have registered. The `userHandlers.me` implementation uses
`userResolveSession` which you can use in your own routes. The other provided routes use
the session-store and session-transport functions from Compas to manage session creation,
extension and removal.

There is no logic included for email validation, password reset flows or removing the
user.
