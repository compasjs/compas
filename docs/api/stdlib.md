---
editLink: false
---

# @compas\/stdlib

## mainFn

_Available since 0.1.0_

_function mainFn(meta, cb): void_

Process entrypoint executor

Checks if the provided import.meta source is used as the project entrypoint. If
so, reads the .env file, prepares the environmentCache, adds some handlers for
uncaught exceptions, and calls the provided callback

**Parameters**:

- meta `ImportMeta`
- cb `MainFnCallback`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/utils.js#L69)_

## newLogger

_Available since 0.1.0_

_function newLogger(options?): Logger_

Create a new logger instance

**Parameters**:

- options `LoggerOptions|undefined?`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/logger/logger.js#L39)_

## newEvent

_Available since 0.1.0_

_function newEvent(logger, signal?): InsightEvent_

Create a new event from a logger

**Parameters**:

- logger `Logger`: Logger should have a context, like the default `ctx.log`
- signal `AbortSignal|undefined?`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/events.js#L86)_

## newEventFromEvent

_Available since 0.1.0_

_function newEventFromEvent(event): InsightEvent_

Create a 'child' event, reuses the logger, adds callstack to the passed event

**Parameters**:

- event `InsightEvent`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/events.js#L98)_

## eventStart

_Available since 0.1.0_

_function eventStart(event, name): void_

Track event start times

**Parameters**:

- event `InsightEvent`
- name `string`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/events.js#L131)_

## eventStop

_Available since 0.1.0_

_function eventStop(event): void_

Track event end times and log if necessary

**Parameters**:

- event `InsightEvent`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/events.js#L193)_

## isProduction

_Available since 0.1.0_

_function isProduction(): boolean_

Returns true when the `NODE_ENV` variable is not set, or when it does not equal
to `development`. This allows for a 'safe by default' experience.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/env.js#L38)_

## isStaging

_Available since 0.1.0_

_function isStaging(): boolean_

Returns true when `NODE_ENV` is explicitly set to 'development' or when the
environment variable `IS_STAGING` is explicitly set to 'true'.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/env.js#L50)_

## refreshEnvironmentCache

_Available since 0.1.0_

_function refreshEnvironmentCache(): void_

Repopulate the cached environment copy.

This should only be necessary when you or a package mutates the environment
variables. The `mainFn` / `mainTestFn` / `mainBenchFn` / ... will call this
function by default after loading your `.env` file. Accessing an environment
variable via `process.env.XXXX` is relatively slow compared to direct property
access. As can be seen in the following benchmark:

```txt
property access       500000000  iterations     0  ns/op
process.env access      5000000  iterations   246  ns/op
```

See this thread: https://github.com/nodejs/node/issues/3104 for more
information.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/env.js#L26)_

## filenameForModule

_Available since 0.1.0_

_function filenameForModule(meta): string_

ES module compatibility counterpart of the CommonJS \_\_filename

**Parameters**:

- meta `ImportMeta`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/utils.js#L130)_

## dirnameForModule

_Available since 0.1.0_

_function dirnameForModule(meta): string_

ES module compatibility counterpart of the CommonJS \_\_dirname

**Parameters**:

- meta `ImportMeta`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/utils.js#L142)_

## isNil

_Available since 0.1.0_

_function isNil(item?): boolean_

Check if a value is `null` or `undefined`

**Parameters**:

- item `*?`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/lodash.js#L11)_

## isPlainObject

_Available since 0.1.0_

_function isPlainObject(item?): boolean_

Check if a value is a plain JavaScript object.

**Parameters**:

- item `*?`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/lodash.js#L23)_

## uuid

_Available since 0.1.0_

_function uuid(): string_

Returns a new uuid v4

This function also has an `uuid.isValid` function, which returns a boolean
depending on if the passed in string is a valid uuid.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/datatypes.js#L13)_

## noop

_Available since 0.1.0_

_function noop(): void_

A function that returns 'undefined'.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/utils.js#L30)_

## merge

_Available since 0.1.0_

_function merge(target, sources?): object_

Deep merge source objects on to 'target'. Mutates 'target' in place.

**Parameters**:

- target `object`: The destination object.
- sources `...object?`: The source objects.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/lodash.js#L42)_

## streamToBuffer

_Available since 0.1.0_

_function streamToBuffer(stream): Promise\<Buffer>_

Read a readable stream completely, and return as Buffer

**Parameters**:

- stream `NodeJS.ReadableStream`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/node.js#L81)_

## pathJoin

_Available since undefined_

_function pathJoin(paths): string_

Join all arguments together and normalize the resulting path. Arguments must be
strings. Using Node.js built-in path.posix.join(). Which forces use of Posix
path separators, '/'.

**Parameters**:

- paths `...string`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/node.js#L17)_

## exec

_Available since 0.1.0_

_function exec(command, opts?): Promise\<{stdout: string, stderr: string,
exitCode: number}>_

Wrap around Node.js child_process#exec. Resolving when the sub process has
exited. The resulting object contains the 'exitCode' of the sub process.

**Parameters**:

- command `string`
- opts `ExecOptions={}`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/node.js#L31)_

## spawn

_Available since 0.1.0_

_function spawn(command, {string[]} args, opts?): Promise\<{exitCode: number}>_

Wrap around Node.js child_process#spawn. Resolving when the sub process has
exited. The resulting object contains the 'exitCode' of the sub process. By
default 'stdio' is inherited from the current process.

**Parameters**:

- command `string`
- {string[]} args `{string[]} args`: {string[]} args
- opts `object={}`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/node.js#L62)_

## calculateCookieUrlFromAppUrl

_Available since 0.1.0_

_function calculateCookieUrlFromAppUrl(): void_

Try to calculate the COOKIE_URL environment variable from the APP_URL
environment variable. Assumes the APP_URL is in the following format:
http(s)://api.xxx.xx.com and generates the following COOKIE_URL value:
xxx.xx.com. If the APP_URL host only contains xxx.com the CORS_URL value will be
equivalent. Refreshing the environment cache via `refreshEnvironmentCache` is
not necessary.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/env.js#L97)_

## calculateCorsUrlFromAppUrl

_Available since 0.1.0_

_function calculateCorsUrlFromAppUrl(): void_

Try to calculate the CORS_URL environment variable from the APP_URL environment
variable. Assumes the APP_URL is in the following format:
http(s)://api.xxx.xx.com and generates the following CORS_URL value:
http(s)://xxx.xx.com. If the APP_URL host only contains xxx.com the CORS_URL
value will be equivalent. Refreshing the environment cache via
`refreshEnvironmentCache` is not necessary.

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/env.js#L68)_

## processDirectoryRecursive

_Available since 0.1.0_

_function processDirectoryRecursive(dir, cb, opts?): void_

Recursively act on all files in a directory, awaiting on callback calls.

**Parameters**:

- dir `string`
- cb `Function`
- opts `ProcessDirectoryOptions?`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/node.js#L110)_

## processDirectoryRecursiveSync

_Available since 0.1.0_

_function processDirectoryRecursiveSync(dir, cb, opts?, opts.skipNodeModules?,
opts.skipDotFiles?): void_

Sync version of processDirectoryRecursive

**Parameters**:

- dir `string`
- cb `Function`
- opts `object={}`
- opts.skipNodeModules `boolean=true`
- opts.skipDotFiles `boolean=true`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/node.js#L147)_

## flatten

_Available since 0.1.0_

_function flatten(data, result?, path?): Object\<string, any>_

Flatten nested objects in to a new object where the keys represent the original
access path. Only goes through plain JavaScript objects and ignores arrays.

**Parameters**:

- data `object`: The object to serialize
- result `*?`
- path `string?`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/lodash.js#L55)_

## unFlatten

_Available since 0.1.0_

_function unFlatten(data): object_

The opposite of 'flatten'.

**Parameters**:

- data `object`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/lodash.js#L81)_

## getSecondsSinceEpoch

_Available since 0.1.0_

_function getSecondsSinceEpoch(): number_

Get the number of seconds since Unix epoch (1-1-1970).

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/utils.js#L19)_

## bytesToHumanReadable

_Available since 0.1.0_

_function bytesToHumanReadable(bytes?): string_

Convert bytes to a human readable value

**Parameters**:

- bytes `number?`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/memory.js#L13)_

## printProcessMemoryUsage

_Available since 0.1.0_

_function printProcessMemoryUsage(logger): void_

Print memory usage of this Node.js process

**Parameters**:

- logger `Logger`

_[source](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/memory.js#L40)_
