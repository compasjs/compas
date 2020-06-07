# CHANGELOG

### [v0.0.21](https://github.com/lightbasenl/lbu/releases/tag/v0.0.21)

- @lbu/code-gen: rework sql generator, now snake-cases table and column names
- @lbu/code-gen: add support to generate count queries
- @lbu/code-gen: add support to add createdAt and updatedAt fields for objects
  with queries enabled
- @lbu/code-gen: add support for insert-on-update history table when generating
  sql
- @lbu/code-gen: add support to dump a Postgres DDL based on lbu structure
- @lbu/store: Most components are now backed by the sql generator
- @lbu/lint-config: add jsdoc linting
- @lbu/stdlib: support controlled output of newlines

### [v0.0.20](https://github.com/lightbasenl/lbu/releases/tag/v0.0.20)

- @lbu/code-gen: support OpenAPI conversion
- @lbu/store: add file-cache, uses memory & local disk to speed up retrieving
  items from S3
- \*: various dependency bumps
- @lbu/store: cleaner result on getMigrationsToBeApplied
- @lbu/server: make sendFile compatible with file-cache

### [v0.0.19](https://github.com/lightbasenl/lbu/releases/tag/v0.0.19)

- @lbu/insight: BREAKING, remove 'varargs' support from logger
- @lbu/code-gen: reuse generated validators
- @lbu/code-gen: strip more new lines from output, which results in better
  readability

### [v0.0.18](https://github.com/lightbasenl/lbu/releases/tag/v0.0.18)

- @lbu/stdlib: vendor uuid v4 generation

### [v0.0.17](https://github.com/lightbasenl/lbu/releases/tag/v0.0.17)

- @lbu/cli: various template fixes
- @lbu/\*: various dependency updates
- @lbu/server: add a sendFile utility
- @lbu/stdlib: add camelToSnakecase utility
- @lbu/store: add JobQueue implementation
- @lbu/code-gen: normalize generate & generateStubs
- @lbu/code-gen: add basic sql query generator

### [v0.0.16](https://github.com/lightbasenl/lbu/releases/tag/v0.0.16)

- @lbu/code-gen: minor fixes
- @lbu/cli: add tape as a dependency
- @lbu/store: only truncate tables in testing when there are tables to be
  truncated
- @lbu/stdlib: add noop function

### [v0.0.15](https://github.com/lightbasenl/lbu/releases/tag/v0.0.15)

- @lbu/server,stdlib: move AppError to stdlib
- @lbu/code-gen: small fixes

### [v0.0.14](https://github.com/lightbasenl/lbu/releases/tag/v0.0.14)

- @lbu/store: add session store
- @lbu/server: add session middleware
- @lbu/code-gen: rename \_Optional to \_Input
- @lbu/code-gen: add date type

### [v0.0.13](https://github.com/lightbasenl/lbu/releases/tag/v0.0.13)

- @lbu/code-gen: add dumpStructure option to generateStubs

### [v0.0.12](https://github.com/lightbasenl/lbu/releases/tag/v0.0.12)

- Move project to Github
- @lbu/cli: add docker clean command
- @lbu/code-gen: remove the need to register coreTypes
- @lbu/code-gen: support generating stubs
- @lbu/stdlib: small fixes
- @lbu/store: small fixes for database creation

### [v0.0.11](https://github.com/lightbasenl/lbu/releases/tag/v0.0.11)

- @lbu/store: initial release! Already supports test databases, migrations and a
  persistent file store in combination with minio
- @lbu/server: remove global state from body parsers
- @lbu/code-gen: various bug fixes. The output should be ESLint error free after
  formatting.
- @lbu/cli: update template
- @lbu/cli: improve command executor, now supports passing in flags to Node.js
  as well as to the program it self
- Various test and documentation improvements

### [v0.0.10](https://github.com/lightbasenl/lbu/releases/tag/v0.0.10)

- Set minimum Node.js version to Node.js 14
- @lbu/cli: Refactored

  - Improved argument parser, logging and reload handling
  - Supports arguments and passing arguments to Node.js

- @lbu/code-gen: Refactored

  - Moved to a double plugin structure with Generators and Types plugins
  - Generator plugins replace the previous store and generator plugins
  - Type plugins implement TypeBuilding, and code generation for specific types.
    All type plugins support the core generators
  - All plugins except Models are now operating on a group based way of
    generating. This ensures that auto-completion stays relevant to the context
    that you are working in

- @lbu/insight: removed global state from log parser
- @lbu/insight: support `arrayBuffers` when printing memory usage
- @lbu/insight: cleanup logger a bit
- @lbu/server: supply `isServerLog` to check if a json object may be output from
  the log midleware
- @lbu/stdlib: removed global state from teplates
- @lbu/\*: various dependency updates
- @lbu/\*: various docs improvements

### [v0.0.9](https://github.com/lightbasenl/lbu/releases/tag/v0.0.12)

- Export named functions instead of const and shorthand functions
- @lbu/cli: Fix script ordering
- @lbu/cli: Execute nodemon as a library
- @lbu/code-gen: Various fixes
- @lbu/code-gen: More logging in App build and Runner
- @lbu/code-gen: Router refactoring, add group support. Also includes api client
  generated exports.
- @lbu/code-gen: ModelBuilder refactoring, add docs, optional & default on all
  models
- @lbu/lint-config: Move to Prettier 2.0
- @lbu/insight: Return a Logger instance instead of a POJO
- @lbu/stdlib: Remove translation system

### [v0.0.8](https://github.com/lightbasenl/lbu/releases/tag/v0.0.8)

- Various fixes
- @lbu/insight: Simple log processing setup

### [v0.0.7](https://github.com/lightbasenl/lbu/releases/tag/v0.0.7)

- BREAKING: export es modules and drop CommonJS support
- BREAKING: Only supporting >= Node.js 13
- @lbu/code-gen: Big refactor, now with a separate model & mocks generator
- @lbu/cli: Supports yarn scripts in watch mode
- @lbu/insight: A tad faster
- @lbu/lint-config: Support ES modules
- @lbu/server: Refactor error handler, inline cors, improvements to defaults
- @lbu/stdlib: Translation system, utilities for moving from CommonJS to ES
  modules

### [v0.0.6](https://github.com/lightbasenl/lbu/releases/tag/v0.0.6)

- @lbu/code-gen: JSDoc generation and router tags support
- @lbu/\*: Various bugs fixed

### [v0.0.5](https://github.com/lightbasenl/lbu/releases/tag/v0.0.5)

- Rewritten from scratch in plain old JavaScript
- @lbu/cli is now more a script runner than anything else
- @lbu/koa is replaced by @lbu/server
- @lbu/register is removed
- @lbu/lint-config drops Typescript support
- @lbu/stdlib now contains a basic templating functionality
- @lbu/code-gen is refactored, needs some more thinking before adding a fluent
  api back

### [v0.0.4](https://github.com/lightbasenl/lbu/releases/tag/v0.0.4)

- Replaced @lbu/validator with @lbu/code-gen
- @lbu/code-gen supports generating validator functions and routers
- Add @lbu/koa with some minimal middleware

### [v0.0.3](https://github.com/lightbasenl/lbu/releases/tag/v0.0.3)

- @lbu/validator refactor and pretty much stable feature wise
- Various fixes in @lbu/cli and @lbu/stdlib

### [v0.0.2](https://github.com/lightbasenl/lbu/releases/tag/v0.0.2)

- Add @lbu/register
- Add @lbu/cli lint command
- Improve @lbu/cli template

### [v0.0.1](https://github.com/lightbasenl/lbu/releases/tag/v0.0.1)

- Initial release
