<a name="readmemd"></a>

# API

Per module documentation, generated from the Typescript declaration files.

# Cli

<a name="clireadmemd"></a>

[@lbu/cli - v0.0.26](#clireadmemd)

## @lbu/cli - v0.0.26

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

[@lbu/cli - v0.0.26](#clireadmemd) ›
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

[@lbu/cli - v0.0.26](#clireadmemd) ›
[ScriptCollection](#cliinterfacesscriptcollectionmd)

### Interface: ScriptCollection

#### Hierarchy

- **ScriptCollection**

#### Indexable

- \[ **k**: _string_\]: [CollectedScript](#cliinterfacescollectedscriptmd)

# Insight

<a name="insightreadmemd"></a>

[@lbu/insight - v0.0.26](#insightreadmemd)

## @lbu/insight - v0.0.26

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

[@lbu/insight - v0.0.26](#insightreadmemd) ›
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

[@lbu/insight - v0.0.26](#insightreadmemd) ›
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

[@lbu/insight - v0.0.26](#insightreadmemd) ›
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

[@lbu/insight - v0.0.26](#insightreadmemd) ›
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
