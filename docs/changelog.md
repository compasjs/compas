# CHANGELOG

### [v0.0.88](https://github.com/lightbasenl/lbu/releases/tag/v0.0.88)

- build(deps): bump c8 from 7.3.4 to 7.3.5
  ([#418](https://github.com/lightbasenl/lbu/pull/418))
- build(deps): bump eslint from 7.11.0 to 7.12.0
  ([#415](https://github.com/lightbasenl/lbu/pull/415))
- build(deps-dev): bump axios from 0.20.0 to 0.21.0
  ([#414](https://github.com/lightbasenl/lbu/pull/414))
- code-gen: subquery support in 'in' and 'notIn' sql where
  ([#420](https://github.com/lightbasenl/lbu/pull/420))
- code-gen: support Typescript script mode
  ([#416](https://github.com/lightbasenl/lbu/pull/416))
- docs: add information about test and bench to cli.md
- insight: add application name to context
  ([#419](https://github.com/lightbasenl/lbu/pull/419))
- insight: improve performance of ndjson logging
  ([#417](https://github.com/lightbasenl/lbu/pull/417))

### [v0.0.87](https://github.com/lightbasenl/lbu/releases/tag/v0.0.87)

- code-gen: follow references completely when linking up
- code-gen: make sure apiClient types are registered

### [v0.0.86](https://github.com/lightbasenl/lbu/releases/tag/v0.0.86)

- server: add support for keeping a public cookie
  ([#412](https://github.com/lightbasenl/lbu/pull/412))

### [v0.0.85](https://github.com/lightbasenl/lbu/releases/tag/v0.0.85)

- build(deps): bump @types/node from 14.14.0 to 14.14.2
  ([#410](https://github.com/lightbasenl/lbu/pull/410))
- build(deps): bump eslint-config-prettier from 6.13.0 to 6.14.0
  ([#409](https://github.com/lightbasenl/lbu/pull/409))
- build(deps-dev): bump react-query from 2.23.1 to 2.25.2
  ([#411](https://github.com/lightbasenl/lbu/pull/411))
- ci: fix create release workflow
- ci: improve release note formatting
- code-gen: fix api client error handling with streams
  ([#408](https://github.com/lightbasenl/lbu/pull/408))
- code-gen: improve types of generated routes
- code-gen: improve types of sql traversal queries
- code-gen: router rename event before validators
- stdlib: add stream to buffer function
  ([#407](https://github.com/lightbasenl/lbu/pull/407))

### [v0.0.84](https://github.com/lightbasenl/lbu/releases/tag/v0.0.84)

- build(deps): bump @types/node from 14.11.10 to 14.14.0
  ([#405](https://github.com/lightbasenl/lbu/pull/405))
- chore: automatically create a release on new tags
- ci: run tests and benchmarks on Node.js 15
  ([#403](https://github.com/lightbasenl/lbu/pull/403))
- code-gen: do loose structure validation
  ([#398](https://github.com/lightbasenl/lbu/pull/398))
- code-gen: fix structure dump
  ([#396](https://github.com/lightbasenl/lbu/pull/396))
- code-gen: fix where 'in' and 'notIn' generation
- code-gen: implement 'patch' method support
  ([#404](https://github.com/lightbasenl/lbu/pull/404))
- code-gen: support adding relations to 'foreign' structure.
  ([#402](https://github.com/lightbasenl/lbu/pull/402))
- server: skip event logging on OPTIONS requests
  ([#397](https://github.com/lightbasenl/lbu/pull/397))

For a detailed description and more details about this release, please read the
[release notes](https://lbu.lightbase.nl/releases/0.0.84.html).

### [v0.0.83](https://github.com/lightbasenl/lbu/releases/tag/v0.0.83)

- build(deps): bump @types/node from 14.11.8 to 14.11.10
  ([#390](https://github.com/lightbasenl/lbu/pull/390))
- build(deps): bump c8 from 7.3.3 to 7.3.4
  ([#382](https://github.com/lightbasenl/lbu/pull/382))
- build(deps): bump eslint-config-prettier from 6.12.0 to 6.13.0
  ([#389](https://github.com/lightbasenl/lbu/pull/389))
- build(deps-dev): bump react from 16.13.1 to 16.14.0
  ([#381](https://github.com/lightbasenl/lbu/pull/381))
- code-gen: disable some sql generation parts when type is a view
  ([#392](https://github.com/lightbasenl/lbu/pull/392))
- code-gen: refactor types, validator and sql generators
  ([#377](https://github.com/lightbasenl/lbu/pull/377))
- store: add support to explain and analyze any query
  ([#391](https://github.com/lightbasenl/lbu/pull/391))
- store: support nested file groups with custom ordering
  ([#393](https://github.com/lightbasenl/lbu/pull/393))

For a detailed description and more details about this release, please read the
[release notes](https://lbu.lightbase.nl/releases/0.0.83.html).

### [v0.0.82](https://github.com/lightbasenl/lbu/releases/tag/v0.0.82)

- build(deps): bump chokidar from 3.4.2 to 3.4.3
  ([#379](https://github.com/lightbasenl/lbu/pull/379))
- store: add export for 'addRecurringJobToQueue'
  ([#376](https://github.com/lightbasenl/lbu/pull/376))
- store: add tests for recurring job scheduling
  ([#380](https://github.com/lightbasenl/lbu/pull/380))

### [v0.0.81](https://github.com/lightbasenl/lbu/releases/tag/v0.0.81)

- build(deps): bump @types/node from 14.11.4 to 14.11.8
  ([#362](https://github.com/lightbasenl/lbu/pull/362),
  [#368](https://github.com/lightbasenl/lbu/pull/368),
  [#374](https://github.com/lightbasenl/lbu/pull/374))
- build(deps): bump c8 from 7.3.1 to 7.3.3
  ([#369](https://github.com/lightbasenl/lbu/pull/369))
- build(deps): bump eslint from 7.10.0 to 7.11.0
  ([#373](https://github.com/lightbasenl/lbu/pull/373))
- build(deps): bump koa-session from 6.0.0 to 6.1.0
  ([#365](https://github.com/lightbasenl/lbu/pull/365))
- ci: dispatch sha and pr to external e2e test repo
  ([#359](https://github.com/lightbasenl/lbu/pull/359))
- code-gen: add T.searchable and support boolean in where clauses
  ([#371](https://github.com/lightbasenl/lbu/pull/371))
- docs: include contributing.md on Github pages
- store: add meta field on file
  ([#363](https://github.com/lightbasenl/lbu/pull/363))
- store: add support for recurring jobs
  ([#364](https://github.com/lightbasenl/lbu/pull/364))
- store: try multiple ways of resolving a migration namespace import
  ([#361](https://github.com/lightbasenl/lbu/pull/361))

For a detailed description and more details about this release, please read the
[release notes](https://lbu.lightbase.nl/releases/0.0.81.html).

### [v0.0.80](https://github.com/lightbasenl/lbu/releases/tag/v0.0.80)

- build(deps): bump @types/node from 14.11.2 to 14.11.4
  ([#351](https://github.com/lightbasenl/lbu/pull/351))
- code-gen: fix generated query function promise type
  ([#352](https://github.com/lightbasenl/lbu/pull/352))
- insight: add basic event system
  ([#356](https://github.com/lightbasenl/lbu/pull/356))
- insight: add function to get rowCount and diskSize per postgres table
  ([#355](https://github.com/lightbasenl/lbu/pull/355))
- server: implement event from insight on the context
  ([#357](https://github.com/lightbasenl/lbu/pull/357))

### [v0.0.79](https://github.com/lightbasenl/lbu/releases/tag/v0.0.79)

- build(deps): bump postgres from 2.0.0-beta.0 to 2.0.0-beta.2
  ([#332](https://github.com/lightbasenl/lbu/pull/332),
  [#346](https://github.com/lightbasenl/lbu/pull/346))
- build(deps-dev): bump react-query from 2.23.0 to 2.23.1
  ([#349](https://github.com/lightbasenl/lbu/pull/349))
- chore: automatically add link to release notes in the changelog and update
  publish guide
- chore: cleanup dependabot config
- chore: change default branch name to `main`
- cli: warn on usage of parent `t.xx` in sub tests
  ([#348](https://github.com/lightbasenl/lbu/pull/348))
- code-gen: generate cancel token support in browser environments
  ([#347](https://github.com/lightbasenl/lbu/pull/347))
- code-gen: open api importer fixes
  ([#345](https://github.com/lightbasenl/lbu/pull/345))
- code-gen: remove defaultValue from generated where type
  ([#339](https://github.com/lightbasenl/lbu/pull/339))
- code-gen: support `withSoftDeletes` and remove `withHistory`
  ([#334](https://github.com/lightbasenl/lbu/pull/334))
- store: cleanup table names
  ([#350](https://github.com/lightbasenl/lbu/pull/350))
- store: consistent internal query formatting
- store: enable soft deletes for fileStore
  ([#340](https://github.com/lightbasenl/lbu/pull/340))
- store: reset postgres#end timeout in tests
- store: return hash changes from getMigrationsToBeApplied
  ([#341](https://github.com/lightbasenl/lbu/pull/341))

For a detailed description and more details about this release, please read the
[release notes](https://lbu.lightbase.nl/releases/0.0.79.html).

### [v0.0.78](https://github.com/lightbasenl/lbu/releases/tag/v0.0.78)

- code-gen: fix default value of `docString`
  ([#326](https://github.com/lightbasenl/lbu/pull/326))

### [v0.0.77](https://github.com/lightbasenl/lbu/releases/tag/v0.0.77)

- cli: remove concurrent test support
  ([#324](https://github.com/lightbasenl/lbu/pull/324))
- code-gen: validator default to undefined on empty strings
  ([#325](https://github.com/lightbasenl/lbu/pull/325))

### [v0.0.76](https://github.com/lightbasenl/lbu/releases/tag/v0.0.76)

- build(deps): bump eslint from 7.9.0 to 7.10.0
  ([#313](https://github.com/lightbasenl/lbu/pull/313))
- build(deps): bump eslint-config-prettier from 6.11.0 to 6.12.0
  ([#312](https://github.com/lightbasenl/lbu/pull/312))
- build(deps): bump eslint-plugin-import from 2.22.0 to 2.22.1
  ([#321](https://github.com/lightbasenl/lbu/pull/321))
- cli: allow running tests in concurrently
  ([#322](https://github.com/lightbasenl/lbu/pull/322))
- cli: allow switching between postgres versions
  ([#317](https://github.com/lightbasenl/lbu/pull/317))
- cli: make sure Postgres is ready before returning from `docker up`
  ([#306](https://github.com/lightbasenl/lbu/pull/306))
- code-gen: convert default value always to a string
- code-gen: generate sql where clause for optional values with a default type
  ([#314](https://github.com/lightbasenl/lbu/pull/314))
- code-gen: sql follow references in DDL and where clause
  ([#315](https://github.com/lightbasenl/lbu/pull/315))
- code-gen: support providing default types on a RouteCreator
  ([#318](https://github.com/lightbasenl/lbu/pull/318))
- code-gen: verify path params against params type before generating
  ([#305](https://github.com/lightbasenl/lbu/pull/305))
- docs: consistent urls in config and sitemap
- docs: update env documentation
- docs: update sitemap to use extensions on the urls
- store: remove FileStoreContext out of files
  ([#320](https://github.com/lightbasenl/lbu/pull/320))

### [v0.0.75](https://github.com/lightbasenl/lbu/releases/tag/v0.0.75)

- build(deps): bump @types/node from 14.11.1 to 14.11.2
  ([#299](https://github.com/lightbasenl/lbu/pull/299))
- build(deps): bump c8 from 7.3.0 to 7.3.1
  ([#301](https://github.com/lightbasenl/lbu/pull/301))
- code-gen: apiClient should not call getHeaders in browser environment
  ([#302](https://github.com/lightbasenl/lbu/pull/302))
- docs: move to plain Github pages and Jekyll
  ([#298](https://github.com/lightbasenl/lbu/pull/298))

### [v0.0.74](https://github.com/lightbasenl/lbu/releases/tag/v0.0.74)

- build(deps-dev): bump react-query from 2.22.0 to 2.23.0
  ([#292](https://github.com/lightbasenl/lbu/pull/292))
- build(deps-dev): bump typescript from 4.0.2 to 4.0.3
  ([#293](https://github.com/lightbasenl/lbu/pull/293))
- cli: fix bench callback type
- cli: fix recursive error formatting
- cli: lint exit with error when CI=true
- code-gen: scoped api client generation for browser envs
  ([#294](https://github.com/lightbasenl/lbu/pull/294),
  [#295](https://github.com/lightbasenl/lbu/pull/295))

### [v0.0.73](https://github.com/lightbasenl/lbu/releases/tag/v0.0.73)

- build(deps): bump @types/node from 14.10.2 to 14.11.1
  ([#281](https://github.com/lightbasenl/lbu/pull/281),
  [#287](https://github.com/lightbasenl/lbu/pull/287))
- build(deps-dev): bump react-query from 2.20.0 to 2.22.0
  ([#282](https://github.com/lightbasenl/lbu/pull/282),
  [#288](https://github.com/lightbasenl/lbu/pull/288))
- chore: cleanup fs/promises imports
  ([#289](https://github.com/lightbasenl/lbu/pull/289))
- chore: disable testing.js script, since the generated code is not checked in
- cli: catch and handle assertion errors in tests
  ([#285](https://github.com/lightbasenl/lbu/pull/285))
- code-gen,stdlib: move templates to code-gen
  ([#286](https://github.com/lightbasenl/lbu/pull/286))
- code-gen: apiClient calls returns Promise
- code-gen: apiClient handleError should use response headers and data
- stdlib,cli,server: add and use AppError.format
  ([#284](https://github.com/lightbasenl/lbu/pull/284))

### [v0.0.72](https://github.com/lightbasenl/lbu/releases/tag/v0.0.72)

- build(deps): bump @types/node from 14.10.1 to 14.10.2
  ([#277](https://github.com/lightbasenl/lbu/pull/277))
- build(deps): bump prettier from 2.1.1 to 2.1.2
  ([#278](https://github.com/lightbasenl/lbu/pull/278))
- build(deps-dev): bump react-query from 2.17.0 to 2.20.0
  ([#268](https://github.com/lightbasenl/lbu/pull/268),
  [#275](https://github.com/lightbasenl/lbu/pull/275),
  [#276](https://github.com/lightbasenl/lbu/pull/276),
  [#280](https://github.com/lightbasenl/lbu/pull/280))
- chore: add SECURITY.md ([#271](https://github.com/lightbasenl/lbu/pull/271))
- code-gen: AppError and response validation in apiClient
  ([#274](https://github.com/lightbasenl/lbu/pull/274))
- code-gen: add group and item sorting before generation
  ([#272](https://github.com/lightbasenl/lbu/pull/272))
- code-gen: experiment with using `isBrowser` and `isNode` in the generated file
  type
- code-gen: make tags available in the router
- code-gen: use isNode check in apiClient generator
  ([#273](https://github.com/lightbasenl/lbu/pull/273))
- server: consistent logging of request length

### [v0.0.71](https://github.com/lightbasenl/lbu/releases/tag/v0.0.71)

- build(deps): bump @types/node from 14.6.4 to 14.10.1
  ([#264](https://github.com/lightbasenl/lbu/pull/264),
  [#261](https://github.com/lightbasenl/lbu/pull/261))
- build(deps): bump eslint from 7.8.1 to 7.9.0
  ([#265](https://github.com/lightbasenl/lbu/pull/265))
- build(deps): bump node-fetch from 2.6.0 to 2.6.1
  ([#258](https://github.com/lightbasenl/lbu/pull/258))
- build(deps-dev): bump react-query from 2.15.4 to 2.17.0
  ([#263](https://github.com/lightbasenl/lbu/pull/263),
  [#266](https://github.com/lightbasenl/lbu/pull/266))
- cli: format info property on caught exceptions in bench and test
  ([#257](https://github.com/lightbasenl/lbu/pull/257))
- code-gen: add simple options to App#generate to provide better defaults
  ([#260](https://github.com/lightbasenl/lbu/pull/260))
- code-gen: add validators in App#addRaw and before dumping structure
  ([#259](https://github.com/lightbasenl/lbu/pull/259))
- code-gen: consistent handling of references
- code-gen: consistent usage of 'item' in generators
- code-gen: fix sql generation of nullable foreign key column
  ([#255](https://github.com/lightbasenl/lbu/pull/255))
- code-gen: object validation strict by default
  ([#256](https://github.com/lightbasenl/lbu/pull/256))
- code-gen: remove unnecessary internal nesting on structure
- store: fix sessions with a maxAge of 'session'
  ([#267](https://github.com/lightbasenl/lbu/pull/267))

### [v0.0.70](https://github.com/lightbasenl/lbu/releases/tag/v0.0.70)

- code-gen: fix breaking changes in react-query types
  ([#252](https://github.com/lightbasenl/lbu/pull/252))

### [v0.0.69](https://github.com/lightbasenl/lbu/releases/tag/v0.0.69)

- build(deps-dev): bump react-query from 2.15.1 to 2.15.4
  ([#249](https://github.com/lightbasenl/lbu/pull/249))
- code-gen: add sql properties to generated types
  ([#250](https://github.com/lightbasenl/lbu/pull/250))
- code-gen: remove stub generators
  ([#247](https://github.com/lightbasenl/lbu/pull/247))

### [v0.0.68](https://github.com/lightbasenl/lbu/releases/tag/v0.0.68)

- build(deps): bump @types/node from 14.6.1 to 14.6.4
  ([#229](https://github.com/lightbasenl/lbu/pull/229),
  [#237](https://github.com/lightbasenl/lbu/pull/237))
- build(deps): bump eslint from 7.7.0 to 7.8.1
  ([#224](https://github.com/lightbasenl/lbu/pull/224))
- build(deps-dev): bump react-query from 2.12.1 to 2.15.1
  ([#222](https://github.com/lightbasenl/lbu/pull/222),
  [#225](https://github.com/lightbasenl/lbu/pull/225),
  [#228](https://github.com/lightbasenl/lbu/pull/228),
  [#238](https://github.com/lightbasenl/lbu/pull/238),
  [#241](https://github.com/lightbasenl/lbu/pull/241))
- build(deps-dev): bump typedoc from 0.18.0 to 0.19.0
- chore: add coverage summary to PR's
  ([#243](https://github.com/lightbasenl/lbu/pull/243))
- chore: create script to automate changelog a little bit
- chore: fix PR links in the changelog
- chore: fix linting ([#231](https://github.com/lightbasenl/lbu/pull/231))
- chore: remove typedoc setup
  ([#236](https://github.com/lightbasenl/lbu/pull/236))
- chore: setup CODEOWNERS again
- ci: comment benchmark result to PR
  ([#244](https://github.com/lightbasenl/lbu/pull/244))
- ci: create dependabot config file
  ([#226](https://github.com/lightbasenl/lbu/pull/226))
- cli, stdlib: move bench to cli
  ([#240](https://github.com/lightbasenl/lbu/pull/240))
- cli: add some testing for the provided template
  ([#234](https://github.com/lightbasenl/lbu/pull/234))
- cli: configure timeout of sub tests via `t.timeout`
  ([#232](https://github.com/lightbasenl/lbu/pull/232))
- code-gen: add optional, omit and pick types
  ([#220](https://github.com/lightbasenl/lbu/pull/220))
- code-gen: change default number to be an integer instead of float
  ([#221](https://github.com/lightbasenl/lbu/pull/221))
- code-gen: self host validation for App.extend
  ([#246](https://github.com/lightbasenl/lbu/pull/246))
- docs: regenerate for v0.0.67
- stdlib: improve perf of uuid
  ([#242](https://github.com/lightbasenl/lbu/pull/242))
- stdlib: support custom exec options
  ([#233](https://github.com/lightbasenl/lbu/pull/233))

### [v0.0.67](https://github.com/lightbasenl/lbu/releases/tag/v0.0.67)

- cli: add command to reset current database
  ([#213](https://github.com/lightbasenl/lbu/pull/213))
- cli: run test teardown before printing results
  ([#212](https://github.com/lightbasenl/lbu/pull/212))
- code-gen: follow references when resolving defaults in sql generation
  ([#215](https://github.com/lightbasenl/lbu/pull/215))

### [v0.0.66](https://github.com/lightbasenl/lbu/releases/tag/v0.0.66)

Everything is breaking!

- code-gen: add default min(1) to string type
- code-gen: generated ORDER BY for select queries withDates
- cli: configure test timeout, setup and teardown function in test/config.js
- store: add copyAllObjects to clone a complete bucket
- store: configurable postgres template support

### [v0.0.65](https://github.com/lightbasenl/lbu/releases/tag/v0.0.65)

- cli: increase static test timeout to 15 seconds

### [v0.0.64](https://github.com/lightbasenl/lbu/releases/tag/v0.0.64)

- cli: various exit code fixes
- store: add setupTestDatabase
- cli: replace tape with custom test runner

##### Breaking

Tape is replace by a custom test runner.

- Make sure to `import { test } from "@lbu/cli` instead of
  `import test from tape`
- To run a test file via `lbu run` add `mainTestFn` to the file
- Unnecessary `async` and `.end()` calls can be removed
- Only a handful of assertions, see
  [`TestRunner`](https://lbu.lightbase.nl/#/api?id=interface-testrunner)

### [v0.0.63](https://github.com/lightbasenl/lbu/releases/tag/v0.0.63)

- code-gen: remove support for both files and body add the same time
- server: remove support for fields in a multipart scenario

##### Breaking

- Use separate routes when both files and body are currently on a single route.

### [v0.0.62](https://github.com/lightbasenl/lbu/releases/tag/v0.0.62)

- cli: use http-proxy directly
- cli: support 'rs' in watch mode, mimicking nodemon
- stdlib: add exitCode to `exec`
- stdlib: rename `code` to `exitCode` in `spawn`
- server,code-gen: fix serialization of nested objects
- code-gen: postgres relation generation fixes

##### Breaking

- The return type of `spawn` and `exec` now have an `exitCode`
- Using a lower level `http-proxy` for `lbu proxy`

### [v0.0.61](https://github.com/lightbasenl/lbu/releases/tag/v0.0.61)

- code-gen: cleanup tags in doc blocks Conditionally render tags if they exists
  in doc blocks for router, apiClient and reactQuery
- server: log key and info if originalError is also AppError

##### Breaking

- code-gen: remove tag middleware
- cli: replace nodemon with chokidar
- server: handle multipart request with formidable (without koa-body)
- code-gen: transform array/objects to Querystrings because of missing support
  in FormData

### [v0.0.60](https://github.com/lightbasenl/lbu/releases/tag/v0.0.60)

- stdlib: remove logger as argument to mainFn
- stdlib: add process exception handling in mainFn
- stdlib: AppError check typeof status and key parameter

##### Breaking

- Remove logger argument from `mainFn`, change to
  `mainFn(import.meta, () => {})`

### [v0.0.59](https://github.com/lightbasenl/lbu/releases/tag/v0.0.59)

- cli: add some logging to proxy errors
- code-gen: fix react-query enabled check

### [v0.0.58](https://github.com/lightbasenl/lbu/releases/tag/v0.0.58)

- code-gen: fix setting headers in form-data upload
- code-gen: add support for file download in the apiClient

### [v0.0.57](https://github.com/lightbasenl/lbu/releases/tag/v0.0.57)

- cli: fix memory leak in proxy
- cli: add some request logging to the proxy
- server: add request content-length to server logs

### [v0.0.56](https://github.com/lightbasenl/lbu/releases/tag/v0.0.56)

- cli: use isProduction and isStaging in template
- cli: add proxy command for local development. Usable via `yarn lbu proxy`
- store: make sure sessionStore checks expired sessions
- server: use isProduction and isStaging in defaults
- server: simplify session handling
- server: fix sendFile compatibility with FileStore and FileCache

### [v0.0.55](https://github.com/lightbasenl/lbu/releases/tag/v0.0.55)

- code-gen: fix reactQuery disabled options
- code-gen: add getGroupsThatIncludeType utility
- store: fix types for FileCache
- stdlib: add isProduction and isStaging helpers
- server: cors allow localhost when `isStaging`
- server: set localhost cookies when server runs on staging

### [v0.0.54](https://github.com/lightbasenl/lbu/releases/tag/v0.0.54)

- code-gen: hotfix apiClient body template error (missing comma)

### [v0.0.53](https://github.com/lightbasenl/lbu/releases/tag/v0.0.53)

- docs: more docs for @lbu/server and @lbu/store
- docs: add sitemap.xml
- deps: bump various dependencies
- code-gen: fix FormData package usage in the apiClient
- code-gen: fix headers send by the apiClient when using FormData
- code-gen: render Date as type string in all cases for frontend generation
- stdlib: improve benchmark performance

### [v0.0.52](https://github.com/lightbasenl/lbu/releases/tag/v0.0.52)

- code-gen: add AppErrorResponse to generated reactQueries.ts
- store: remove auto delete interval from session store
- store: provide clean method on session store
- server: support custom \_domain and \_secure on session cookies
- server: fork koa-compose

##### Breaking

- Run `const store = newSessionStore(); store.clean()` in a user scheduled job.
  The session store does not automatically cleanup old sessions
- `closeTestApp` always returns a Promise

### [v0.0.51](https://github.com/lightbasenl/lbu/releases/tag/v0.0.51)

- code-gen: support generating left join queries for oneToMany relations
- code-gen: fix for Typescript not recognizing interfaces used in JS files

### [v0.0.50](https://github.com/lightbasenl/lbu/releases/tag/v0.0.50)

- code-gen: fix bug on `SelectWith` query identifiers

### [v0.0.49](https://github.com/lightbasenl/lbu/releases/tag/v0.0.49)

- code-gen: fix syntax error in apiClient (introduced in v0.0.48)

### [v0.0.48](https://github.com/lightbasenl/lbu/releases/tag/v0.0.48)

- stdlib: mainFn exit with status(1) when catching errors
- stdlib,cli: add experimental support for benchmarking
- code-gen: support both body and files on a single route
- code-gen: support generating left join queries for manyToOne relations
- code-gen: various small fixes

### [v0.0.47](https://github.com/lightbasenl/lbu/releases/tag/v0.0.47)

- code-gen: small fix for reference sql generation

### [v0.0.46](https://github.com/lightbasenl/lbu/releases/tag/v0.0.46)

- store: catch migrations errors and exit correctly
- store: add typescript types
- lint-config: more strict on control flow
- code-gen: fix sql injection in `idIn` generated queries
- code-gen: remove mock generator
- code-gen: add relation type
- code-gen: only import what is needed in generated reactQueries file

##### Breaking

- `T.reference().field` is removed. Use `T.relation().manyToOne()`
- Removed the mock generator

### [v0.0.45](https://github.com/lightbasenl/lbu/releases/tag/v0.0.45)

- code-gen: hotfix sql template issues for postgres 2.0

  Fixes introduces template bug in 0.0.44

### [v0.0.44](https://github.com/lightbasenl/lbu/releases/tag/v0.0.44)

- BREAKING: code-gen: sql template column and table identifiers to camelCase

  Generated sql templates use camelCase nameschema instead of snake_case now.
  All migrations or queries depended on LBU structure needs to be updated.

### [v0.0.43](https://github.com/lightbasenl/lbu/releases/tag/v0.0.43)

- stdlib: add AppError#instanceOf
- code-gen: build path params type if necessary but not provided by user
- server: fix koa-session options type
- store: drop Postgres connections to database if used as a template for test
  database
- code-gen: simplify TypeCreator methods
- code-gen: support inferring basic types
- code-gen: router supports arrays for tag and group middleware
- code-gen: support generating `CREATE INDEX` statements
- code-gen: added File type

##### Breaking

- Generated router exposes `setBodyParsers` which accepts the result of
  `createBodyParsers()`
- Passing in `dumpStructure` to `App.generate` is required if you want the
  router to expose lbu structure automatically
- TypeCreator methods now only accept a name. This affects `anyOf`, `array` and
  `object`
- `x instanceof AppError` should be replaced with `AppError.instanceOf(x)`

### [v0.0.42](https://github.com/lightbasenl/lbu/releases/tag/v0.0.42)

- code-gen: useQuery hook now enabled by default

### [v0.0.41](https://github.com/lightbasenl/lbu/releases/tag/v0.0.41)

- server: fix cors issue, and do some micro optimizations

### [v0.0.40](https://github.com/lightbasenl/lbu/releases/tag/v0.0.40)

- code-gen: generate valid dependant queries for react-query >=2 (#88, #80)

### [v0.0.39](https://github.com/lightbasenl/lbu/releases/tag/v0.0.39)

- code-gen: always quote object keys on mock objects

### [v0.0.38](https://github.com/lightbasenl/lbu/releases/tag/v0.0.38)

- code-gen: validator supports collecting errors instead of throwing
- code-gen: always quote object keys in types generator

### [v0.0.37](https://github.com/lightbasenl/lbu/releases/tag/v0.0.37)

- code-gen: fix generic Typescript type when key is an union type

### [v0.0.36](https://github.com/lightbasenl/lbu/releases/tag/v0.0.36)

- code-gen: fix react-query import in generated file

### [v0.0.35](https://github.com/lightbasenl/lbu/releases/tag/v0.0.35)

- server: add server testing utilities
- code-gen: e2e testing of generated router, validator and apiClient
- cli: remove asyncShould(Not)Throw functions added to tape
- code-gen: generate Postgres upsert queries for all searchable fields

### [v0.0.34](https://github.com/lightbasenl/lbu/releases/tag/v0.0.34)

- code-gen: try an fix for `WHERE IN` generation.

### [v0.0.33](https://github.com/lightbasenl/lbu/releases/tag/v0.0.33)

- code-gen: fix api client generation of interceptors

### [v0.0.32](https://github.com/lightbasenl/lbu/releases/tag/v0.0.32)

- code-gen: various fixes
- code-gen: fixed x-request-id in apiClient
- code-gen: add option to disable mock and validator generator for a type

### [v0.0.31](https://github.com/lightbasenl/lbu/releases/tag/v0.0.31)

- stdlib: resolve camelToSnakeCase issue with long strings

### [v0.0.30](https://github.com/lightbasenl/lbu/releases/tag/v0.0.30)

- docs: add api docs for code-gen and server
- code-gen: various fixes
- deps: various bumps

### [v0.0.29](https://github.com/lightbasenl/lbu/releases/tag/v0.0.29)

- server: add support for CORS_URL env variable
- stdlib: add type definition file
- stdlib: add uuid.isValid function
- code-gen: improve router generated JSDoc

### [v0.0.28](https://github.com/lightbasenl/lbu/releases/tag/v0.0.28)

- code-gen: remove axios dependency in loadFromRemote and accept as argument

### [v0.0.27](https://github.com/lightbasenl/lbu/releases/tag/v0.0.27)

- stdlib: expose pathJoin as alternative for `import { join } from "path";`
- cli: add coverage command, runs tests and collects coverage information
- insight,cli: provide typescript declaration files
- docs: initialize docsify
- docs: add typedoc for generating api information based on declaration files

### [v0.0.26](https://github.com/lightbasenl/lbu/releases/tag/v0.0.26)

- @lbu/code-gen: make sure to deepcopy baseData for type plugins

### [v0.0.25](https://github.com/lightbasenl/lbu/releases/tag/v0.0.25)

- @lbu/code-gen: add react-query generator
- @lbu/lint-config: remove JSDoc plugin
- @lbu/code-gen: make generators stable
- @lbu/cli: update boilerplate add (test-)services code

### [v0.0.24](https://github.com/lightbasenl/lbu/releases/tag/v0.0.24)

- @lbu/code-gen: fix nested reference lookups in sql code-generation

### [v0.0.23](https://github.com/lightbasenl/lbu/releases/tag/v0.0.23)

- @lbu/lint-config: version bumps and disabled jsdoc/require-returns-description
  rule
- @lbu/code-gen: minor fixes to the update queries generation

### [v0.0.22](https://github.com/lightbasenl/lbu/releases/tag/v0.0.22)

- @lbu/code-gen: fix setting column to null in update queries

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
