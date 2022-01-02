# `compas`

The Compas CLI

Unified backend tooling.

Examples:

- compas docker up
- compas lint --jsdoc
- compas visualise erd --generated-directory ./src/generated

References:

- Docs: https://compasjs.com
- Source: https://github.com/compasjs/compas
- Issues: https://github.com/compasjs/compas/issues

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

## `compas bench`

Run all '.bench.js' files in this project.

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

## `compas check-env`

Various checks helping with a better Compas experience.

This command is able to check a few things in the current project, to see if it
is optimally configured.

- Checks if the '.env.local' is in the .gitignore if it exists
- Checks if all Compas packages are the same version

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

## `compas code-mod`

Execute code-mods to help migrating to new Compas versions.

Since Compas generates quite a bit of boilerplate, this command can help you
migrate to new Compas versions that have breaking changes in generated code. By
detecting usage patterns of the generated output of a previous Compas version,
it can migrate (most of) your usages to whatever the new version brings.

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

### `compas code-mod list`

List the available code-mods.

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

### `compas code-mod exec`

Execute the specified code-mod.

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --name     | The code-mod name to execute. (string, required)         |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

## `compas docker`

Manage common docker components.

Manages a single PostgreSQL and Minio container for use in all your local
projects. It can switch between multiple PostgreSQL versions (12, 13 and 14 are
supported via --postgres-version), however only a single version can be 'up' at
a time.

PostgreSQL credentials:

> postgresql://postgres:postgres@localhost:5432/postgres

Minio credentials:

- ACCESS_KEY: minio
- SECRET_KEY: minio123

Don't use this command and secrets for your production deployment.

| Option             | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number) |
| --timings          | Print information about CLI execution time. (boolean)           |
| -h, --help         | Display information about the current command. (boolean)        |

### `compas docker up`

Start the managed containers.

| Option             | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number) |
| --timings          | Print information about CLI execution time. (boolean)           |
| -h, --help         | Display information about the current command. (boolean)        |

### `compas docker down`

Stop the managed containers.

Stop any of the containers that could possibly be started by this CLI. It
ignores context and stops any PostgreSQL container started by this CLI, ignoring
`--postgres-version`.

| Option             | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number) |
| --timings          | Print information about CLI execution time. (boolean)           |
| -h, --help         | Display information about the current command. (boolean)        |

### `compas docker clean`

Clean up all containers and volumes, or only the PostgreSQL databases of the
specified projects.

When no arguments are passed, all created docker containers and volumes are
removed.

By passing '--project', it can clean up PostgreSQL databases without having to
restart the containers. The flag is repeatable, so multiple projects can be
cleaned at the same time. If no value is passed, it defaults to
'process.env.APP_NAME'.

| Option             | Description                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| --project          | Specify the project(s) to remove. If no value is passed, the current project is read from `environment.APP_NAME`. (booleanOrString[]) |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number)                                                                       |
| --timings          | Print information about CLI execution time. (boolean)                                                                                 |
| -h, --help         | Display information about the current command. (boolean)                                                                              |

## `compas init`

Init various files in the current project.

| Option        | Description                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| --jsconfig    | Creates or overwrites the root jsconfig.json file, to use with the Typescript Language Server. (boolean)                                       |
| --lint-config | Creates or overwrites .eslintrc.cjs, .eslintignore and .prettierignore files, and overwrites the 'prettier' key in the package.json. (boolean) |
| --timings     | Print information about CLI execution time. (boolean)                                                                                          |
| -h, --help    | Display information about the current command. (boolean)                                                                                       |

## `compas lint`

Lint all project files.

Uses Prettier and ESLint to lint project files.

ESLint is used for all JavaScript files and Prettier runs on JavaScript, JSON,
Markdown, and YAML files. The default configuration can be initialized via
'compas init --lint-config'.

| Option     | Description                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------- |
| --jsdoc    | Run ESLint with JSDoc rules enabled. This could degrade performance on big projects. (boolean) |
| --timings  | Print information about CLI execution time. (boolean)                                          |
| -h, --help | Display information about the current command. (boolean)                                       |

## `compas migrate`

Run PostgreSQL migrations via the @compas/store migration system.

The migrations are managed via the @compas/store provided system. And are
forward only.

A custom Postgres connection object can be provided by exporting a
'postgresConnectionSettings' object from the files specified via the
'--connection-settings' flag.

This command can keep running if for example your deploy system does not support
one of tasks. You can use '--keep-alive' for that. It keeps a single Postgres
connection alive to ensure that the process doesn't exit. The migration runner
uses an advisory lock to ensure only a single migration process runs at the same
time. To disable this behaviour when the command enters watch mode,
'--without-lock' can be passed.

| Option                | Description                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| --connection-settings | Specify a path that contains the PostgreSQL connection object. (string)                                                  |
| --keep-alive          | Keep the service running, by maintaining a single idle SQL connection. (boolean)                                         |
| --without-lock        | Drop the migration lock, before entering the keep-alive state. Only used when `--keep-alive` is passed as well (boolean) |
| --timings             | Print information about CLI execution time. (boolean)                                                                    |
| -h, --help            | Display information about the current command. (boolean)                                                                 |

### `compas migrate info`

Print the current migration state.

| Option                | Description                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| --connection-settings | Specify a path that contains the PostgreSQL connection object. (string)                                                  |
| --keep-alive          | Keep the service running, by maintaining a single idle SQL connection. (boolean)                                         |
| --without-lock        | Drop the migration lock, before entering the keep-alive state. Only used when `--keep-alive` is passed as well (boolean) |
| --timings             | Print information about CLI execution time. (boolean)                                                                    |
| -h, --help            | Display information about the current command. (boolean)                                                                 |

### `compas migrate rebuild`

Recreate migration state based on the file system.

| Option                | Description                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| --connection-settings | Specify a path that contains the PostgreSQL connection object. (string)                                                  |
| --keep-alive          | Keep the service running, by maintaining a single idle SQL connection. (boolean)                                         |
| --without-lock        | Drop the migration lock, before entering the keep-alive state. Only used when `--keep-alive` is passed as well (boolean) |
| --timings             | Print information about CLI execution time. (boolean)                                                                    |
| -h, --help            | Display information about the current command. (boolean)                                                                 |

## `compas proxy`

Proxy a remote API via localhost.

It handles CORS pre-flight requests locally and proxies all other requests to
the target.

This is fully configured via environment variables:

- API_URL,NEXT_PUBLIC_API_URL: the url which is expected by your frontend.
  Should be in the form of 'http://localhost:$PORT'. This determines the port to
  listen on.
- PROXY_URL: the target used for passing the proxy-ed requests to.

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

## `compas run`

Run arbitrary JavaScript files, scripts defined in the package.json and scripts
located in the scripts directory.

| Option        | Description                                              |
| ------------- | -------------------------------------------------------- |
| --script-args | undefined (string)                                       |
| --node-args   | undefined (string)                                       |
| --timings     | Print information about CLI execution time. (boolean)    |
| -h, --help    | Display information about the current command. (boolean) |

### `compas run $script`

The file or script to run.

| Option        | Description                                              |
| ------------- | -------------------------------------------------------- |
| --script-args | undefined (string)                                       |
| --node-args   | undefined (string)                                       |
| --timings     | Print information about CLI execution time. (boolean)    |
| -h, --help    | Display information about the current command. (boolean) |

## `compas test`

Run all tests in your project.

The test runner searches for all files ending with '.test.js' and runs them.
Tests run in series in a single worker and subtests run serially in the order
they are defined. If '--serial' is not passed, there will be multiple workers
each executing parts of the tests.

Test files should be ordinary JavaScript files. By calling 'mainTestFn' at the
top of your file you can still use 'node ./path/to/file.test.js' to execute the
tests.

Global configuration can be applied to the test runners via a 'test/config.js'
file. A global timeout can be configured by setting 'export const timeout =
2500;'. The value is specified in milliseconds. By default, every subtest should
have at least a single assertion or register a subtest via 't.test()'. To
disable this, you can set 'export const enforceSingleAssertion = false'. There
is also a global 'setup' and 'teardown' function that can be exported from the
'test/config.js' file. They may return a Promise.

To prevent flaky tests, '--randomize-rounds' can be used. This shuffles the
order in which the tests are started. And prevents dependencies between test
files. Making it easier to run a single test file via for examples 'compas run
./path/to/file.test.js'.

Collecting and processing coverage information is done using C8. Use one of the
supported configuration files by C8 to alter its behaviour. See
https://www.npmjs.com/package/c8 for more information.

| Option             | Description                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| --serial           | Run tests serially instead of in parallel. Alternatively set '--parallel-count 1' (boolean)                                            |
| --parallel-count   | The number of workers to use, when running in parallel. Defaulting to (the number of CPU cores - 1) or 4, whichever is lower. (number) |
| --randomize-rounds | Runs test the specified amount of times, shuffling the test file order between runs. (number)                                          |
| --coverage         | Collect coverage information while running the tests. (boolean)                                                                        |
| --timings          | Print information about CLI execution time. (boolean)                                                                                  |
| -h, --help         | Display information about the current command. (boolean)                                                                               |

## `compas version`

Print the installed Compas version and exit

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

## `compas visualise`

Visualise various code-generated structures.

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |

### `compas visualise erd`

Visualise entity structure and relations in a diagram.

| Option                | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| --generated-directory | The directory containing the generated files. (string, required)               |
| --format              | Output file format. Supports png, webp, pdf and svg. Defaults to svg. (string) |
| --output              | Path to write the output to. Defaults to a random temporary file. (string)     |
| --timings             | Print information about CLI execution time. (boolean)                          |
| -h, --help            | Display information about the current command. (boolean)                       |

## `compas help`

Display help for any of the available commands.

// TODO

| Option     | Description                                              |
| ---------- | -------------------------------------------------------- |
| --timings  | Print information about CLI execution time. (boolean)    |
| -h, --help | Display information about the current command. (boolean) |
