# @lbu/lint-config

Collection of Lightbase backend utilities

## Why

Here at [lightbase](https://lightbase.nl) we had a constantly growing
boilerplate for new projects. To facilitate our needs more and to stop copying
and pasting things around this project was born. This project is for now
tailored at smaller & monolithic projects.

## Versioning and first release

For internal testing we stay on v0.0.x. To reach v0.1.0 the following features
will be supported:

- Flexible code generation (validators, router, queries, openapi)
- Usable documentation
- Test coverage (either e2e or unit, but enough to be considered somewhat
  stable)
- Used in a medium size project @ Lightbase
- Implement a [Realworld project](https://github.com/gothinkster/realworld)

## Features

- @lbu/cli: Project template, and useful commands while developing
- @lbu/code-gen: Flexible code generators. Supports generating Typescript code
  for validators, http router, postgres queries and OpenAPI schema
- @lbu/insight: Opinionated logger
- @lbu/koa: Wrap around Koa and some useful middleware
- @lbu/register: Load dotenv and if available ts-node
- @lbu/stdlib: Growing library with features like uuid generation and background
  jobs

## Docs

See [/docs](/docs/README.md)

## Development

See [CONTRIBUTING.md](/CONTRIBUTING.md).
