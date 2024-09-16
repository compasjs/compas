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


| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |


## `compas completions`

Configure shell auto-complete for this CLI.

| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |


## `compas check-env`

Various checks helping with a better Compas experience.

This command is able to check a few things in the current project, to see if it is optimally configured.
  
- '.env.local' should be in the .gitignore
- '.cache' should be in the .gitignore
- Only a single Compas version should be installed
- Docker should be available to use with `compas docker`


| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |


## `compas code-mod`

Execute code-mods to help migrating to new Compas versions.

Since Compas generates quite a bit of boilerplate, this command can help you migrate to new Compas versions that have breaking changes in generated code. By detecting usage patterns of the generated output of a previous Compas version, it can migrate (most of) your usages to whatever the new version brings.

| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |


### `compas code-mod list`

List the available code-mods.

| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |


### `compas code-mod exec`

Execute the specified code-mod.

| Option | Description |
| --- | --- |
| --name | The code-mod name to execute. (string, required) |
| -h, --help | Display information about the current command. (boolean) |


## `compas docker`

Manage common docker components.

Manages a single PostgreSQL and Minio container for use in all your local projects.
It can switch between multiple PostgreSQL versions (12-16 are supported via --postgres-version), however only a single version can be 'up' at a time.

PostgreSQL credentials:
> postgresql://postgres:postgres@127.0.0.1:5432/postgres

Minio credentials:
- ACCESS_KEY: minio
- SECRET_KEY: minio123

You can prevent Docker usage, but still use commands like 'compas docker clean' with either the '--use-host' flag or by setting 'COMPAS_SKIP_DOCKER=true' in your environment.

---
Don't use this command and secrets for your production deployment.


| Option | Description |
| --- | --- |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number) |
| --use-host | Skip Docker altogether and assume that Postgres and Minio are enabled on the host. Alternatively, set COMPAS_SKIP_DOCKER=true. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


### `compas docker up`

Start the managed containers.

| Option | Description |
| --- | --- |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number) |
| --use-host | Skip Docker altogether and assume that Postgres and Minio are enabled on the host. Alternatively, set COMPAS_SKIP_DOCKER=true. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


### `compas docker down`

Stop the managed containers.

Stop any of the containers that could possibly be started by this CLI.
It ignores context and stops any PostgreSQL container started by this CLI, ignoring `--postgres-version`.

| Option | Description |
| --- | --- |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number) |
| --use-host | Skip Docker altogether and assume that Postgres and Minio are enabled on the host. Alternatively, set COMPAS_SKIP_DOCKER=true. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


### `compas docker clean`

Clean up all containers and volumes, or only the PostgreSQL databases of the specified projects.

When no arguments are passed, all created docker containers and volumes are removed.

By passing '--project', it can clean up PostgreSQL databases without having to restart the containers.
The flag is repeatable, so multiple projects can be cleaned at the same time. If no value is passed, it defaults to 'process.env.APP_NAME'.


| Option | Description |
| --- | --- |
| --project | Specify the project(s) to remove. If no value is passed, the current project is read from `environment.APP_NAME`. (booleanOrString[]) |
| --postgres-version | Specify the PostgreSQL version to use. Defaults to 12. (number) |
| --use-host | Skip Docker altogether and assume that Postgres and Minio are enabled on the host. Alternatively, set COMPAS_SKIP_DOCKER=true. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


## `compas init`

Init various files in the current project.

| Option | Description |
| --- | --- |
| --all | Enable '--gitignore', '--jsconfig' and '--lint-config'. (boolean) |
| --gitignore | Creates or overwrites the .gitignore, with defaults for IDE(s), Yarn/NPM and caches. (boolean) |
| --jsconfig | Creates or overwrites the root jsconfig.json file, to use with the Typescript Language Server. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


## `compas lint`

Lint all project files.

Uses Prettier and ESLint to lint project files.
  
ESLint is used for all JavaScript files and Prettier runs on JavaScript, JSON, Markdown, and YAML files.
The default configuration can be initialized via 'compas init --lint-config'.

If the 'lint' (or 'lint:ci') script exists, they are preferred over manually running ESLint and Prettier.


| Option | Description |
| --- | --- |
| --skip-prettier | Skip running Prettier. (boolean) |
| --skip-eslint | Skip running ESLint. (boolean) |
| --eslint-cache-location | Location of ESLint cache directory. Defaults to '.cache/eslint/'. (string) |
| -h, --help | Display information about the current command. (boolean) |


## `compas migrate`

Run PostgreSQL migrations via the @compas/store migration system.

The migrations are managed via the @compas/store provided system. And are forward only.

A custom Postgres connection object can be provided by exporting a 'postgresConnectionSettings' object from the files specified via the '--connection-settings' flag.


| Option | Description |
| --- | --- |
| --connection-settings | Specify a path that contains the PostgreSQL connection object. (string) |
| --watch | Run the command, restarting it when file changes happen. See 'compas help watch' for more information. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


### `compas migrate info`

Print the current migration state.

Print information about the migration state and exit. The information consists
of migrations that are not applied yet, and migrations that have 'hashChanges',
basically saying that the file on disk is out of sync with the migration that
was applied in the past.


| Option | Description |
| --- | --- |
| --connection-settings | Specify a path that contains the PostgreSQL connection object. (string) |
| --watch | Run the command, restarting it when file changes happen. See 'compas help watch' for more information. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


### `compas migrate rebuild`

Recreate migration state based on the file system.

Rebuild migration table with current file state. This allows for reordering
migrations, squashing migrations and other things that alter the migration
files, but do not affect the schema in any way. Note that Compas can't enforce
any consistency between the migration files and the current schema state. So use
with caution.


| Option | Description |
| --- | --- |
| --connection-settings | Specify a path that contains the PostgreSQL connection object. (string) |
| --watch | Run the command, restarting it when file changes happen. See 'compas help watch' for more information. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


## `compas run`

Run arbitrary JavaScript files, scripts defined in the package.json and scripts located in the scripts directory.

| Option | Description |
| --- | --- |
| --script-args | Arguments passed as is to the script when executed (like '--port 3000'). (string) |
| --node-args | Arguments passed to Node when executing the script (like '--inspect'). (string) |
| -h, --help | Display information about the current command. (boolean) |


### `compas run $script`

The file or script to run.

| Option | Description |
| --- | --- |
| --watch | Run the command, restarting it when file changes happen. See 'compas help watch' for more information. (boolean) |
| --script-args | Arguments passed as is to the script when executed (like '--port 3000'). (string) |
| --node-args | Arguments passed to Node when executing the script (like '--inspect'). (string) |
| -h, --help | Display information about the current command. (boolean) |


## `compas test`

Run all tests in your project.

The test runner searches for all files ending with '.test.js' and runs them.
Tests run in series in a single worker and subtests run serially in the order they are defined. If '--serial' is not passed, there will be multiple workers each executing parts of the tests.

Test files should be ordinary JavaScript files. By calling 'mainTestFn' at the top of your file you can still use 'node ./path/to/file.test.js' to execute the tests.
  
Global configuration can be applied to the test runners via a 'test/config.js' file.
A global timeout can be configured by setting 'export const timeout = 2500;'. The value is specified in milliseconds.
There is also a global 'setup' and 'teardown' function that can be exported from the 'test/config.js' file. They may return a Promise.

To prevent flaky tests, '--randomize-rounds' can be used. This shuffles the order in which the tests are started. And prevents dependencies between test files. Making it easier to run a single test file via for examples 'compas run ./path/to/file.test.js'.

Collecting and processing coverage information is done using C8. Use one of the supported configuration files by C8 to alter its behaviour. See https://www.npmjs.com/package/c8 for more information.


| Option | Description |
| --- | --- |
| --serial | Run tests serially instead of in parallel. Alternatively set '--parallel-count 1' (boolean) |
| --bail | Exit the test runner after the first failed assertion. Requires '--serial'. (boolean) |
| --parallel-count | The number of workers to use, when running in parallel. Defaulting to (the number of CPU cores - 1) or 4, whichever is lower. (number) |
| --randomize-rounds | Runs test the specified amount of times, shuffling the test file order between runs. (number) |
| --coverage | Collect coverage information while running the tests. (boolean) |
| --with-logs | Enable output of application loggers in the tests. (boolean) |
| --watch | Run the command, restarting it when file changes happen. See 'compas help watch' for more information. (boolean) |
| -h, --help | Display information about the current command. (boolean) |


## `compas version`

Print the installed Compas version and exit

| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |


## `compas help`

Display help for any of the available commands.

// TODO

| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |


## `compas watch`

Run the command, restarting it when file changes happen.

Some commands in this CLI can be watched. 
They can be executed via `compas watch [..subCommand]` or by adding the '--watch' flag when invoking the command.

The watching happens by monitoring all the files in your project and restarting the command once files are changed. Manually restarting is also possible by sending `rs<enter>` to the program.

Watch behaviour can be tuned by commands. Setting 'modifiers.isWatchable' to 'true' is necessary for it to allow watching, and 'watchSettings' can be specified with custom extensions to be watched or specific directories to ignore. When watch behavior is needed for custom scripts, following the steps in [extending the cli](https://compasjs.com/features/extending-the-cli.html) is mandatory.

```js
export const cliDefinition = {
  name: "my-command",
  shortDescription: "My command",
  modifiers: {
    isWatchable: true, // This is mandatory
  },
  watchSettings: {
    extensions: ["js", "ts"], // Defaults to '["js", "json"]'
    ignorePatterns: ["__fixtures__"], // Defaults to '[".cache", "coverage", "node_modules"]'
  },
}
```


You can also add a compas config file at 'config/compas.{js,json}' to specify project specific items. They are appended to the specification of the command and can be used if your tests write files that may trigger the watcher. See the [Compas configuration reference](https://compasjs.com/references/compas-config.html) for more information about the allowed options.

```json
{
  "cli": {
   "globalWatchOptions": {
      "extensions": [],
      "ignorePatterns": ["__fixtures__", "test/tmp"]
    }
  }
}
```


| Option | Description |
| --- | --- |
| -h, --help | Display information about the current command. (boolean) |
