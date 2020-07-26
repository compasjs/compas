# {{name}} backend

Backend powered by lbu version {{version}}.

For more information on LBU see the [docs](https://lbu.lightbase.nl).

## Getting started

```shell script
yarn
yarn lbu docker up
yarn lbu migrate
yarn lbu test
yarn lbu help
```

## Scripts

There are various scripts provided out of the box. These are stored in
`/scripts` where the lbu cli will find them. So they are runnable by using
`yarn lbu [name]` or `node ./scripts/[name].js`

- **api**: Run the api
- **generate**: Run the code generators
- **migrate**: Run the migrations
- **queue**: Run a job queue worker

## Services

The services directory in combination with the `/service.js` and `/testing.js`
files are setup for ease of integration testing. While running normally, e.g.
`yarn lbu api`, the function `injectServices` is used. This function sets up all
services. When testing the functions `injectTestServices` and
`cleanupTestServices` can be used.

Other than that services are globally importable, even if they are not injected
yet. Some useful things to add:

- external api's, with the possibility of just injecting a mock in
  `injectTestServices`.
- configuration that may differ when testing

This concept works based on ES modules live bindings. Live bindings boils down
to the fact that a file that exports a `let` variable can modify it's value,
where the changes are directly observed by another module that imports the
variable. Or in other words, a read-only reference to the original declared
variable.
