# TODO

Missing list and structure of docs

- Getting started
  - Describe installation, requirements of Yarn & Node.js
  - deps & devDeps
- Scripts
  - CLI scripts, mainFn, environment
  - Also include .env & .env.local
  - yarn compas help --check
- Lint setup
  - yarn compas lint (--jsdoc)
  - ESLint & Prettier setup
  - Also mention that this is not for Typescript projects but just for JS
    projects
- TS setup
  - yarn compas init --jsconfig
  - generateTypes -> dumpCompasTypes
  - Install typescript dev dep
- Logger & events
  - Log info,error, mainFn logger
  - eventStart, stop, newEventFromEvent
- Basic api
  - getApp, default headers, error handling
  - ctx.log, ctx.event
  - Body parsers
  -
- Postgres & minio client
  - yarn compas docker up, down & reset
  - Also mention query helper
  - minio is s3 equivalent
- Migration runner
  - Migration directory
  - yarn compas docker migrate utils
  - Link to @compas/store migrations
- Code gen validators
  - Also mention types
  - allowNull(), min(), max(), etc
- Code gen routes
  - app.use router
  - set body parsers
  - query, param, body, files & response types
- Code gen sql
  - basic queries
  - queryBuilder
  - extend with @compas/store
  - setStoreQueries
  - Relations
- Code gen api client
  - Typescript, reactQuery

Advanced:

- Test runner
  - yarn compas test
  - yarn compas ./xxx.test.js
  - test config, setup, teardown, enforceSingleAssertion, timeout & t.timeout
- Bench runner
  - yarn compas bench
  - yarn compas ./xxx.bench.js
  - b.resetTime()
- Integration test api's
  - createTestApp, closeTestApp
  - response validator of generated apiClient
- Integration test postgres & minio
  - createTestPostgresDatabase, closeTestDatabase, uses the current migrated one
    as the base
- sendFile & sendTransformedImage
  - Mention provided transform type
- Session handling
  - session store
  - session middleware & link to koa-session
  - Job to remove expired sessions
- CLI Watch options
  - Mention `yarn compas xxx.js --watch`
- Queue
  - Recurring jobs,
  - events VS jobs
- Query relations & query traversal
  - offset, limit
- File groups
  - using order
  - nesting file groups & helper functions
- Multiple code gen calls
  - separate generateTypes, dumpStructure, no 'type' generator in
    enabledGenerators
- Open api conversion
  - extendWithOpenAPI
- Rebuilding migrations
  - yarn compas docker migrate info
  - yarn compas docker migrate rebuild

Migrations

- @compas/store current migration
