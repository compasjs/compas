# @lbu (Lightbase Backend Utilities)

![lint-build-test](https://github.com/lightbasenl/lbu/workflows/lint-build-test/badge.svg)

Collection of Lightbase backend utilities

---

## Features

- Minimal project boilerplate
- Script runner, can watch & reload almost anything
- Test and benchmark runner
- Flexible code generators supporting routers, validators, api clients, CRUD
  queries and more in the future.
- Opinionated structured logging
- Common Koa middleware wrapped in a single function
- Various utilities like loading .env files, executing other processes and a
  basic string templating system

## Requirements

- Node.js >= 14
- Yarn 1.x.x

## Why

Here at [lightbase](https://lightbase.nl) we had a constantly growing
boilerplate for new projects. To facilitate our needs more and to stop copying
and pasting things around this project was born. This project is for now
tailored at monolithic projects.

## Features breakdown

**@lbu/cli**:

- Run user scripts (in watch mode)
- Run the linter
- A LBU based boilerplate
- Test runner
- Benchmark runner
- Necessary Docker container management

**@lbu/lint-config**:

- All necessary ESLint and Prettier dependencies
- Default configuration for ESLint and Prettier

**@lbu/insight**:

- A structured logger
  - Writing newline delimited JSON in production
  - Pretty printing for development
- Various utilities to get insight in the running process
- A manual event system

**@lbu/stdlib**:

- Various lodash inspired utilities (isNil, isPlainObject, ...)
- Wrappers for child_process execution and spawning
- A `mainFn` wrapper that reads `.env` and calls the provided function if the
  file is the process entrypoint
- Replacements for CommonJS `__dirname` and `__filename`

**@lbu/server**:

- Wrapper around Koa instance creation
- 404 en error handling
- Handle CORS
- Send file helper
- Session support with safe browser readable cookies

**@lbu/store**:

- Wrapper around the Minio S3 client
- Wrapper around Postgres connection
- Utilities for providing temporary databases in a test environment
- Postgres migrations
- Postgres and S3 combined for file storage
- Caching files from S3 in memory or on local disk
- Postgres powered queue implementation
  - Supports priority, scheduling, multiple async workers and recurring jobs
- koa-session compatible SessionStore backed by Postgres

**@lbu/code-gen**:

- Code generators for the following:
  - router, with wildcard and path parameter support
  - validators, pure JavaScript implementation
  - sql, CRUD postgres queries, graph traversal
  - Axios based api client
  - TypeScript or JSDoc types
  - react-query hooks
- An extendable set of types:
  - boolean, number, string;
  - object, array, any;
  - date, uuid;
  - generic, anyOf, reference;
- Remote structure loader
- OpenAPI to LBU converter

## Docs and development

See [the website](https://lbu.lightbase.nl) for the changelog, all available
APIs and various guides.

For contributing see [contributing.md](https://lbu.lightbase.nl/#/contributing).

## New features

New features added should fall under the following categories:

- It improves the interface between api and client in some way. An example may
  be to support websockets in @lbu/code-gen
- It improves the developer experience one way or another while developing an
  api For example the `lbu docker` commands or various utilities provided by
  @lbu/stdlib

Although some parts heavily rely on conventions set by the packages, we
currently aim not to be a framework. We aim to provide a good developer
experience, useful abstractions around the basics, and a stable backend <->
client interface.
