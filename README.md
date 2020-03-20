# @lbu/\*

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

- @lbu/cli: Project template, and simple script runner
- @lbu/code-gen: Flexible code generators. Supports generating router, validator
- @lbu/insight: Opinionated logger
- @lbu/server: Wrap around Koa and some useful middleware
- @lbu/stdlib: Growing library of various common utilities like uuid & a basic
  templating system

## Roadmap

- [ ] @lbu/code-gen: OpenAPI importer
- [ ] @lbu/features: Feature flag implementation based on @lbu/store & support
      for code-gen
- [ ] @lbu/code-gen: Postgres query generator

## Docs

See [/docs](/docs/README.md)

## Development

See [CONTRIBUTING.md](/CONTRIBUTING.md).
