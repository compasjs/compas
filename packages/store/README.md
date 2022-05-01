# @compas/store

[![install size store](https://packagephobia.com/badge?p=@compas/store)](https://packagephobia.com/result?p=@compas/store)
![lint-build-test](https://github.com/compasjs/compas/workflows/lint-build-test/badge.svg)
[![codecov](https://codecov.io/gh/compasjs/compas/branch/main/graph/badge.svg?token=81D84CV04U)](https://codecov.io/gh/compasjs/compas)

Unified backend tooling

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

- Node.js >= 16
- Yarn 1.x.x / NPM

## Why

My work involved doing many small projects. I had a hard time back porting
incremental fixes to existing projects. To facilitate my needs more and to stop
copying and pasting things around, this project was born.

## Features breakdown

**@compas/cli**:

- Run user scripts (in watch mode)
- Run the linter
- A Compas based boilerplate
- Test runner
- Benchmark runner
- Necessary Docker container management
- Visualise the known database structure of @compas/code-gen

**@compas/eslint-plugin**:

- All necessary ESLint and Prettier dependencies
- Default configuration for ESLint and Prettier
- Handy rules for things like the event system from @compas/stdlib

**@compas/stdlib**:

- Various lodash inspired utilities (isNil, isPlainObject, ...)
- Wrappers for child_process execution and spawning
- A `mainFn` wrapper that reads `.env` and calls the provided function if the
  file is the process entrypoint
- Replacements for CommonJS `__dirname` and `__filename`
- A structured logger
  - Writing newline delimited JSON in production
  - Pretty printing for development
- Various utilities to get insight in the running process
- A manual event system

**@compas/server**:

- Wrapper around Koa instance creation
- 404 en error handling
- Handle CORS
- Send file helper

**@compas/store**:

- Wrapper around the Minio S3 client
- Wrapper around Postgres connection
- Session support via JSON Web tokens
- Utilities for providing temporary databases in a test environment
- Postgres migrations
- Postgres and S3 combined for file storage
- Caching files from S3 in memory or on local disk
- Postgres powered queue implementation
  - Supports priority, scheduling, multiple async workers and recurring jobs
- koa-session compatible SessionStore backed by Postgres

**@compas/code-gen**:

- Code generators for the following:
  - router, with wildcard and path parameter support
  - validators, pure JavaScript implementation
  - sql, CRUD Postgres queries and nested result support
  - Axios based api client
  - TypeScript or JSDoc types
  - react-query hooks
- An extendable set of types:
  - boolean, number, string;
  - object, array, any;
  - date, uuid;
  - generic, anyOf, reference;
- Remote structure loader
- OpenAPI to Compas structure converter

## Docs and development

See [the website](https://compasjs.com) for the changelog, all available APIs
and various guides.

For contributing see [contributing.md](https://compasjs.com/contributing.html).

## New features

New features added should fall under the following categories:

- It improves the interface between api and client in some way. An example may
  be to support websockets in @compas/code-gen
- It improves the developer experience one way or another while developing an
  api For example the `compas docker` commands or various utilities provided by
  @compas/stdlib

Although some parts heavily rely on conventions set by the packages, we
currently aim not to be a framework. We aim to provide a good developer
experience, useful abstractions around the basics, and a stable backend <->
client interface.
