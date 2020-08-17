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

They also can be run in watch mode:

```shell script
$ yarn lbu --watch --node-argument generate --my-argument
```

It is also possible to provide the path to a Javascript file like so:

```shell script
$ yarn lbu run --watch --node-argument ./scrippts/generate.js --my-argument
```

## Builtin commands

```
Usage:

- init              : lbu init [projectName]
- help              : lbu help
- docker            : lbu docker [up,down,clean]
- proxy             : lbu proxy
- run (explicit)    : lbu run [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- run (implicit)    : lbu [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- test              : lbu test [--watch] [--verbose] [--node-arg]
- bench             : lbu bench [--watch] [--verbose] [--node-arg]
- coverage          : lbu coverage [--watch] [--verbose] [--any-node-arg] [-- --c8-arg]
- lint              : lbu lint [--watch] [--verbose] [--any-node-arg]


Available script names:
User: ...
Package.json: ...

Custom scripts may control watch behaviour by exporting a constant called 'cliWatchOptions' with type CliWatchOptions
from the script.
```
