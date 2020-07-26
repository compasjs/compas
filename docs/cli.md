# CLI

The CLI provides a template and some useful commands. It includes watch and
reloading of scripts, linting, testing and more.

Run `yarn lbu help` for more information.

## Scripts

The cli currently understands a few different ways of running Node.js scripts.
First of all it searches for Javascript files in the `{root}/scripts` directory.
On top of that it will also load the scripts as defined `{root}/package.json`.

Say your scripts directory has the following structure:

```
/
/scripts
  - generate.js
  - api.js
```

And your package.json contains the following items:

```json
{
  "scripts": {
    "hello": "echo 'Hello!'"
  }
}
```

The following are all valid commands of running these scripts

```shell script
$ yarn lbu run generate
$ yarn lbu --node-arg api
$ yarn lbu hello
$ yarn lbu generate --my-argument
```

They also can be run in watch mode via Nodemon:

```shell script
$ yarn lbu --watch --node-argument generate --my-argument
```

It is also possible to provide the path to a Javascript file like so:

```shell script
$ yarn lbu run --watch --node-argument ./scrippts/generate.js --my-argument
```

## Builtin commands

- **init**: Initialize a new project in the current directory
- **lint**: This will run ESLint and Prettier over the whole project using
  'auto-fix' on both.
- **test**: Imports all `.test.js` files in the project. This is all that is
  needed for tape.
- **coverage**: Runs the test command with [c8](https://github.com/bcoe/c8) for
  coverage.
- **docker**: Manage Postgres and Minio containers. Available subcommands: `up`,
  `down` and `clean`
