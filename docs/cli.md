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

?> You can manually restart processes in watch-mode, by typing `rs` and pressing
enter.

## Builtin commands

```
Usage:

- init              : lbu init [projectName]
- help              : lbu help
- docker            : lbu docker [up,down,clean,reset]
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

## Testing

The cli also contains a basic test runner. The general idea behind this test
runner is that there is no difference between running `yarn lbu test`,
`node ./path/file.test.js` and `yarn lbu ./path/file.test.js`, but still
providing the necessary utilities for your assertions.

This package exports two items related to testing:

- mainTestFn: A wrapper around `@lbu/stdlib` to start the runner if necessary.
  This allows the runner to work the same regardless of `node ./file.test.js` or
  `yarn lbu test`
- test: Registering tests happens via this function. Any callback to `test` or
  `t.test` can be async.

For some more specifics check the
[How-to's](https://compasjs.com/how-to.html#testing) about testing.

## Benchmarking

Working a lot like the test runner, this package also exposes a benchmark
runner. We also have two exports related to benchmarking:

- mainBenchFn: Inline with `mainTestFn`, wraps `mainFn` to start the runner if
  necessary.
- bench: Register a benchmark

The runner works by calling your callback with an increasing value on `b.N`. The
callback should then loop `b.N` times while doing the benchmarked operation. If
a callback invocation takes longer than 1 second, or the maximum value of `b.N`
is reached, the average nanoseconds per operation is calculated and printed with
the other results.

When setup is needed you can call `b.resetTime()` can be called. Note that
benchmarking in JavaScript is hard, and the results should be taken with a grain
of salt.
