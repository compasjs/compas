<p align="center">
  <img src="https://github.com/compasjs/compas/blob/main/docs/public/banner.svg?raw=true" alt="Compas.js" height="117">
</p>
<p align="center">
  Unified backend tooling
</p>
<p align="center">
  <a href="https://github.com/compasjs/compas/actions/workflows/checks.yml" target="_blank">
    <img src="https://github.com/compasjs/compas/actions/workflows/checks.yml/badge.svg" alt="CI status badge">
  </a>
  <a href="https://codecov.io/gh/compasjs/compas" target="_blank">
    <img src="https://codecov.io/gh/compasjs/compas/branch/main/graph/badge.svg?token=81D84CV04U" alt="Codecov status">
  </a>
</p>

---

All common components for creating backends, tooling and more in opinionated
packages; from describing the api structure to testing the end result.

## Maintenance mode

Compas is in maintenance mode. The packages will be maintained for the
foreseeable future. New features might be added, but some will also be dropped
in favor of other ecosystem-available libraries. Please don't start new projects
using Compas.

## Features

- Code generators for routers, validators, SQL queries, API clients and more
- Logging, body parser and error handling out of the box
- Persistence layer with Postgres for files, jobs and sessions
- An extendable CLI that comes with a test runner and is able to run your
  database migrations.
- Structured logging all throughout, giving you insight in the running system.

## Requirements

- Node.js >= 24
- NPM

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
