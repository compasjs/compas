# @compas/eslint-plugin

[![install size @compas/eslint-plugin](https://packagephobia.com/badge?p=@compas/eslint-plugin)](https://packagephobia.com/result?p=@compas/eslint-plugin)
![lint-build-test](https://github.com/compasjs/compas/workflows/lint-build-test/badge.svg)
[![codecov](https://codecov.io/gh/compasjs/compas/branch/main/graph/badge.svg?token=81D84CV04U)](https://codecov.io/gh/compasjs/compas)

Unified backend tooling

---

All common components for creating backends, tooling and more in opinionated
packages; from describing the api structure to testing the end result.

## Features

- Code generators for routers, validators, SQL queries, API clients and more
- Logging, body parser and error handling out of the box
- Persistence layer with Postgres for files, jobs and sessions
- An extendable CLI that comes with a test runner and is able to run your
  database migrations.
- Structured logging all throughout, giving you insight in the running system.

## Requirements

- Node.js >= 16
- Yarn 1.x.x / NPM

## Why

I had a time when I was mostly creating small backends and tools back to back.
Always trying to improve them by choosing packages that align better with my
views, new features or more opinionated defaults. To capture this flow and
making those backends and tools easier to maintain, Compas was created.

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

## Docs and development

See [the website](https://compasjs.com) for the
[changelog](https://compasjs.com/changelog.html), all available APIs and various
guides.

For contributing see [contributing.md](https://compasjs.com/contributing.html).
