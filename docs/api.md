<a name="readmemd"></a>

# API

Per module documentation, generated from the Typescript declaration files.

# Cli

<a name="clireadmemd"></a>

[@lbu/cli - v0.0.29](#clireadmemd)

## @lbu/cli - v0.0.29

### Index

#### Interfaces

- [CollectedScript](#cliinterfacescollectedscriptmd)
- [ScriptCollection](#cliinterfacesscriptcollectionmd)

#### Functions

- [collectScripts](#collectscripts)

### Functions

#### collectScripts

▸ **collectScripts**(): _[ScriptCollection](#cliinterfacesscriptcollectionmd)_

Return collection of available named scripts

- type user: User defined scripts from process.cwd/scripts/\*.js
- type package: User defined scripts in package.json. These override 'user'
  scripts

**Returns:** _[ScriptCollection](#cliinterfacesscriptcollectionmd)_

## Interfaces

<a name="cliinterfacescollectedscriptmd"></a>

[@lbu/cli - v0.0.29](#clireadmemd) ›
[CollectedScript](#cliinterfacescollectedscriptmd)

### Interface: CollectedScript

Represents either a file in the `scripts` directory or a script from the
package.json Depending on the type contains either script or path

#### Hierarchy

- **CollectedScript**

#### Index

##### Properties

- [name](#name)
- [path](#optional-path)
- [script](#optional-script)
- [type](#type)

#### Properties

##### name

• **name**: _string_

---

##### `Optional` path

• **path**? : _string_

---

##### `Optional` script

• **script**? : _string_

---

##### type

• **type**: _"user" | "package"_

<a name="cliinterfacesscriptcollectionmd"></a>

[@lbu/cli - v0.0.29](#clireadmemd) ›
[ScriptCollection](#cliinterfacesscriptcollectionmd)

### Interface: ScriptCollection

#### Hierarchy

- **ScriptCollection**

#### Indexable

- \[ **k**: _string_\]: [CollectedScript](#cliinterfacescollectedscriptmd)

# Insight

<a name="insightreadmemd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd)

## @lbu/insight - v0.0.29

### Index

#### Interfaces

- [LogParserContext](#insightinterfaceslogparsercontextmd)
- [Logger](#insightinterfacesloggermd)
- [LoggerContext](#insightinterfacesloggercontextmd)
- [LoggerOptions](#insightinterfacesloggeroptionsmd)

#### Variables

- [log](#const-log)

#### Functions

- [bindLoggerContext](#bindloggercontext)
- [bytesToHumanReadable](#bytestohumanreadable)
- [executeLogParser](#executelogparser)
- [newLogParserContext](#newlogparsercontext)
- [newLogger](#newlogger)
- [printProcessMemoryUsage](#printprocessmemoryusage)

### Variables

#### `Const` log

• **log**: _[Logger](#insightinterfacesloggermd)_

Standard log instance. Comes with a depth of 4, prevents printing deeply nested
objects

### Functions

#### bindLoggerContext

▸ **bindLoggerContext**‹**T**›(`logger`: [Logger](#insightinterfacesloggermd),
`ctx`: T): _[Logger](#insightinterfacesloggermd)_

Bind a context object to the logger functions and returns a new Logger The
context is always printed

**Type parameters:**

▪ **T**: _[LoggerContext](#insightinterfacesloggercontextmd)_

**Parameters:**

| Name     | Type                                 |
| -------- | ------------------------------------ |
| `logger` | [Logger](#insightinterfacesloggermd) |
| `ctx`    | T                                    |

**Returns:** _[Logger](#insightinterfacesloggermd)_

---

#### bytesToHumanReadable

▸ **bytesToHumanReadable**(`bytes?`: number): _string_

Format bytes, with up to 2 digits after the decimal point, in a more human
readable way Support up to a pebibyte

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `bytes?` | number |

**Returns:** _string_

---

#### executeLogParser

▸ **executeLogParser**(`lpc`:
[LogParserContext](#insightinterfaceslogparsercontextmd)): _ReadableStream_

Run the parser, splits the in stream onn lines and call either the jsonProcessor
or textProcessor with the value. The original value is written to the returned
stream

**Parameters:**

| Name  | Type                                                     |
| ----- | -------------------------------------------------------- |
| `lpc` | [LogParserContext](#insightinterfaceslogparsercontextmd) |

**Returns:** _ReadableStream_

---

#### newLogParserContext

▸ **newLogParserContext**(`stream`: ReadableStream):
_[LogParserContext](#insightinterfaceslogparsercontextmd)_

Create a new parser context

**Parameters:**

| Name     | Type           |
| -------- | -------------- |
| `stream` | ReadableStream |

**Returns:** _[LogParserContext](#insightinterfaceslogparsercontextmd)_

---

#### newLogger

▸ **newLogger**‹**T**›(`options?`:
[LoggerOptions](#insightinterfacesloggeroptionsmd)‹T›):
_[Logger](#insightinterfacesloggermd)_

Create a new logger

**Type parameters:**

▪ **T**: _[LoggerContext](#insightinterfacesloggercontextmd)_

**Parameters:**

| Name       | Type                                                  |
| ---------- | ----------------------------------------------------- |
| `options?` | [LoggerOptions](#insightinterfacesloggeroptionsmd)‹T› |

**Returns:** _[Logger](#insightinterfacesloggermd)_

---

#### printProcessMemoryUsage

▸ **printProcessMemoryUsage**(`logger`: [Logger](#insightinterfacesloggermd)):
_void_

Prints the memory usage of the current process to the provided logger For more
info on the printed properties see:
https://nodejs.org/dist/latest-v13.x/docs/api/process.html#process_process_memoryusage

**Parameters:**

| Name     | Type                                 |
| -------- | ------------------------------------ |
| `logger` | [Logger](#insightinterfacesloggermd) |

**Returns:** _void_

## Interfaces

<a name="insightinterfacesloggermd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) ›
[Logger](#insightinterfacesloggermd)

### Interface: Logger

The logger only has two severities:

- info
- error

Either a log line is innocent enough and only provides debug information if
needed, or someone should be paged because something goes wrong. For example
handled 500 errors don't need any ones attention, but unhandled 500 errors do.

The log functions {@ee Logger#info} only accepts a single parameter. This
prevents magic outputs like automatic concatenating strings in to a single
message, or always having a top level array as a message.

#### Hierarchy

- **Logger**

#### Index

##### Methods

- [error](#error)
- [info](#info)
- [isProduction](#isproduction)

#### Methods

##### error

▸ **error**(`arg`: any): _void_

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `arg` | any  |

**Returns:** _void_

---

##### info

▸ **info**(`arg`: any): _void_

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `arg` | any  |

**Returns:** _void_

---

##### isProduction

▸ **isProduction**(): _boolean_

Check if this logger is using the pretty printer or NDJSON printer

**Returns:** _boolean_

<a name="insightinterfacesloggercontextmd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) ›
[LoggerContext](#insightinterfacesloggercontextmd)

### Interface: LoggerContext

Context that should be logged in all log lines. e.g a common request id.

#### Hierarchy

- **LoggerContext**

#### Index

##### Properties

- [type](#optional-type)

#### Properties

##### `Optional` type

• **type**? : _string_

<a name="insightinterfacesloggeroptionsmd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) ›
[LoggerOptions](#insightinterfacesloggeroptionsmd)

### Interface: LoggerOptions ‹**T**›

#### Type parameters

▪ **T**: _[LoggerContext](#insightinterfacesloggercontextmd)_

#### Hierarchy

- **LoggerOptions**

#### Index

##### Properties

- [ctx](#optional-ctx)
- [depth](#optional-depth)
- [pretty](#optional-pretty)
- [stream](#optional-stream)

#### Properties

##### `Optional` ctx

• **ctx**? : _T_

Context that should be logged in all log lines. e.g a common request id.

---

##### `Optional` depth

• **depth**? : _number_

Max-depth printed

---

##### `Optional` pretty

• **pretty**? : _boolean_

Use the pretty formatter instead of the NDJSON formatter

---

##### `Optional` stream

• **stream**? : _WritableStream_

The stream to write the logs to

<a name="insightinterfaceslogparsercontextmd"></a>

[@lbu/insight - v0.0.29](#insightreadmemd) ›
[LogParserContext](#insightinterfaceslogparsercontextmd)

### Interface: LogParserContext

The LogParserContext enables you too analyze logs produced by this Logger

#### Hierarchy

- **LogParserContext**

#### Index

##### Properties

- [jsonProcessor](#optional-jsonprocessor)
- [stream](#stream)
- [textProcessor](#optional-textprocessor)

#### Properties

##### `Optional` jsonProcessor

• **jsonProcessor**? : _function_

###### Type declaration:

▸ (`data`: object): _void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `data` | object |

---

##### stream

• **stream**: _ReadableStream_

---

##### `Optional` textProcessor

• **textProcessor**? : _function_

###### Type declaration:

▸ (`data`: string): _void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `data` | string |

# Stdlib

<a name="stdlibreadmemd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd)

## @lbu/stdlib - v0.0.29

### Index

#### Classes

- [AppError](#stdlibclassesapperrormd)

#### Interfaces

- [MainFnCallback](#stdlibinterfacesmainfncallbackmd)
- [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)
- [TemplateContext](#stdlibinterfacestemplatecontextmd)
- [UuidFunc](#stdlibinterfacesuuidfuncmd)

#### Variables

- [uuid](#const-uuid)

#### Functions

- [camelToSnakeCase](#cameltosnakecase)
- [compileTemplate](#compiletemplate)
- [compileTemplateDirectory](#compiletemplatedirectory)
- [compileTemplateDirectorySync](#compiletemplatedirectorysync)
- [dirnameForModule](#dirnameformodule)
- [exec](#exec)
- [executeTemplate](#executetemplate)
- [filenameForModule](#filenameformodule)
- [flatten](#flatten)
- [gc](#gc)
- [getSecondsSinceEpoch](#getsecondssinceepoch)
- [isNil](#isnil)
- [isPlainObject](#isplainobject)
- [mainFn](#mainfn)
- [merge](#merge)
- [neTemplateContext](#netemplatecontext)
- [noop](#noop)
- [pathJoin](#pathjoin)
- [processDirectoryRecursive](#processdirectoryrecursive)
- [processDirectoryRecursiveSync](#processdirectoryrecursivesync)
- [spawn](#spawn)
- [unFlatten](#unflatten)

### Variables

#### `Const` uuid

• **uuid**: _[UuidFunc](#stdlibinterfacesuuidfuncmd)_

Return a new uuid v4

### Functions

#### camelToSnakeCase

▸ **camelToSnakeCase**(`input`: string): _string_

Convert a camelCase string to a snake_case string

```js
camelToSnakeCase("fooBBar");
// => "foo_b_bar"
```

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `input` | string |

**Returns:** _string_

---

#### compileTemplate

▸ **compileTemplate**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `name`: string, `str`:
string, `opts?`: object): _any_

Compile templates add to TemplateContext. This function is unsafe for untrusted
inputs Fields need to be explicitly set to undefined or access them via
`it.field` Inspired by: https://johnresig.com/blog/javascript-micro-templating/

**Parameters:**

▪ **tc**: _[TemplateContext](#stdlibinterfacestemplatecontextmd)_

▪ **name**: _string_

Name that is exposed in the template it self and to be used with the
executeTemplate function

▪ **str**: _string_

Template string

▪`Optional` **opts**: _object_

| Name     | Type    |
| -------- | ------- |
| `debug?` | boolean |

**Returns:** _any_

---

#### compileTemplateDirectory

▸ **compileTemplateDirectory**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `dir`: string,
`extension`: string, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)):
_Promise‹void›_

Compile all templates found in the provided directory with the provided
extension

**Parameters:**

| Name        | Type                                                                  |
| ----------- | --------------------------------------------------------------------- |
| `tc`        | [TemplateContext](#stdlibinterfacestemplatecontextmd)                 |
| `dir`       | string                                                                |
| `extension` | string                                                                |
| `opts?`     | [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd) |

**Returns:** _Promise‹void›_

---

#### compileTemplateDirectorySync

▸ **compileTemplateDirectorySync**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `dir`: string,
`extension`: string, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): _void_

Compile all templates found in the provided directory with the provided
extension synchronously

**Parameters:**

| Name        | Type                                                                  |
| ----------- | --------------------------------------------------------------------- |
| `tc`        | [TemplateContext](#stdlibinterfacestemplatecontextmd)                 |
| `dir`       | string                                                                |
| `extension` | string                                                                |
| `opts?`     | [ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd) |

**Returns:** _void_

---

#### dirnameForModule

▸ **dirnameForModule**(`meta`: ImportMeta): _string_

Return dirname for ES Module Alternative to CommonJS \_\_dirname

**Parameters:**

| Name   | Type       |
| ------ | ---------- |
| `meta` | ImportMeta |

**Returns:** _string_

---

#### exec

▸ **exec**(`command`: string): _Promise‹object›_

Promisify version of child_process#exec

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `command` | string |

**Returns:** _Promise‹object›_

---

#### executeTemplate

▸ **executeTemplate**(`tc`:
[TemplateContext](#stdlibinterfacestemplatecontextmd), `name`: string, `data`:
any): _string_

Execute a template, template should be compiled using compileTemplate

**Parameters:**

| Name   | Type                                                  |
| ------ | ----------------------------------------------------- |
| `tc`   | [TemplateContext](#stdlibinterfacestemplatecontextmd) |
| `name` | string                                                |
| `data` | any                                                   |

**Returns:** _string_

---

#### filenameForModule

▸ **filenameForModule**(`meta`: ImportMeta): _string_

Return filename for ES Module Alternative to CommonJS \_\_filename

**Parameters:**

| Name   | Type       |
| ------ | ---------- |
| `meta` | ImportMeta |

**Returns:** _string_

---

#### flatten

▸ **flatten**(`object`: any, `result?`: any, `path?`: string): _object_

Flattens the given nested object, skipping anything that is not a plain object

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `object`  | any    |
| `result?` | any    |
| `path?`   | string |

**Returns:** _object_

- \[ **key**: _string_\]: any

---

#### gc

▸ **gc**(): _void_

HACKY Let V8 know to please run the garbage collector.

**Returns:** _void_

---

#### getSecondsSinceEpoch

▸ **getSecondsSinceEpoch**(): _number_

Return seconds since unix epoch

**Returns:** _number_

---

#### isNil

▸ **isNil**‹**T**›(`value`: T | null | undefined): _value is null | undefined_

Check if item is null or undefined

**Type parameters:**

▪ **T**

**Parameters:**

| Name    | Type                           |
| ------- | ------------------------------ |
| `value` | T &#124; null &#124; undefined |

**Returns:** _value is null | undefined_

---

#### isPlainObject

▸ **isPlainObject**(`obj`: any): _boolean_

Check if item is a plain javascript object Not completely bullet proof

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `obj` | any  |

**Returns:** _boolean_

---

#### mainFn

▸ **mainFn**(`meta`: ImportMeta, `logger`: Logger, `cb`:
[MainFnCallback](#stdlibinterfacesmainfncallbackmd)): _Promise‹void›_

Run the provided cb if this file is the process entrypoint Will also load dotenv
before executing the provided callback. Another side effect is that a process
listener is added for warnings

**Parameters:**

| Name     | Type                                                |
| -------- | --------------------------------------------------- |
| `meta`   | ImportMeta                                          |
| `logger` | Logger                                              |
| `cb`     | [MainFnCallback](#stdlibinterfacesmainfncallbackmd) |

**Returns:** _Promise‹void›_

---

#### merge

▸ **merge**(`object`: any, ...`sources`: any[]): _any_

Re expose lodash.merge TODO: Note that lodash.merge is deprecated although it
doesnt say so when installing **Note:** This method mutates `object`.

**Parameters:**

| Name         | Type  |
| ------------ | ----- |
| `object`     | any   |
| `...sources` | any[] |

**Returns:** _any_

---

#### neTemplateContext

▸ **neTemplateContext**():
_[TemplateContext](#stdlibinterfacestemplatecontextmd)_

Create a new TemplateContext Adds the `isNil` function as a global

**Returns:** _[TemplateContext](#stdlibinterfacestemplatecontextmd)_

---

#### noop

▸ **noop**(): _void_

An empty function, doing exactly nothing but returning undefined.

**Returns:** _void_

---

#### pathJoin

▸ **pathJoin**(...`parts`: string[]): _string_

Reexport of path#join

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| `...parts` | string[] |

**Returns:** _string_

---

#### processDirectoryRecursive

▸ **processDirectoryRecursive**(`dir`: string, `cb`: function, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)):
_Promise‹void›_

Recursively walks directory async and calls cb on all files

**Parameters:**

▪ **dir**: _string_

▪ **cb**: _function_

▸ (`file`: string): _Promise‹void› | void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `file` | string |

▪`Optional` **opts**:
_[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)_

**Returns:** _Promise‹void›_

---

#### processDirectoryRecursiveSync

▸ **processDirectoryRecursiveSync**(`dir`: string, `cb`: function, `opts?`:
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)): _void_

Recursively walks directory synchronous and calls cb on all files

**Parameters:**

▪ **dir**: _string_

▪ **cb**: _function_

▸ (`file`: string): _void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `file` | string |

▪`Optional` **opts**:
_[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)_

**Returns:** _void_

---

#### spawn

▸ **spawn**(`command`: string, `args`: string[], `opts?`: SpawnOptions):
_Promise‹object›_

A promise wrapper around child_process#spawn

**Parameters:**

| Name      | Type         |
| --------- | ------------ |
| `command` | string       |
| `args`    | string[]     |
| `opts?`   | SpawnOptions |

**Returns:** _Promise‹object›_

---

#### unFlatten

▸ **unFlatten**(`data?`: object): _any_

Opposite of flatten

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `data?` | object |

**Returns:** _any_

## Classes

<a name="stdlibclassesapperrormd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) › [AppError](#stdlibclassesapperrormd)

### Class: AppError ‹**T**›

AppErrors represent errors, that should immediately stop the request and return
a status and other meta data directly

#### Type parameters

▪ **T**: _any_

#### Hierarchy

- [Error](#static-error)

  ↳ **AppError**

#### Index

##### Constructors

- [constructor](#constructor)

##### Properties

- [info](#info)
- [key](#key)
- [message](#message)
- [name](#name)
- [originalError](#optional-originalerror)
- [stack](#optional-stack)
- [status](#status)
- [Error](#static-error)

##### Methods

- [notFound](#static-notfound)
- [notImplemented](#static-notimplemented)
- [serverError](#static-servererror)
- [validationError](#static-validationerror)

#### Constructors

##### constructor

\+ **new AppError**(`key`: string, `status`: number, `info?`: T,
`originalError?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)_

Create a new AppError

**Parameters:**

| Name             | Type                   |
| ---------------- | ---------------------- |
| `key`            | string                 |
| `status`         | number                 |
| `info?`          | T                      |
| `originalError?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)_

#### Properties

##### info

• **info**: _T_

Extra information in the form of an object for the client to use

---

##### key

• **key**: _string_

Key is preferred to be in the following format

```
  "foo.bar"
  "error.server.notImplemented"
```

---

##### message

• **message**: _string_

_Inherited from [AppError](#stdlibclassesapperrormd).[message](#message)_

---

##### name

• **name**: _string_

_Inherited from [AppError](#stdlibclassesapperrormd).[name](#name)_

---

##### `Optional` originalError

• **originalError**? : _[Error](#static-error)_

Optional original error that was thrown

---

##### `Optional` stack

• **stack**? : _string_

_Inherited from [AppError](#stdlibclassesapperrormd).[stack](#optional-stack)_

---

##### status

• **status**: _number_

Status number to send to the api client

---

##### `Static` Error

▪ **Error**: _ErrorConstructor_

#### Methods

##### `Static` notFound

▸ **notFound**‹**T**›(`info?`: T, `error?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 404 not found error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

---

##### `Static` notImplemented

▸ **notImplemented**‹**T**›(`info?`: T, `error?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 405 not implemented error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

---

##### `Static` serverError

▸ **serverError**‹**T**›(`info?`: T, `error?`: [Error](#static-error)):
_[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 500 internal server error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

---

##### `Static` validationError

▸ **validationError**‹**T**›(`key`: string, `info?`: T, `error?`:
[Error](#static-error)): _[AppError](#stdlibclassesapperrormd)‹T›_

Create a new 400 validation error

**Type parameters:**

▪ **T**: _any_

**Parameters:**

| Name     | Type                   |
| -------- | ---------------------- |
| `key`    | string                 |
| `info?`  | T                      |
| `error?` | [Error](#static-error) |

**Returns:** _[AppError](#stdlibclassesapperrormd)‹T›_

## Interfaces

<a name="stdlibinterfacesmainfncallbackmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) ›
[MainFnCallback](#stdlibinterfacesmainfncallbackmd)

### Interface: MainFnCallback

#### Hierarchy

- **MainFnCallback**

#### Callable

▸ (`logger`: Logger): _void | Promise‹void›_

**Parameters:**

| Name     | Type   |
| -------- | ------ |
| `logger` | Logger |

**Returns:** _void | Promise‹void›_

<a name="stdlibinterfacesprocessdirectoryoptionsmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) ›
[ProcessDirectoryOptions](#stdlibinterfacesprocessdirectoryoptionsmd)

### Interface: ProcessDirectoryOptions

Options for processDirectoryRecursive and processDirectoryRecursiveSync

#### Hierarchy

- **ProcessDirectoryOptions**

#### Index

##### Properties

- [skipDotFiles](#optional-skipdotfiles)
- [skipNodeModules](#optional-skipnodemodules)

#### Properties

##### `Optional` skipDotFiles

• **skipDotFiles**? : _boolean_

Skip files and directories starting with a '.', true by default

---

##### `Optional` skipNodeModules

• **skipNodeModules**? : _boolean_

Skip node_modules directory, true by default

<a name="stdlibinterfacestemplatecontextmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) ›
[TemplateContext](#stdlibinterfacestemplatecontextmd)

### Interface: TemplateContext

Wraps the state needed for templates Globals are available to all templates
Templates are also available to all other templates when executing

#### Hierarchy

- **TemplateContext**

#### Index

##### Properties

- [globals](#globals)
- [strict](#strict)
- [templates](#templates)

#### Properties

##### globals

• **globals**: _object_

Functions available to all templates

###### Type declaration:

- \[ **key**: _string_\]: Function

---

##### strict

• **strict**: _boolean_

Throw on recompilation of a template Defaults to 'true'

---

##### templates

• **templates**: _Map‹string, Function›_

Compiled template functions

<a name="stdlibinterfacesuuidfuncmd"></a>

[@lbu/stdlib - v0.0.29](#stdlibreadmemd) ›
[UuidFunc](#stdlibinterfacesuuidfuncmd)

### Interface: UuidFunc

#### Hierarchy

- **UuidFunc**

#### Callable

▸ (): _string_

Return a new uuid v4

**Returns:** _string_

#### Index

##### Methods

- [isValid](#isvalid)

#### Methods

##### isValid

▸ **isValid**(`value`: any): _boolean_

Returns true if value conforms a basic uuid structure. This check is
case-insensitive.

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `value` | any  |

**Returns:** _boolean_
