# Roadmap

The plan is to launch a 0.1.0 public beta release once we believe it's ready.
That means concretely having decent docs & tests in place. And some experience
in at least a mid size released project our selves.

### General roadmap

- More docs
- More tests
- More experience using it

### Code generation roadmap

- Pluggable model types, will help in next points as well
- Reproducible mocks: Consistent & correctly referenced mock data, so api users
  can rely on them for correct results in testing and initial building
- Websocket plugin: Generate a websocket server & client
- SQL: Generate various 'common' (CRUD) Postgres queries
- OpenAPI import: Resolve OpenAPI spec to lbu schema

### Utilities roadmap

- @lbu/sql: Common persistent storage needs with Postgres
  - Queue: Extensible queue implementation with various queue types
  - File: File storage table with support for chunked access
  - KV: Key value store
- @lbu/server: Various common middleware:
  - Basic auth
  - Session auth ( most likely going to use @lbu/sql KV-store)
- @lbu/lint-config: A more light-weight linting setup.

### Random ideas

- Feature flags: Some utilities around global feature flags
