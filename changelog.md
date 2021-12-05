---
editLink: false
---

# Changelog

### [v0.0.178](https://github.com/compasjs/compas/releases/tag/v0.0.178)

##### Changes

- chore(changelog): fix matcher for subject and message
- chore(ci): remove bench action from PR's
- chore(cli,server,store): remove old session setup
  - Closes [#1281](https://github.com/compasjs/compas/pull/1281)
- chore(code-gen): remove @compas/cli as a dependency
- feat(code-gen,store): remove generated `where.exists`
  ([#1396](https://github.com/compasjs/compas/pull/1396))
  - Closes [#1393](https://github.com/compasjs/compas/pull/1393)
- feat(code-gen,store): support viaXxx in where clause
  ([#1395](https://github.com/compasjs/compas/pull/1395))
  - Closes [#703](https://github.com/compasjs/compas/pull/703)
- feat(code-gen): remove 'via' traversers from the query builders
  ([#1397](https://github.com/compasjs/compas/pull/1397))
  - Closes [#1394](https://github.com/compasjs/compas/pull/1394)
- feat(store): infer and validate content-type support in createOrUpdateFile
  ([#1392](https://github.com/compasjs/compas/pull/1392))
  - Closes [#1352](https://github.com/compasjs/compas/pull/1352)

##### Breaking changes

- **cli,server,store**: remove old session setup
  - Removed both the `session` middleware and `newSessionStore`. And should be
    replaced with the new session-store and session-transport. See the
    [docs](https://compasjs.com/features/session-handling.html) for more
    information.
  - Create the following migration to clean up the old table:
  ```sql
  DROP TABLE IF EXISTS "session" CASCADE;
  ```
- **code-gen,store**: remove generated `where.exists`
  - Removed `xxxExists` from being generated with the sql where clause
    generator. They can be replaced with `viaXxx` now available in the where
    clause generator.
- **code-gen**: remove 'via' traversers from the query builders
  - This should be done in the new `where.viaXxx`. Giving more flexibility by
    combining it with `where.$or` and allowed usage in update and delete
    queries.
  - Note that the query builder functions validate their inputs, so if you have
    decent test coverage, your tests should be able to catch most of your usages
    for you.

### [v0.0.177](https://github.com/compasjs/compas/releases/tag/v0.0.177)

##### Changes

- build(deps): bump @types/node from 16.11.10 to 16.11.11
  ([#1385](https://github.com/compasjs/compas/pull/1385))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint-plugin-jsdoc from 37.0.3 to 37.1.0
  ([#1390](https://github.com/compasjs/compas/pull/1390))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump pino from 7.4.1 to 7.5.1
  ([#1384](https://github.com/compasjs/compas/pull/1384),
  [#1388](https://github.com/compasjs/compas/pull/1388))
  - [Release notes](https://github.com/pinojs/pino/releases)
- docs(session-handling): mention default of 'enableCookieTransport'
- feat(code-gen): add `SessionTransportSettings` to `dumpCompasTypes`
- feat(code-gen): validate `defaultGroup` when extending with OpenAPI
  ([#1391](https://github.com/compasjs/compas/pull/1391))
- fix(code-gen): don't report leaked sessions if the complete session is
  invalidated ([#1387](https://github.com/compasjs/compas/pull/1387))

### [v0.0.176](https://github.com/compasjs/compas/releases/tag/v0.0.176)

##### Changes

- build(deps): bump @types/node from 16.11.7 to 16.11.10
  ([#1362](https://github.com/compasjs/compas/pull/1362),
  [#1369](https://github.com/compasjs/compas/pull/1369),
  [#1375](https://github.com/compasjs/compas/pull/1375))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 8.2.0 to 8.3.0
  ([#1371](https://github.com/compasjs/compas/pull/1371))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump pino from 7.2.0 to 7.4.1
  ([#1363](https://github.com/compasjs/compas/pull/1363),
  [#1374](https://github.com/compasjs/compas/pull/1374),
  [#1377](https://github.com/compasjs/compas/pull/1377))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump postgres from 2.0.0-beta.10 to 2.0.0-beta.11
  ([#1358](https://github.com/compasjs/compas/pull/1358))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump prettier from 2.4.1 to 2.5.0
  ([#1381](https://github.com/compasjs/compas/pull/1381))
  - [Release notes](https://github.com/prettier/prettier/releases)
- chore(code-gen): remove unnecessary logs in react-query generator
  ([#1364](https://github.com/compasjs/compas/pull/1364))
- feat(code-gen): rename `loadFromRemote` to `loadApiStructureFromRemote`
  ([#1365](https://github.com/compasjs/compas/pull/1365))
  - Closes [#1351](https://github.com/compasjs/compas/pull/1351)
- feat(code-gen): support `declareGlobalTypes: false` as generate option for
  packages ([#1367](https://github.com/compasjs/compas/pull/1367))
- feat(store): add session transports
  ([#1380](https://github.com/compasjs/compas/pull/1380))
- fix(code-gen): fix types of validated files in the router
  ([#1366](https://github.com/compasjs/compas/pull/1366))
  - Closes [#1350](https://github.com/compasjs/compas/pull/1350)
- fix(code-gen): openapi exporter support for multiple methods within the same
  path ([#1361](https://github.com/compasjs/compas/pull/1361))
- fix(code-gen): pickType error typo fix
  ([#1357](https://github.com/compasjs/compas/pull/1357))

##### Breaking changes

- **code-gen**: rename `loadFromRemote` to `loadApiStructureFromRemote`

Read more on session transports in the
[docs](https://compasjs.com/features/session-handling.html#session-transport).

Thanks to @tjonger and @kaliumxyz for their contributions!

### [v0.0.175](https://github.com/compasjs/compas/releases/tag/v0.0.175)

##### Changes

- feat(code-gen): replace whole structure with api subset
  ([#1353](https://github.com/compasjs/compas/pull/1353))
- fix(code-gen): fix issue with references (and resolve references within
  structure) ([#1355](https://github.com/compasjs/compas/pull/1355))

### [v0.0.174](https://github.com/compasjs/compas/releases/tag/v0.0.174)

##### Changes

- build(deps): bump sharp from 0.29.2 to 0.29.3
  ([#1349](https://github.com/compasjs/compas/pull/1349))
  - [Release notes](https://github.com/lovell/sharp/releases)
- feat(store): add `JobQueueWorker.clean()` method
  ([#1347](https://github.com/compasjs/compas/pull/1347))
- feat(store): add `unsafeIgnoreSorting` as a queue worker option
  ([#1345](https://github.com/compasjs/compas/pull/1345))
  - References [#1344](https://github.com/compasjs/compas/pull/1344)
- feat(store): add index on `job.updatedAt`
  - Closes [#1344](https://github.com/compasjs/compas/pull/1344)
- feat(store): remove `averageTimeToCompletion` from `JobQueueWorker`
  ([#1346](https://github.com/compasjs/compas/pull/1346))

##### Breaking changes

- **store**: add index on `job.updatedAt`
  - Add the following index in a sql migration:
  ```sql
  CREATE INDEX IF NOT EXISTS "jobIsCompleteUpdatedAt" ON "job" ("isComplete", "updatedAt") WHERE "isComplete" IS TRUE;
  ```
- **store**: remove `averageTimeToCompletion` from `JobQueueWorker`

### [v0.0.173](https://github.com/compasjs/compas/releases/tag/v0.0.173)

##### Changes

- build(deps): bump @babel/eslint-parser from 7.16.0 to 7.16.3
  ([#1340](https://github.com/compasjs/compas/pull/1340))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 16.11.6 to 16.11.7
  ([#1339](https://github.com/compasjs/compas/pull/1339))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint-plugin-import from 2.25.2 to 2.25.3
  ([#1342](https://github.com/compasjs/compas/pull/1342))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump pino from 7.1.0 to 7.2.0
  ([#1341](https://github.com/compasjs/compas/pull/1341))
  - [Release notes](https://github.com/pinojs/pino/releases)
- chore(docs): add release v0.0.172 to the sidebar
- fix(store): saving of transforms in `sendTransformedImage`
  ([#1343](https://github.com/compasjs/compas/pull/1343))
  - Closes [#1338](https://github.com/compasjs/compas/pull/1338)

### [v0.0.172](https://github.com/compasjs/compas/releases/tag/v0.0.172)

##### Changes

- build(deps): bump @types/formidable from 1.2.4 to 2.0.0
  ([#1332](https://github.com/compasjs/compas/pull/1332))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 8.1.0 to 8.2.0
  ([#1331](https://github.com/compasjs/compas/pull/1331))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump pino from 7.0.5 to 7.1.0
  ([#1329](https://github.com/compasjs/compas/pull/1329))
  - [Release notes](https://github.com/pinojs/pino/releases)
- code-gen: replace `includeReferenceTypes` with non recursive one
  ([#1327](https://github.com/compasjs/compas/pull/1327))
- docs(migrations): add session store to store migrations
- feat(lint-config): change env from es2020 to es2021
  ([#1333](https://github.com/compasjs/compas/pull/1333))
- feat(stdlib): support formatting Aggregate errors
  ([#1334](https://github.com/compasjs/compas/pull/1334))
  - Closes [#1205](https://github.com/compasjs/compas/pull/1205)
- feat(store): add JWT based session store support
  ([#1302](https://github.com/compasjs/compas/pull/1302))
- fix(store): fix types of session-store functions
  ([#1336](https://github.com/compasjs/compas/pull/1336))

##### Breaking changes

- **deps**: bump @types/formidable from 1.2.4 to 2.0.0
  - Major version bump
- **stdlib**: support formatting Aggregate errors
  - Renamed `AppError#originalError` to `AppError#cause`
  - Format also uses `cause` as the key when formatting `AppError` instead of
    `originalError`
- **store**: add JWT based session store support
  - Includes a migration, see the release notes

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.172.html).

### [v0.0.171](https://github.com/compasjs/compas/releases/tag/v0.0.171)

##### Changes

- build(deps): bump @babel/core from 7.15.8 to 7.16.0
  ([#1314](https://github.com/compasjs/compas/pull/1314))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.15.8 to 7.16.0
  ([#1315](https://github.com/compasjs/compas/pull/1315))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 16.11.1 to 16.11.6
  ([#1285](https://github.com/compasjs/compas/pull/1285) ,
  [#1291](https://github.com/compasjs/compas/pull/1291),
  [#1299](https://github.com/compasjs/compas/pull/1299))
- build(deps): bump eslint from 8.0.1 to 8.1.0
  ([#1292](https://github.com/compasjs/compas/pull/1292))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 36.1.1 to 37.0.3
  ([#1290](https://github.com/compasjs/compas/pull/1290) ,
  [#1298](https://github.com/compasjs/compas/pull/1298),
  [#1303](https://github.com/compasjs/compas/pull/1303))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump formidable from 2.0.0-canary.20200504.1 to 2.0.1
  ([#1318](https://github.com/compasjs/compas/pull/1318))
  - Closes [#1317](https://github.com/compasjs/compas/pull/1317)
- build(deps): bump pino from 7.0.3 to 7.0.5
  ([#1297](https://github.com/compasjs/compas/pull/1297))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump sharp from 0.29.1 to 0.29.2
  ([#1284](https://github.com/compasjs/compas/pull/1284))
- chore(ci): run tests on Node.js 17
  ([#1295](https://github.com/compasjs/compas/pull/1295))
- chore(docs): fix Node.js version in README's
- chore(docs): fix typo in command on getting started page
  ([#1287](https://github.com/compasjs/compas/pull/1287))
- feat(code-gen): implement openApi spec exporter
  ([#1283](https://github.com/compasjs/compas/pull/1283))
- feat(code-gen): throw error on unused group name
  ([#1288](https://github.com/compasjs/compas/pull/1288))
  - Closes [#1286](https://github.com/compasjs/compas/pull/1286)
- feat(code-gen): use abort signal in api clients
  ([#1319](https://github.com/compasjs/compas/pull/1319))
- feat(stdlib): add AppError#format support for various primitives
  ([#1325](https://github.com/compasjs/compas/pull/1325))
  - Closes [#1323](https://github.com/compasjs/compas/pull/1323)
- fix(code-gen): add React import to reactQuery template
  ([#1320](https://github.com/compasjs/compas/pull/1320))
- fix(code-gen): handle optional object values that are references
  ([#1311](https://github.com/compasjs/compas/pull/1311))
  - Closes [#1309](https://github.com/compasjs/compas/pull/1309)
- fix(code-gen): throw early error on missing arguments to T.reference()
  ([#1310](https://github.com/compasjs/compas/pull/1310))
  - Closes [#1305](https://github.com/compasjs/compas/pull/1305)
- fix(stdlib): fix TS error on logger destination usage

##### Breaking changes

- **deps**: bump eslint-plugin-jsdoc from 36.1.1 to 37.0.3
  - Major version bump
- **deps**: bump formidable from 2.0.0-canary.20200504.1 to 2.0.1
  - Renamed properties on `ctx.validatedFiles`.
  - `ctx.validatedFiles.xxx.path` -> `ctx.validatedFiles.xxx.filepath`
  - `ctx.validatedFiles.xxx.name` -> `ctx.validatedFiles.xxx.originalFilename`
  - `ctx.validatedFiles.xxx.type` -> `ctx.validatedFiles.xxx.mimetype`
- **code-gen**: use abort signal in api clients
  - Removed the `cancelToken` support that where passed via react-query options.
  - Generated hooks automatically pass the react-query based signal to the api
    client functions.
  - Requires react-query 3.30.0 or higher

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.171.html).

Thanks to @tjonger and @bjarn for their contributions!

### [v0.0.170](https://github.com/compasjs/compas/releases/tag/v0.0.170)

##### Changes

- build(deps): bump @types/minio from 7.0.10 to 7.0.11
  ([#1277](https://github.com/compasjs/compas/pull/1277))
- build(deps): bump koa from 2.13.3 to 2.13.4
  ([#1279](https://github.com/compasjs/compas/pull/1279))
  - [Release notes](https://github.com/koajs/koa/releases)
- build(deps): bump pino from 7.0.2 to 7.0.3
  ([#1278](https://github.com/compasjs/compas/pull/1278))
  - [Release notes](https://github.com/pinojs/pino/releases)
- fix(store): matcher name for iLike was incorrect in where generator

### [v0.0.169](https://github.com/compasjs/compas/releases/tag/v0.0.169)

##### Changes

- fix(store): fix interpolation after `where.includeNotNull`
  ([#1276](https://github.com/compasjs/compas/pull/1276))

### [v0.0.168](https://github.com/compasjs/compas/releases/tag/v0.0.168)

##### Changes

- bench(stdlib): add better logger benchmarks
- build(deps): bump @babel/core from 7.15.5 to 7.15.8
  ([#1249](https://github.com/compasjs/compas/pull/1249))
- build(deps): bump @babel/eslint-parser from 7.15.7 to 7.15.8
  ([#1250](https://github.com/compasjs/compas/pull/1250))
- build(deps): bump @types/node from 16.10.2 to 16.11.1
  ([#1245](https://github.com/compasjs/compas/pull/1245),
  [#1262](https://github.com/compasjs/compas/pull/1262),
  [#1266](https://github.com/compasjs/compas/pull/1266),
  [#1268](https://github.com/compasjs/compas/pull/1268),
  [#1272](https://github.com/compasjs/compas/pull/1272))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump c8 from 7.9.0 to 7.10.0
  ([#1248](https://github.com/compasjs/compas/pull/1248))
- build(deps): bump eslint from 7.32.0 to 8.0.1
  ([#1265](https://github.com/compasjs/compas/pull/1265))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-import from 2.24.2 to 2.25.2
  ([#1263](https://github.com/compasjs/compas/pull/1263))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump eslint-plugin-jsdoc from 36.1.0 to 36.1.1
  ([#1252](https://github.com/compasjs/compas/pull/1252))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- chore(changelog): fix matcher on multiple git commit subjects
- feat(code-gen,store): use a runtime helper to build the where clause
  ([#1273](https://github.com/compasjs/compas/pull/1273))
- feat(docs): add router & api client generator documents
  ([#1254](https://github.com/compasjs/compas/pull/1254))
  - References [#1138](https://github.com/compasjs/compas/pull/1138)
  - Closes [#1140](https://github.com/compasjs/compas/pull/1140)
- feat(docs): add some more body to the code-gen api doc.
- feat(stdlib): use Pino as ndjson logger
  ([#1274](https://github.com/compasjs/compas/pull/1274))
  - Closes [#1271](https://github.com/compasjs/compas/pull/1271)
- fix(code-gen): limit `body()` usage on `R.delete()`
  ([#1256](https://github.com/compasjs/compas/pull/1256))
  - Closes [#1246](https://github.com/compasjs/compas/pull/1246)
- fix(server): redo leakError in de error handler middleware
  ([#1267](https://github.com/compasjs/compas/pull/1267))
  - Closes [#1257](https://github.com/compasjs/compas/pull/1257)

##### Breaking changes

- **deps**: bump eslint from 7.32.0 to 8.0.1
  - Major version bump
- **stdlib**: use Pino as ndjson logger
  - The production log writer is replaced.
  - `ndjson` log lines contain a `time` field with milliseconds since epoch
    instead of a `timestamp` field with an ISO-8601 string.
- **server**: redo leakError in de error handler middleware
  - `leakError: true` is ignored if a custom `onAppError` is provided

### [v0.0.167](https://github.com/compasjs/compas/releases/tag/v0.0.167)

##### Changes

- feat(code-gen): make date validator more flexible
  ([#1241](https://github.com/compasjs/compas/pull/1241))
  - Closes [#1229](https://github.com/compasjs/compas/pull/1229)
- feat(server): log middleware also handles Koa error events
  ([#1239](https://github.com/compasjs/compas/pull/1239))
- test(server): add more e2e tests for sendFile
  ([#1238](https://github.com/compasjs/compas/pull/1238))

### [v0.0.166](https://github.com/compasjs/compas/releases/tag/v0.0.166)

##### Changes

- build(deps): bump @types/node from 16.10.1 to 16.10.2
  ([#1233](https://github.com/compasjs/compas/pull/1233))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump postgres from 2.0.0-beta.9 to 2.0.0-beta.10
  ([#1232](https://github.com/compasjs/compas/pull/1232))
  - [Release notes](https://github.com/porsager/postgres/releases)
- chore(deps): revert minio from 7.0.19 to 7.0.18
  - Closes [#1197](https://github.com/compasjs/compas/pull/1197)
- feat(code-gen,server): change requestId behaviour
  ([#1235](https://github.com/compasjs/compas/pull/1235))

##### Breaking changes

- **code-gen**: change requestId behaviour
  - Removed `addRequestIdInterceptors` from `$generatedDir/common/apiClient`

### [v0.0.165](https://github.com/compasjs/compas/releases/tag/v0.0.165)

##### Changes

- build(deps): bump @babel/eslint-parser from 7.15.4 to 7.15.7
  ([#1210](https://github.com/compasjs/compas/pull/1210))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 16.9.1 to 16.10.1
  ([#1203](https://github.com/compasjs/compas/pull/1203),
  [#1213](https://github.com/compasjs/compas/pull/1213),
  [#1217](https://github.com/compasjs/compas/pull/1217),
  [#1228](https://github.com/compasjs/compas/pull/1228))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump koa from 2.13.1 to 2.13.3
  ([#1222](https://github.com/compasjs/compas/pull/1222),
  [#1227](https://github.com/compasjs/compas/pull/1227))
  - [Release notes](https://github.com/koajs/koa/releases)
- build(deps): bump postgres from 2.0.0-beta.8 to 2.0.0-beta.9
  ([#1214](https://github.com/compasjs/compas/pull/1214))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump prettier from 2.4.0 to 2.4.1
  ([#1204](https://github.com/compasjs/compas/pull/1204))
  - [Release notes](https://github.com/prettier/prettier/releases)
- feat(cli): also print passed test assertions around the failed assertion
  ([#1224](https://github.com/compasjs/compas/pull/1224))
  - Closes [#1220](https://github.com/compasjs/compas/pull/1220)
- feat(docs): add code-gen setup and validators
  ([#1211](https://github.com/compasjs/compas/pull/1211))
  - Closes [#1137](https://github.com/compasjs/compas/pull/1137)
- feat(stdlib): support formatting Error#clause in AppError#format
  ([#1208](https://github.com/compasjs/compas/pull/1208))
  - Closes [#1181](https://github.com/compasjs/compas/pull/1181)
- feat(store): add job name filter to JobQueueWorker
  ([#1225](https://github.com/compasjs/compas/pull/1225))
  - Closes [#1223](https://github.com/compasjs/compas/pull/1223)
- fix(cli): ensure visualise output directory exists
  ([#1207](https://github.com/compasjs/compas/pull/1207))
  - Closes [#1206](https://github.com/compasjs/compas/pull/1206)

##### Breaking changes

- **store**: add job name filter to JobQueueWorker
  - Removed support for specifying a specific job name in the `JobQueueWorker`
    constructor. Please migrate to the `{ includedNames: ["job.name"] }` syntax.

### [v0.0.164](https://github.com/compasjs/compas/releases/tag/v0.0.164)

##### Changes

- fix(cli,server): access-control-request-headers is not always set in a cors
  preflight ([#1201](https://github.com/compasjs/compas/pull/1201))

### [v0.0.163](https://github.com/compasjs/compas/releases/tag/v0.0.163)

##### Changes

- build(deps): bump @types/formidable from 1.2.3 to 1.2.4
  ([#1195](https://github.com/compasjs/compas/pull/1195))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- fix(code-gen): correct reuse of any validators
  ([#1199](https://github.com/compasjs/compas/pull/1199))

### [v0.0.162](https://github.com/compasjs/compas/releases/tag/v0.0.162)

##### Changes

- build(deps): bump @types/node from 16.7.12 to 16.9.1
  ([#1173](https://github.com/compasjs/compas/pull/1173),
  [#1179](https://github.com/compasjs/compas/pull/1179),
  [#1186](https://github.com/compasjs/compas/pull/1186))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump c8 from 7.8.0 to 7.9.0
  ([#1187](https://github.com/compasjs/compas/pull/1187))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump eslint-plugin-jsdoc from 36.0.8 to 36.1.0
  ([#1174](https://github.com/compasjs/compas/pull/1174))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump prettier from 2.3.2 to 2.4.0
  ([#1184](https://github.com/compasjs/compas/pull/1184))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump sharp from 0.29.0 to 0.29.1
  ([#1171](https://github.com/compasjs/compas/pull/1171))
  - [Release notes](https://github.com/lovell/sharp/releases)
- feat(code-gen): don't output params & data if not used in the api client
  ([#1193](https://github.com/compasjs/compas/pull/1193))
  - Closes [#1188](https://github.com/compasjs/compas/pull/1188)
- feat(code-gen): redo options.enabled of react-query generator
  ([#1194](https://github.com/compasjs/compas/pull/1194))
  - Closes [#1189](https://github.com/compasjs/compas/pull/1189)
  - Closes [#1190](https://github.com/compasjs/compas/pull/1190)
- fix(code-gen): error when multiple relations use the same ownKey
  ([#1192](https://github.com/compasjs/compas/pull/1192))
  - Closes [#1177](https://github.com/compasjs/compas/pull/1177)
- fix(code-gen): throw explicit error on empty sql update clause
  ([#1191](https://github.com/compasjs/compas/pull/1191))
  - Closes [#1175](https://github.com/compasjs/compas/pull/1175)
- fix(docs): typo in session handling
- fix(store): syncDeletedFiles permanently delete transformed
  ([#1182](https://github.com/compasjs/compas/pull/1182))

### [v0.0.161](https://github.com/compasjs/compas/releases/tag/v0.0.161)

##### Changes

- fix(code-gen): validation of optional references in object types
  ([#1169](https://github.com/compasjs/compas/pull/1169))

### [v0.0.160](https://github.com/compasjs/compas/releases/tag/v0.0.160)

##### Changes

- build(deps): bump @types/node from 16.7.10 to 16.7.12
  ([#1167](https://github.com/compasjs/compas/pull/1167))
- fix(server): use correct condition for session renew behavior

### [v0.0.159](https://github.com/compasjs/compas/releases/tag/v0.0.159)

##### Changes

- feat(server): support renewing sessions every x seconds
  ([#1166](https://github.com/compasjs/compas/pull/1166))

### [v0.0.158](https://github.com/compasjs/compas/releases/tag/v0.0.158)

##### Changes

- build(deps): bump @babel/core from 7.15.0 to 7.15.5
  ([#1160](https://github.com/compasjs/compas/pull/1160),
  [#1163](https://github.com/compasjs/compas/pull/1163))
- build(deps): bump @babel/eslint-parser from 7.15.0 to 7.15.4
  ([#1159](https://github.com/compasjs/compas/pull/1159))
- build(deps): bump @types/minio from 7.0.9 to 7.0.10
  ([#1121](https://github.com/compasjs/compas/pull/1121))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump @types/node from 16.6.0 to 16.7.10
  ([#1104](https://github.com/compasjs/compas/pull/1104),
  [#1122](https://github.com/compasjs/compas/pull/1122),
  [#1127](https://github.com/compasjs/compas/pull/1127),
  [#1152](https://github.com/compasjs/compas/pull/1152),
  [#1156](https://github.com/compasjs/compas/pull/1156))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint-plugin-import from 2.24.0 to 2.24.2
  ([#1112](https://github.com/compasjs/compas/pull/1112),
  [#1117](https://github.com/compasjs/compas/pull/1117))
- build(deps): bump eslint-plugin-jsdoc from 36.0.7 to 36.0.8
  ([#1118](https://github.com/compasjs/compas/pull/1118))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump minio from 7.0.18 to 7.0.19
  ([#1114](https://github.com/compasjs/compas/pull/1114))
- build(deps): bump postgres from 2.0.0-beta.6 to 2.0.0-beta.8
  ([#1107](https://github.com/compasjs/compas/pull/1107),[#1123](https://github.com/compasjs/compas/pull/1123))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump sharp from 0.28.3 to 0.29.0
  ([#1108](https://github.com/compasjs/compas/pull/1108))
- chore: fix issues after Typescript 4.4 update
  ([#1124](https://github.com/compasjs/compas/pull/1124))
- chore(ci): add syncMetadata & docs build to PR's
  ([#1154](https://github.com/compasjs/compas/pull/1154))
- docs: revamp docs in to more feature based
  ([#1151](https://github.com/compasjs/compas/pull/1151))
  - References [#1131](https://github.com/compasjs/compas/pull/1131)
  - Closes [#1141](https://github.com/compasjs/compas/pull/1141)
  - Closes [#1142](https://github.com/compasjs/compas/pull/1142)
  - Closes [#1143](https://github.com/compasjs/compas/pull/1143)
  - Closes [#1149](https://github.com/compasjs/compas/pull/1149)
  - Closes [#1150](https://github.com/compasjs/compas/pull/1150)
- feat(all): support and recommend using the Typescript language server
  ([#1055](https://github.com/compasjs/compas/pull/1055))
- feat(code-gen): add support for Postgres default values
  ([#1130](https://github.com/compasjs/compas/pull/1130))
  - Closes [#1098](https://github.com/compasjs/compas/pull/1098)
- feat(code-gen): always collect as much validator issues as possible
  ([#1161](https://github.com/compasjs/compas/pull/1161))
  - Closes [#1158](https://github.com/compasjs/compas/pull/1158)
- feat(code-gen): sort imports in generated files before writing
  ([#1125](https://github.com/compasjs/compas/pull/1125))
  - Closes [#1110](https://github.com/compasjs/compas/pull/1110)
- feat(docs): add http server document
  ([#1157](https://github.com/compasjs/compas/pull/1157))
  - Closes [#1134](https://github.com/compasjs/compas/pull/1134)
- feat(docs): add TS setup & logger and events
  ([#1153](https://github.com/compasjs/compas/pull/1153))
  - Closes [#1132](https://github.com/compasjs/compas/pull/1132)
  - Closes [#1133](https://github.com/compasjs/compas/pull/1133)
- feat(docs): queue, migration, postgres, session and test docs
  - Closes [#1135](https://github.com/compasjs/compas/pull/1135)
  - Closes [#1136](https://github.com/compasjs/compas/pull/1136)
  - Closes [#1144](https://github.com/compasjs/compas/pull/1144)
  - Closes [#1147](https://github.com/compasjs/compas/pull/1147)
  - Closes [#1148](https://github.com/compasjs/compas/pull/1148)
- fix(code-gen): allow searchable on references
  ([#1128](https://github.com/compasjs/compas/pull/1128))
  - Closes [#1109](https://github.com/compasjs/compas/pull/1109)
- fix(code-gen): nullable types on sql insert partials
  ([#1129](https://github.com/compasjs/compas/pull/1129))
  - References [#1098](https://github.com/compasjs/compas/pull/1098)

##### Breaking changes

- **deps**: bump sharp from 0.28.3 to 0.29.0
  - Major version bump
- **code-gen**: always collect as much validator issues as possible
  - No TypeScript file support anymore in the 'validator' generator
  - Removed the 'throwingValidator' option, every validator returns a
    `{ error }|{, value }` result, where the error is an `AppError` or the value
    key containing the validation result
  - The `AppError` key is now always `validator.error`. Errors by path are now
    put on `error.info["$.xxx"].key`

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.158.html).

### [v0.0.157](https://github.com/compasjs/compas/releases/tag/v0.0.157)

##### Changes

- build(deps): bump @types/node from 16.4.13 to 16.6.0
  ([#1101](https://github.com/compasjs/compas/pull/1101))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint-plugin-import from 2.23.4 to 2.24.0
  ([#1088](https://github.com/compasjs/compas/pull/1088))
- build(deps): bump eslint-plugin-jsdoc from 36.0.6 to 36.0.7
  ([#1102](https://github.com/compasjs/compas/pull/1102))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- feat(code-gen): support 'schema' in 'queryOptions'
  ([#1103](https://github.com/compasjs/compas/pull/1103))
  - Closes [#1090](https://github.com/compasjs/compas/pull/1090)
- feat(store): add support for JS migration files
  ([#1097](https://github.com/compasjs/compas/pull/1097))
  - Closes [#1092](https://github.com/compasjs/compas/pull/1092)
- feat(store): better PG connection handling
  ([#1096](https://github.com/compasjs/compas/pull/1096))
  - Closes [#1089](https://github.com/compasjs/compas/pull/1089)

##### Breaking changes

- **store**: better PG connection handling

  - `setPostgresDatabaseTemplate` requires a connection created by
    `createTestPostgresDatabase`

  ```js
  // test/config.js
  export async function setup() {
    const sql = await createTestPostgresDatabase();
    await setPostgresDatabaseTemplate(sql);
    await sql.end({ timeout: 0 });
  }

  export async function teardown() {
    await cleanupPostgresDatabaseTemplate();
  }
  ```

  - `cleanupTestPostgresDatabase` is not guaranteed to delete the provided
    database.
  - Changed logic around checking options passed to `newPostgresConnection`.
    This shouldn't affect any existing usage, but is more flexible when
    connecting to many databases.
  - Default connection pool is 15 instead of unspecified.

### [v0.0.156](https://github.com/compasjs/compas/releases/tag/v0.0.156)

##### Changes

- build(deps): bump @babel/core from 7.14.8 to 7.15.0
  ([#1083](https://github.com/compasjs/compas/pull/1083))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.14.7 to 7.15.0
  ([#1077](https://github.com/compasjs/compas/pull/1077),
  [#1082](https://github.com/compasjs/compas/pull/1082))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 16.4.8 to 16.4.13
  ([#1081](https://github.com/compasjs/compas/pull/1081),
  [#1084](https://github.com/compasjs/compas/pull/1084),
  [#1076](https://github.com/compasjs/compas/pull/1076),
  [#1079](https://github.com/compasjs/compas/pull/1079))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- feat(code-gen): add sql upsert on primary key support
  ([#1087](https://github.com/compasjs/compas/pull/1087))
  - Closes [#1080](https://github.com/compasjs/compas/pull/1080)
- feat(store): add sendTransformedImage compatible with Next.js image loaders
  ([#1078](https://github.com/compasjs/compas/pull/1078))

### [v0.0.155](https://github.com/compasjs/compas/releases/tag/v0.0.155)

##### Changes

- build(deps): bump @types/node from 16.4.6 to 16.4.8
  ([#1074](https://github.com/compasjs/compas/pull/1074))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 7.31.0 to 7.32.0
  ([#1075](https://github.com/compasjs/compas/pull/1075))
  - [Release notes](https://github.com/eslint/eslint/releases)
- chore(release): fix release script
- chore: lint JSDoc blocks
- chore(release): fix release of code-gen and linting

### [v0.0.154](https://github.com/compasjs/compas/releases/tag/v0.0.154)

##### Changes

- build(deps): bump @types/minio from 7.0.8 to 7.0.9
  ([#1057](https://github.com/compasjs/compas/pull/1057))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump @types/node from 16.4.0 to 16.4.6
  ([#1050](https://github.com/compasjs/compas/pull/1050),
  [#1059](https://github.com/compasjs/compas/pull/1059),
  [#1061](https://github.com/compasjs/compas/pull/1061),
  [#1065](https://github.com/compasjs/compas/pull/1065),
  [#1069](https://github.com/compasjs/compas/pull/1069))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump c8 from 7.7.3 to 7.8.0
  ([#1067](https://github.com/compasjs/compas/pull/1067))
- build(deps): bump eslint-plugin-jsdoc from 35.5.0 to 36.0.6
  ([#1052](https://github.com/compasjs/compas/pull/1052),
  [#1058](https://github.com/compasjs/compas/pull/1058),
  [#1063](https://github.com/compasjs/compas/pull/1063),
  [#1064](https://github.com/compasjs/compas/pull/1064),
  [#1068](https://github.com/compasjs/compas/pull/1068))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump recast from 0.20.4 to 0.20.5
  ([#1051](https://github.com/compasjs/compas/pull/1051))
  - [Release notes](https://github.com/benjamn/recast/releases)
- chore: drop lerna, create custom release script
  ([#1072](https://github.com/compasjs/compas/pull/1072))
  - Closes [#1053](https://github.com/compasjs/compas/pull/1053)
- fix(code-gen): throw on unknown type in validators
  ([#1071](https://github.com/compasjs/compas/pull/1071))
  - Closes [#1062](https://github.com/compasjs/compas/pull/1062)
- fix(store): use connection defaults when creating postgres database
  ([#1070](https://github.com/compasjs/compas/pull/1070))
  - Closes [#1066](https://github.com/compasjs/compas/pull/1066)

##### Breaking changes

- **deps**: bump eslint-plugin-jsdoc from 35.5.0 to 36.0.6
  - Major version bump

### [v0.0.153](https://github.com/compasjs/compas/releases/tag/v0.0.153)

##### Changes

- build(deps): bump @babel/core from 7.14.6 to 7.14.8
  ([#1044](https://github.com/compasjs/compas/pull/1044))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 16.3.1 to 16.4.0
  ([#1033](https://github.com/compasjs/compas/pull/1033),
  [#1041](https://github.com/compasjs/compas/pull/1041),
  [#1043](https://github.com/compasjs/compas/pull/1043))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 7.30.0 to 7.31.0
  ([#1039](https://github.com/compasjs/compas/pull/1039))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 35.4.3 to 35.5.0
  ([#1038](https://github.com/compasjs/compas/pull/1038),
  [#1045](https://github.com/compasjs/compas/pull/1045))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- feat(cli): remove `newTestEvent` options
  ([#1031](https://github.com/compasjs/compas/pull/1031))
  - Closes [#1030](https://github.com/compasjs/compas/pull/1030)
- feat(docs): integrate docs from compasjs/docs and move to Vitepress
  ([#1036](https://github.com/compasjs/compas/pull/1036))
  - Closes [#1029](https://github.com/compasjs/compas/pull/1029)
- fix(code-gen): fix jsdoc return type for query builders
  ([#1034](https://github.com/compasjs/compas/pull/1034))
- fix(code-gen): handle convert when generating types.
  ([#1048](https://github.com/compasjs/compas/pull/1048))
  - Closes [#1047](https://github.com/compasjs/compas/pull/1047)
- fix(store): add Buffer to types of source for createOrUpdateFile
  ([#1049](https://github.com/compasjs/compas/pull/1049))
  - Closes [#1046](https://github.com/compasjs/compas/pull/1046)
- test(code-gen): add e2e tests for handled errors
  ([#1032](https://github.com/compasjs/compas/pull/1032))
  - Closes [#1021](https://github.com/compasjs/compas/pull/1021)
- test(store): fix flaky tests by increasing timeouts
  ([#1037](https://github.com/compasjs/compas/pull/1037))

##### Breaking changes

- **cli**: remove `newTestEvent` options
  - Removed the `options` argument on `newTestEvent`. This was more confusing
    than a few extra logs in the test output.

### [v0.0.152](https://github.com/compasjs/compas/releases/tag/v0.0.152)

##### Changes

- build(deps): bump @types/node from 16.0.1 to 16.3.1
  ([#1018](https://github.com/compasjs/compas/pull/1018),
  [#1026](https://github.com/compasjs/compas/pull/1026))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint-plugin-jsdoc from 35.4.1 to 35.4.3
  ([#1019](https://github.com/compasjs/compas/pull/1019),
  [#1025](https://github.com/compasjs/compas/pull/1025))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- chore(ci): disable setup-node auto cache for sync-docs
- chore(codecov): make patch informational as well
- feat(cli): change default worker count of test to 4 instead of number of cpus
  - Closes [#1023](https://github.com/compasjs/compas/pull/1023)
- feat(cli): run tests in parallel by default while collecting coverage
  ([#1024](https://github.com/compasjs/compas/pull/1024))
  - Closes [#1022](https://github.com/compasjs/compas/pull/1022)
- feat(code-gen): error when relation key is a reserved query builder key
  ([#1020](https://github.com/compasjs/compas/pull/1020))
- feat(code-gen): add 'as' and 'limit' as reserved query builder keys

##### Breaking changes

- **cli**: run tests in parallel by default while collecting coverage
  - `compas coverage` by defaults executes tests with the default settings
    (parallel)
  - `compas coverage` now also accepts all arguments of `compas test` like
    `--serial` and `--parallel-count`. To get the old behaviour run
    `compas coverage --serial`

### [v0.0.151](https://github.com/compasjs/compas/releases/tag/v0.0.151)

##### Changes

- build(deps): bump @types/minio from 7.0.7 to 7.0.8
  ([#1012](https://github.com/compasjs/compas/pull/1012))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump @types/node from 15.12.5 to 16.0.1
  ([#1008](https://github.com/compasjs/compas/pull/1008),
  [#1010](https://github.com/compasjs/compas/pull/1010),
  [#1014](https://github.com/compasjs/compas/pull/1014))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 7.29.0 to 7.30.0
  ([#1011](https://github.com/compasjs/compas/pull/1011))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump postgres from 2.0.0-beta.5 to 2.0.0-beta.6
  ([#1015](https://github.com/compasjs/compas/pull/1015))
  - [Release notes](https://github.com/porsager/postgres/releases)
- chore: only support Node.js v16 and higher
- chore(ci): disable auto-merge of dependabot PR's
- chore(ci): use setup-node@v2 with built-in cache support
- feat(code-gen): rename `ctx.event` in matched handlers with a `router.` prefix
  ([#1017](https://github.com/compasjs/compas/pull/1017))
- fix(stdlib): replace TimeoutError with AppError, fix formatting of info object
  ([#1016](https://github.com/compasjs/compas/pull/1016))

##### Breaking changes

- **deps**: bump @types/node from 15.12.5 to 16.0.1
  - Major version bump
- **all**: only support Node.js v16 and higher
  - Bump your local project to use Node.js v16, which should go in to LTS in a
    few months

### [v0.0.150](https://github.com/compasjs/compas/releases/tag/v0.0.150)

##### Changes

- build(deps): bump eslint-plugin-jsdoc from 35.4.0 to 35.4.1
  ([#1006](https://github.com/compasjs/compas/pull/1006))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- chore(create-release): fix changelog parsing
- feat(server): sendFile support If-Modified-Since
  ([#1003](https://github.com/compasjs/compas/pull/1003))
  - Closes [#1002](https://github.com/compasjs/compas/pull/1002)
- feat(store): add must-revalidate to default cacheControlHeader in FileCache
  ([#1004](https://github.com/compasjs/compas/pull/1004))

##### Breaking changes

- **store**: add must-revalidate to default cacheControlHeader in FileCache
  - The default cache-control value has changed from `max-age=1200` to
    `max-age=120, must-revalidate`. Provide your own as the last argument of
    `new FileCache()` if necessary.

### [v0.0.149](https://github.com/compasjs/compas/releases/tag/v0.0.149)

##### Changes

- build(deps): bump @types/node from 15.12.4 to 15.12.5
  ([#998](https://github.com/compasjs/compas/pull/998))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump prettier from 2.3.1 to 2.3.2
  ([#999](https://github.com/compasjs/compas/pull/999))
  - [Release notes](https://github.com/prettier/prettier/releases)
- chore(changelog): improve changelog with breaking change handling
  ([#1000](https://github.com/compasjs/compas/pull/1000))
- feat(store): remove file group view
  ([#1001](https://github.com/compasjs/compas/pull/1001))
  - Closes [#901](https://github.com/compasjs/compas/pull/901)

##### Breaking changes

- **store**: remove file group view
  - Removed usages and code generation of `fileGroupView`. Replace with
    `queryFileGroup` calls.
  - Add the following migration:
  ```sql
  DROP VIEW IF EXISTS "fileGroupView" CASCADE;
  ```

### [v0.0.148](https://github.com/compasjs/compas/releases/tag/v0.0.148)

- build(deps): bump @babel/eslint-parser from 7.14.5 to 7.14.7
  ([#989](https://github.com/compasjs/compas/pull/989))
- build(deps): bump eslint-plugin-jsdoc from 35.3.2 to 35.4.0
  ([#990](https://github.com/compasjs/compas/pull/990))
- feat(cli): support `--parallel-count n` in the test runner
  ([#996](https://github.com/compasjs/compas/pull/996))
- feat(store): createTestPostgresDatabase accepts sql connection options
  ([#995](https://github.com/compasjs/compas/pull/995))
- fix(code-gen): react-query should work for routes without a response
  ([#994](https://github.com/compasjs/compas/pull/994))

### [v0.0.147](https://github.com/compasjs/compas/releases/tag/v0.0.147)

- fix(cli): let newTestEvent use 'newEvent' from stdlib
  ([#988](https://github.com/compasjs/compas/pull/988))

### [v0.0.146](https://github.com/compasjs/compas/releases/tag/v0.0.146)

- build(deps): bump @types/node from 15.12.2 to 15.12.4
  ([#987](https://github.com/compasjs/compas/pull/987))
- build(deps): bump eslint from 7.28.0 to 7.29.0
  ([#986](https://github.com/compasjs/compas/pull/986))
- build(deps): bump eslint-plugin-jsdoc from 35.3.0 to 35.3.2
  ([#985](https://github.com/compasjs/compas/pull/985))
- feat(cli): add code-mod for v0.0.146
  ([#983](https://github.com/compasjs/compas/pull/983))
- feat(code-gen): remove entitySelect generation
  ([#984](https://github.com/compasjs/compas/pull/984))
- feat(stdlib): calculate event duration on abort or eventStop
  ([#982](https://github.com/compasjs/compas/pull/982))
- fix(code-gen): resolve primary key for correct type when adding fields for
  relations ([#980](https://github.com/compasjs/compas/pull/980))
- fix(store): fix return values of `addJobToQueue` and equivalents
  ([#981](https://github.com/compasjs/compas/pull/981))

Breaking change where the generated select sql queries where removed. Use
`yarn compas code-mod exec v0.0.146 --verbose`, before generating, to convert
these to use the query builder.

### [v0.0.145](https://github.com/compasjs/compas/releases/tag/v0.0.145)

- build(deps): bump @babel/core from 7.14.5 to 7.14.6
  ([#969](https://github.com/compasjs/compas/pull/969))
- build(deps): bump c8 from 7.7.2 to 7.7.3
  ([#963](https://github.com/compasjs/compas/pull/963))
- build(deps): bump chokidar from 3.5.1 to 3.5.2
  ([#970](https://github.com/compasjs/compas/pull/970))
- build(deps): bump eslint-plugin-jsdoc from 35.1.3 to 35.3.0
  ([#964](https://github.com/compasjs/compas/pull/964),
  [#971](https://github.com/compasjs/compas/pull/971))
- feat(cli): spawn 'docker pull' when container needs to be created
  ([#967](https://github.com/compasjs/compas/pull/967))
- feat(code-gen): add sql support for `where.relationExists`
  ([#973](https://github.com/compasjs/compas/pull/973))
- fix(code-gen): resolve typescript union on compas reference object
  ([#974](https://github.com/compasjs/compas/pull/974))
- fix(store): require ssl by default for the postgres connection in production
  ([#972](https://github.com/compasjs/compas/pull/972))

Breaking change: by default ssl is required for Postgres connections created in
production.

### [v0.0.144](https://github.com/compasjs/compas/releases/tag/v0.0.144)

- build(deps): bump @babel/core from 7.14.3 to 7.14.5
  ([#955](https://github.com/compasjs/compas/pull/955))
- build(deps): bump @babel/eslint-parser from 7.14.4 to 7.14.5
  ([#956](https://github.com/compasjs/compas/pull/956))
- build(deps): bump hosted-git-info from 2.8.8 to 2.8.9
  ([#953](https://github.com/compasjs/compas/pull/953))
- feat(cli): add hash to visualise output to prevent unnecessary diffs
  ([#952](https://github.com/compasjs/compas/pull/952))
- feat(code-gen): add 'routerClearMemoizedHandlers' to router output
  ([#960](https://github.com/compasjs/compas/pull/960))
- fix(cli): prevent 'caughtException' overwriting by 'enforceSingleAssertion'
  ([#961](https://github.com/compasjs/compas/pull/961))

### [v0.0.143](https://github.com/compasjs/compas/releases/tag/v0.0.143)

- build(deps): bump @types/node from 15.12.1 to 15.12.2
  ([#949](https://github.com/compasjs/compas/pull/949))
- fix(cli): import @babel/parser dynamically

### [v0.0.142](https://github.com/compasjs/compas/releases/tag/v0.0.142)

- chore(cli): rename code-mod v0.0.141 to v0.0.142
- fix(code-gen): make react-query options optional

### [v0.0.141](https://github.com/compasjs/compas/releases/tag/v0.0.141)

- build(deps): bump @types/node from 15.12.0 to 15.12.1
  ([#942](https://github.com/compasjs/compas/pull/942))
- build(deps): bump eslint from 7.27.0 to 7.28.0
  ([#946](https://github.com/compasjs/compas/pull/946))
- build(deps): bump eslint-plugin-jsdoc from 35.1.2 to 35.1.3
  ([#943](https://github.com/compasjs/compas/pull/943))
- build(deps): bump prettier from 2.3.0 to 2.3.1
  ([#944](https://github.com/compasjs/compas/pull/944))
- fix(cli): fix code-mod v00140 and rename to v0.0.141
  ([#947](https://github.com/compasjs/compas/pull/947))

### [v0.0.140](https://github.com/compasjs/compas/releases/tag/v0.0.140)

- build(deps): bump @types/node from 15.6.1 to 15.12.0
  ([#929](https://github.com/compasjs/compas/pull/929),
  [#933](https://github.com/compasjs/compas/pull/933))
- build(deps): bump eslint-plugin-import from 2.23.3 to 2.23.4
  ([#919](https://github.com/compasjs/compas/pull/919))
- build(deps): bump eslint-plugin-jsdoc from 35.0.0 to 35.1.2
  ([#920](https://github.com/compasjs/compas/pull/920),
  [#921](https://github.com/compasjs/compas/pull/921))
- build(deps): bump mime-types from 2.1.30 to 2.1.31
  ([#927](https://github.com/compasjs/compas/pull/927))
- chore(store): remove unused mime-types dependency
  ([#936](https://github.com/compasjs/compas/pull/936))
- feat(cli): add code-mod command, prepare v0.0.140 code-mod
  ([#940](https://github.com/compasjs/compas/pull/940))
- feat(cli): add migrate --keep-alive-without-lock
  ([#937](https://github.com/compasjs/compas/pull/937))
- feat(code-gen): accept an object as argument in generated 'useQuery' hooks
  ([#941](https://github.com/compasjs/compas/pull/941))
- feat(code-gen): throw nice error on optional route parameters
  ([#938](https://github.com/compasjs/compas/pull/938))
- feat(stdlib): always format stack when formatting errors
  ([#939](https://github.com/compasjs/compas/pull/939))
- fix(code-gen): Add additional query generics to support better data inferring
  ([#922](https://github.com/compasjs/compas/pull/922))

Breaking change in the generated react-query hooks, please run the code-mod via
`yarn compas code-mod exec v0.0.140 --verbose` before generating.

### [v0.0.139](https://github.com/compasjs/compas/releases/tag/v0.0.139)

- build(deps): bump @babel/eslint-parser from 7.14.3 to 7.14.4
  ([#915](https://github.com/compasjs/compas/pull/915))
- build(deps): bump @types/node from 15.6.0 to 15.6.1
  ([#909](https://github.com/compasjs/compas/pull/909))
- build(deps): bump browserslist from 4.16.3 to 4.16.6
  ([#910](https://github.com/compasjs/compas/pull/910))
- build(deps): bump eslint-plugin-jsdoc from 34.8.2 to 35.0.0
  ([#908](https://github.com/compasjs/compas/pull/908))
- chore(code-gen): add test for query-builder nested limit
  ([#918](https://github.com/compasjs/compas/pull/918))
- feat(cli): add option to enforce at least one test assertion
  ([#917](https://github.com/compasjs/compas/pull/917))
- feat(cli): support loading connection settings from a relative js file
  ([#914](https://github.com/compasjs/compas/pull/914))
- feat(stdlib): add event root tracking for TimeoutErrors
  ([#916](https://github.com/compasjs/compas/pull/916))

### [v0.0.138](https://github.com/compasjs/compas/releases/tag/v0.0.138)

- build(deps): bump @types/node from 15.3.0 to 15.6.0
  ([#896](https://github.com/compasjs/compas/pull/896),
  [#904](https://github.com/compasjs/compas/pull/904))
- build(deps): bump dotenv from 9.0.2 to 10.0.0
  ([#906](https://github.com/compasjs/compas/pull/906))
- build(deps): bump eslint from 7.26.0 to 7.27.0
  ([#905](https://github.com/compasjs/compas/pull/905))
- build(deps): bump eslint-plugin-import from 2.23.2 to 2.23.3
  ([#907](https://github.com/compasjs/compas/pull/907))
- chore(store): add analyze before pg bench run
- chore(store): fix linting issue
- feat(cli): add migrate command with rebuild support
  ([#898](https://github.com/compasjs/compas/pull/898))
- feat(cli): also print when everything is ok for `help --check`
- feat(code-gen): add mime validator support to T.file()
  ([#903](https://github.com/compasjs/compas/pull/903))
- feat(code-gen): send 400 on param decode errors
  ([#902](https://github.com/compasjs/compas/pull/902))
- perf(code-gen): improve generated query builder performance
  ([#899](https://github.com/compasjs/compas/pull/899))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.138.html).

### [v0.0.137](https://github.com/compasjs/compas/releases/tag/v0.0.137)

- build(deps): bump eslint-plugin-jsdoc from 34.8.1 to 34.8.2
  ([#894](https://github.com/compasjs/compas/pull/894))
- chore(store): add bench for variations of generated query builder
- feat(store): allow specifying app_name in namespaces.txt
  ([#895](https://github.com/compasjs/compas/pull/895))

### [v0.0.136](https://github.com/compasjs/compas/releases/tag/v0.0.136)

- build(deps): bump eslint-plugin-jsdoc from 34.8.0 to 34.8.1
  ([#893](https://github.com/compasjs/compas/pull/893))
- fix(stdlib): revert mainFn only running once check
  ([#892](https://github.com/compasjs/compas/pull/892))

### [v0.0.135](https://github.com/compasjs/compas/releases/tag/v0.0.135)

- build(deps): bump @babel/core from 7.14.0 to 7.14.3
  ([#875](https://github.com/compasjs/compas/pull/875),
  [#882](https://github.com/compasjs/compas/pull/882))
- build(deps): bump @babel/eslint-parser from 7.13.14 to 7.14.3
  ([#876](https://github.com/compasjs/compas/pull/876),
  [#884](https://github.com/compasjs/compas/pull/884))
- build(deps): bump @types/node from 15.0.2 to 15.3.0
  ([#874](https://github.com/compasjs/compas/pull/874),
  [#878](https://github.com/compasjs/compas/pull/878))
- build(deps): bump eslint-plugin-import from 2.22.1 to 2.23.2
  ([#880](https://github.com/compasjs/compas/pull/880))
- build(deps): bump eslint-plugin-jsdoc from 34.0.2 to 34.8.0
  ([#877](https://github.com/compasjs/compas/pull/877),
  [#879](https://github.com/compasjs/compas/pull/879),
  [#883](https://github.com/compasjs/compas/pull/883),
  [#888](https://github.com/compasjs/compas/pull/888))
- feat(cli): add --check, check if .env.local is ignored
  ([#891](https://github.com/compasjs/compas/pull/891))
- feat(code-gen): improve generated router performance
  ([#873](https://github.com/compasjs/compas/pull/873))
- feat(stdlib): load .env.local if exists
  ([#890](https://github.com/compasjs/compas/pull/890))
- fix(code-gen): transformation for idIn and via combination
  ([#889](https://github.com/compasjs/compas/pull/889))

### [v0.0.134](https://github.com/compasjs/compas/releases/tag/v0.0.134)

- build(deps): bump dotenv from 9.0.0 to 9.0.2
  ([#865](https://github.com/compasjs/compas/pull/865),
  [#867](https://github.com/compasjs/compas/pull/867))
- build(deps): bump eslint from 7.25.0 to 7.26.0
  ([#862](https://github.com/compasjs/compas/pull/862))
- build(deps): bump eslint-plugin-jsdoc from 33.1.0 to 34.0.2
  ([#864](https://github.com/compasjs/compas/pull/864),
  [#868](https://github.com/compasjs/compas/pull/868),
  [#870](https://github.com/compasjs/compas/pull/870))
- build(deps): bump prettier from 2.2.1 to 2.3.0
  ([#863](https://github.com/compasjs/compas/pull/863))
- chore: fix changelog formatting
- feat(cli): support running prettier when no files are found
  ([#872](https://github.com/compasjs/compas/pull/872))

### [v0.0.133](https://github.com/compasjs/compas/releases/tag/v0.0.133)

- bench(stdlib): add event benchmarks
  ([#856](https://github.com/compasjs/compas/pull/856))
- build(deps): bump dotenv from 8.4.0 to 9.0.0
  ([#857](https://github.com/compasjs/compas/pull/857))
- build(deps): bump eslint-plugin-jsdoc from 33.0.0 to 33.1.0
  ([#858](https://github.com/compasjs/compas/pull/858))
- build(deps): bump handlebars from 4.7.6 to 4.7.7
  ([#860](https://github.com/compasjs/compas/pull/860))
- chore: move @compas/insight to @compas/stdlib and @compas/server
  ([#855](https://github.com/compasjs/compas/pull/855))
- fix(server): handle body parser errors correctly
  ([#859](https://github.com/compasjs/compas/pull/859))

Breaking change: @compas/insight is removed. The majority of things should be
fixed by running the following command:
`find ./src -type f -name "*.js" -exec sed -i 's/@compas\/insight/@compas\/stdlib/g' {} \; && yarn compas lint`.
Change `./src` from the previous command if you have multiple source directories
(don't use `./` as it will include `node_modules`). Only `postgresTableSizes` is
moved to @compas/store, and should be manually checked. Also removed
`logger.isProduction()` function as it equals `isProduction()` from
@compas/stdlib.

### [v0.0.132](https://github.com/compasjs/compas/releases/tag/v0.0.132)

- bench(store): add benchmarks for the query function
  ([#844](https://github.com/compasjs/compas/pull/844))
- build(deps): bump @babel/core from 7.13.16 to 7.14.0
  ([#843](https://github.com/compasjs/compas/pull/843))
- build(deps): bump @types/node from 14.14.41 to 15.0.2
  ([#835](https://github.com/compasjs/compas/pull/835),
  [#837](https://github.com/compasjs/compas/pull/837),
  [#851](https://github.com/compasjs/compas/pull/851))
- build(deps): bump c8 from 7.7.1 to 7.7.2
  ([#847](https://github.com/compasjs/compas/pull/847))
- build(deps): bump dotenv from 8.2.0 to 8.4.0
  ([#853](https://github.com/compasjs/compas/pull/853))
- build(deps): bump eslint-plugin-jsdoc from 32.3.1 to 33.0.0
  ([#836](https://github.com/compasjs/compas/pull/836),
  [#838](https://github.com/compasjs/compas/pull/838),
  [#842](https://github.com/compasjs/compas/pull/842))
- chore: add codecov badge ([#831](https://github.com/compasjs/compas/pull/831))
- chore: add simple license script to scan transitive licenses used
- chore: exclude generated files from coverage reports
- chore: make codecov informational
  ([#846](https://github.com/compasjs/compas/pull/846))
- chore: use codecov.io for coverage
  ([#830](https://github.com/compasjs/compas/pull/830))
- feat(cli): check if multiple versions of the stdlib are installed
  ([#839](https://github.com/compasjs/compas/pull/839))
- feat(code-gen): support escaped characters in disallowCharacters
  ([#854](https://github.com/compasjs/compas/pull/854))
- fix(cli): improve proxy error messages
  ([#849](https://github.com/compasjs/compas/pull/849))
- fix(server): simplify sendFile range header parsing
  ([#845](https://github.com/compasjs/compas/pull/845))

### [v0.0.131](https://github.com/compasjs/compas/releases/tag/v0.0.131)

- build(deps): bump @babel/core from 7.13.15 to 7.13.16
  ([#819](https://github.com/compasjs/compas/pull/819))
- build(deps): bump eslint from 7.24.0 to 7.25.0
  ([#826](https://github.com/compasjs/compas/pull/826))
- build(deps): bump eslint-config-prettier from 8.2.0 to 8.3.0
  ([#828](https://github.com/compasjs/compas/pull/828))
- build(deps): bump eslint-plugin-jsdoc from 32.3.0 to 32.3.1
  ([#823](https://github.com/compasjs/compas/pull/823))
- chore(ci): test against Node.js 16
- chore: change default nvm version to Node.js 16
- feat(code-gen): add TypeScript definition for 'disallowCharacters'
- feat(code-gen): always export basic queries via an object
  ([#829](https://github.com/compasjs/compas/pull/829))
- feat(code-gen): support T.string().disallowCharacters()
  ([#825](https://github.com/compasjs/compas/pull/825))
- fix(code-gen): improve TypeBuilderLike TypeScript type
- fix(store): update type definitions with new job related functions

### [v0.0.130](https://github.com/compasjs/compas/releases/tag/v0.0.130)

- build(deps): bump @babel/core from 7.13.14 to 7.13.15
  ([#795](https://github.com/compasjs/compas/pull/795))
- build(deps): bump @types/node from 14.14.37 to 14.14.41
  ([#807](https://github.com/compasjs/compas/pull/807),
  [#808](https://github.com/compasjs/compas/pull/808))
- build(deps): bump eslint from 7.23.0 to 7.24.0
  ([#798](https://github.com/compasjs/compas/pull/798))
- build(deps): bump eslint-config-prettier from 8.1.0 to 8.2.0
  ([#802](https://github.com/compasjs/compas/pull/802))
- build(deps): bump postgres from 2.0.0-beta.4 to 2.0.0-beta.5
  ([#799](https://github.com/compasjs/compas/pull/799))
- feat(server): replace koa-body with just co-body
  ([#812](https://github.com/compasjs/compas/pull/812))
- feat(store): support specific job handlers and more timeout options
  ([#816](https://github.com/compasjs/compas/pull/816))
- fix(code-gen): fix sql type resolve call
  ([#814](https://github.com/compasjs/compas/pull/814))
- fix(code-gen): remove stacktraces from anyOf sub errors
  ([#813](https://github.com/compasjs/compas/pull/813))
- fix(store): call eventStart on event passed to handler
  ([#815](https://github.com/compasjs/compas/pull/815))
- fix(store): move 'see' jsdoc tags below the description

The only breaking change is in the `JobQueueWorker` which doesn't have the
`addJob` method. See
[background jobs](https://compasjs.com/features/background-jobs.html) for more
information on the current supported features.

### [v0.0.129](https://github.com/compasjs/compas/releases/tag/v0.0.129)

- chore(ci): another attempt at auto syncing the docs repo
- fix(code-gen): fix setting default value of internal code-gen settings

### [v0.0.128](https://github.com/compasjs/compas/releases/tag/v0.0.128)

- build(deps): bump c8 from 7.7.0 to 7.7.1
  ([#793](https://github.com/compasjs/compas/pull/793))
- chore(ci): fix doc sync after release
- feat(stdlib): add helpers to calculate cookie and cors urls
  ([#792](https://github.com/compasjs/compas/pull/792))
- fix(code-gen): default for internal settings is correct for the type
  definition ([#788](https://github.com/compasjs/compas/pull/788))
- fix(code-gen): validate for signed integer with default number settings
  ([#789](https://github.com/compasjs/compas/pull/789))

### [v0.0.127](https://github.com/compasjs/compas/releases/tag/v0.0.127)

- build(deps): bump @babel/core from 7.13.13 to 7.13.14
  ([#773](https://github.com/compasjs/compas/pull/773))
- build(deps): bump @babel/eslint-parser from 7.13.10 to 7.13.14
  ([#772](https://github.com/compasjs/compas/pull/772))
- build(deps): bump c8 from 7.6.0 to 7.7.0
  ([#775](https://github.com/compasjs/compas/pull/775))
- build(deps): bump koa-session from 6.1.0 to 6.2.0
  ([#774](https://github.com/compasjs/compas/pull/774))
- build(deps): bump mime-types from 2.1.29 to 2.1.30
  ([#784](https://github.com/compasjs/compas/pull/784))
- chore(ci): fix token for docs sync after release
- feat(insight): support error formatting for Github actions
  ([#771](https://github.com/compasjs/compas/pull/771))
- fix(cli): prevent ESLint from throwing errors when no JS files are found
  ([#783](https://github.com/compasjs/compas/pull/783))
- fix(code-gen): use formatData.append for multipart body in the api client
  ([#782](https://github.com/compasjs/compas/pull/782))
- fix(store): add TS type definition for `updateFileGroupOrder`
  ([#781](https://github.com/compasjs/compas/pull/781))

### [v0.0.126](https://github.com/compasjs/compas/releases/tag/v0.0.126)

- build(deps): bump @babel/core from 7.13.10 to 7.13.13
  ([#770](https://github.com/compasjs/compas/pull/770))
- build(deps): bump @types/node from 14.14.35 to 14.14.37
  ([#765](https://github.com/compasjs/compas/pull/765),
  [#769](https://github.com/compasjs/compas/pull/769))
- build(deps): bump eslint from 7.22.0 to 7.23.0
  ([#768](https://github.com/compasjs/compas/pull/768))
- chore(ci): add git push when updating compas docs
- chore(ci): automate docs sync on release
- feat(code-gen): add error handling case when inferring type on function
- feat(code-gen): add internal setting support, utilize it for OpenAPI form data
  conversion ([#767](https://github.com/compasjs/compas/pull/767))

Removed `loadFromOpenAPISpec` in favor of `app.extendWithOpenApi`

### [v0.0.125](https://github.com/compasjs/compas/releases/tag/v0.0.125)

- chore: add changelog for v0.0.124
- feat(code-gen): throw error on duplicate routes
  ([#763](https://github.com/compasjs/compas/pull/763))
- feat(code-gen): throw on inferred array with more than a single element
  ([#764](https://github.com/compasjs/compas/pull/764))
- fix(code-gen): use tsx extension for the `common` react-query file

### [v0.0.124](https://github.com/compasjs/compas/releases/tag/v0.0.124)

- build(deps): bump @types/node from 14.14.31 to 14.14.35
  ([#740](https://github.com/compasjs/compas/pull/740),
  [#743](https://github.com/compasjs/compas/pull/743),
  [#745](https://github.com/compasjs/compas/pull/745),
  [#748](https://github.com/compasjs/compas/pull/748))
- build(deps): bump eslint from 7.21.0 to 7.22.0
  ([#746](https://github.com/compasjs/compas/pull/746))
- build(deps): bump eslint-plugin-jsdoc from 32.2.0 to 32.3.0
  ([#749](https://github.com/compasjs/compas/pull/749))
- chore(ci): use custom token to comment on PR's
- chore: move to fastify/github-action-merge-dependabot@v2.0.0
- feat(code-gen): generate a code splittable api client
  ([#756](https://github.com/compasjs/compas/pull/756))
- feat(code-gen): introduce common, split generator output per 'group'
  ([#758](https://github.com/compasjs/compas/pull/758))
- feat(lint-config): move to @babel/eslint-parser
  ([#747](https://github.com/compasjs/compas/pull/747))
- feat(lint-config): remove no-return-await add require-await
  ([#752](https://github.com/compasjs/compas/pull/752))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.124.html).

### [v0.0.123](https://github.com/compasjs/compas/releases/tag/v0.0.123)

- chore: fix version number in changelog for v0.0.122
- chore: various typos and type fixes
- feat(cli): ignore test runner timeout when detecting open inspector
  ([#736](https://github.com/compasjs/compas/pull/736))
- feat(code-gen): date validators min,max,future and past options
  ([#739](https://github.com/compasjs/compas/pull/739))
- feat(stdlib): drop the vendor uuid implementation
- feat(store): batch objects when copying all files over buckets

### [v0.0.122](https://github.com/compasjs/compas/releases/tag/v0.0.122)

- build(deps): bump eslint from 7.20.0 to 7.21.0
  ([#729](https://github.com/compasjs/compas/pull/729))
- chore,feat(insight,cli,store): move to Node.js 15 & integrate AbortSignal
  ([#733](https://github.com/compasjs/compas/pull/733))
- feat(store): default session maxAge to 30 minutes
- fix(code-gen): sql where notIn should return all results on empty array
  ([#728](https://github.com/compasjs/compas/pull/728))

There are some breaking changes related to events, see the commit message for
[#733](https://github.com/compasjs/compas/pull/733) for more details.

### [v0.0.121](https://github.com/compasjs/compas/releases/tag/v0.0.121)

- fix(code-gen): fix usage of sql 'where in' with an empty array and other where
  field ([#726](https://github.com/compasjs/compas/pull/726))

### [v0.0.120](https://github.com/compasjs/compas/releases/tag/v0.0.120)

- fix(code-gen): allow 'optional' order by for deletedAt column
  ([#725](https://github.com/compasjs/compas/pull/725))

### [v0.0.119](https://github.com/compasjs/compas/releases/tag/v0.0.119)

- build(deps): bump eslint-config-prettier from 8.0.0 to 8.1.0
  ([#724](https://github.com/compasjs/compas/pull/724))
- build(deps): bump eslint-plugin-jsdoc from 32.1.0 to 32.2.0
  ([#715](https://github.com/compasjs/compas/pull/715),
  [#719](https://github.com/compasjs/compas/pull/719))
- feat(code-gen): add sql order by support
  ([#721](https://github.com/compasjs/compas/pull/721))
- feat(store): remove getNestedFileGroup
  ([#723](https://github.com/compasjs/compas/pull/723))
- fix(code-gen): fix empty where xxIn behaviour in the sql generator
  ([#722](https://github.com/compasjs/compas/pull/722))
- fix(code-gen): jsdoc lint compliant output of the api client
  ([#717](https://github.com/compasjs/compas/pull/717))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.119.html).

### [v0.0.118](https://github.com/compasjs/compas/releases/tag/v0.0.118)

- build(deps): bump eslint-config-prettier from 7.2.0 to 8.0.0
  ([#708](https://github.com/compasjs/compas/pull/708))
- chore(ci): improve CI for external contributors
  ([#712](https://github.com/compasjs/compas/pull/712))
- chore(ci): remove test and lint dependency for benchmark and coverage jobs
- feat(cli): support `--jsdoc` flag on `compas lint`
  ([#713](https://github.com/compasjs/compas/pull/713))
- feat(code-gen): expose baseKeys for generated hooks
  ([#709](https://github.com/compasjs/compas/pull/709))
- feat(code-gen): make `queryKey()` generation consistent with `baseKey()`
  ([#714](https://github.com/compasjs/compas/pull/714))
- fix(code-gen): ensure a jsdoc stable output without jsdoc linter
  ([#711](https://github.com/compasjs/compas/pull/711))

Thanks to [@rodymolenaar](https://github.com/rodymolenaar) for the baseKey
generation!

### [v0.0.117](https://github.com/compasjs/compas/releases/tag/v0.0.117)

- build(deps): bump @types/node from 14.14.27 to 14.14.31
  ([#689](https://github.com/compasjs/compas/pull/689),
  [#698](https://github.com/compasjs/compas/pull/698),
  [#705](https://github.com/compasjs/compas/pull/705))
- build(deps): bump c8 from 7.5.0 to 7.6.0
  ([#695](https://github.com/compasjs/compas/pull/695))
- build(deps): bump mime-types from 2.1.28 to 2.1.29
  ([#693](https://github.com/compasjs/compas/pull/693))
- chore(changelog): skip dev-deps updates in the changelog generator
- ci: add benchmarks as a requirement for dependabot auto merge
- docs(cli): expand exported function documentation for the cli
  ([#696](https://github.com/compasjs/compas/pull/696))
- docs(server): expand exported function documentation
- docs(store): expand exported function documentation
- feat(code-gen): expose query key functions for generated hooks
  ([#702](https://github.com/compasjs/compas/pull/702))
- feat(lint-config): add support for JSDoc linting
  ([#707](https://github.com/compasjs/compas/pull/707))
- fix(code-gen): date validator should support special string cases
  ([#706](https://github.com/compasjs/compas/pull/706))
- fix(code-gen): fix missing relation type in sub query builder
  ([#700](https://github.com/compasjs/compas/pull/700))
- fix(stdlib): handle 'undefined' in AppError#format
  ([#701](https://github.com/compasjs/compas/pull/701))

It is expected that react-query generator consumers move to the generated
`queryKey` functions in this release, as the next release may break the query
keys. For JSDoc linting it currenlty is only enabled when the env variable `CI`
is set to `true`, so `CI=true yarn compas lint`. Thanks to
[@tjonger](https://github.com/tjonger) for the query builder fix!

### [v0.0.116](https://github.com/compasjs/compas/releases/tag/v0.0.116)

- build(deps): bump @types/node from 14.14.25 to 14.14.27
  ([#672](https://github.com/compasjs/compas/pull/672),
  [#680](https://github.com/compasjs/compas/pull/680))
- build(deps): bump eslint from 7.19.0 to 7.20.0
  ([#681](https://github.com/compasjs/compas/pull/681))
- build(deps): bump postgres from 2.0.0-beta.3 to 2.0.0-beta.4
  ([#683](https://github.com/compasjs/compas/pull/683))
- build(deps-dev): bump @types/react from 17.0.1 to 17.0.2
  ([#679](https://github.com/compasjs/compas/pull/679))
- build(deps-dev): bump react-query from 3.8.2 to 3.9.4
  ([#671](https://github.com/compasjs/compas/pull/671),
  [#682](https://github.com/compasjs/compas/pull/682),
  [#686](https://github.com/compasjs/compas/pull/686))
- build(deps-dev): bump typescript from 4.1.3 to 4.1.5
  ([#669](https://github.com/compasjs/compas/pull/669),
  [#670](https://github.com/compasjs/compas/pull/670))
- docs(stdlib): expand a bunch of doc blocks on exported functions
- docs: fix order of website synced files
- feat(code-gen): stable query builder join key generation
  ([#684](https://github.com/compasjs/compas/pull/684))
- feat(stdlib): remove pipeline from streamToBuffer
  ([#687](https://github.com/compasjs/compas/pull/687))
- feat(store): add event to queue worker handler
  ([#685](https://github.com/compasjs/compas/pull/685))
- fix(cli): proper exit on test worker failure
  ([#668](https://github.com/compasjs/compas/pull/668))
- fix(cli,store): fix dynamic imports with absolute url on windows
  ([#667](https://github.com/compasjs/compas/pull/667))
- fix(stdlib): force use of Posix path join
  ([#676](https://github.com/compasjs/compas/pull/676))

The only breaking change can be found in
[this issue](https://github.com/compasjs/compas/issues/674).

### [v0.0.115](https://github.com/compasjs/compas/releases/tag/v0.0.115)

- build(deps): bump @types/node from 14.14.22 to 14.14.25
  ([#652](https://github.com/compasjs/compas/pull/652),
  [#658](https://github.com/compasjs/compas/pull/658))
- build(deps-dev): bump @types/react from 17.0.0 to 17.0.1
  ([#650](https://github.com/compasjs/compas/pull/650))
- build(deps-dev): bump fastest-validator from 1.9.0 to 1.10.0
  ([#653](https://github.com/compasjs/compas/pull/653))
- build(deps-dev): bump react-query from 3.6.0 to 3.8.2
  ([#659](https://github.com/compasjs/compas/pull/659),
  [#664](https://github.com/compasjs/compas/pull/664))
- code-gen: add error for unused oneToMany relations
  ([#657](https://github.com/compasjs/compas/pull/657))
- code-gen: support multiple 'viaXxx' in the query builder
  ([#661](https://github.com/compasjs/compas/pull/661))
- docs: consistent JSDoc return usage, add since tag to insight exports
- feat(store): handler timeout for job queue
  ([#663](https://github.com/compasjs/compas/pull/663))
- feat(store): max retry count on job failures
  ([#662](https://github.com/compasjs/compas/pull/662))
- server: catch errors while creating and closing a test app
  ([#656](https://github.com/compasjs/compas/pull/656))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.115.html).

### [v0.0.114](https://github.com/compasjs/compas/releases/tag/v0.0.114)

- build(deps): bump c8 from 7.4.0 to 7.5.0
  ([#641](https://github.com/compasjs/compas/pull/641))
- ci: revert release automation, go back to auto changelog
- code-gen: add file validator support
  ([#649](https://github.com/compasjs/compas/pull/649))
- code-gen: fix field types of update partial for optional fields
  ([#647](https://github.com/compasjs/compas/pull/647))
- code-gen: fix float support in sql structure generator
  ([#646](https://github.com/compasjs/compas/pull/646))
- store: add stringifyQueryPart function
  ([#648](https://github.com/compasjs/compas/pull/648))

### [v0.0.113](https://github.com/compasjs/compas/releases/tag/v0.0.113)

- build(deps): bump eslint from 7.18.0 to 7.19.0
  ([#634](https://github.com/compasjs/compas/pull/634))
- chore: fix lint of workflow files
- ci: auto-merge dependabot PR's
- ci: automate release process
  ([#635](https://github.com/compasjs/compas/pull/635))
- ci: use default merge method for dependabot PR's
- code-gen: detect reference recursion when converting from OpenApi
  ([#640](https://github.com/compasjs/compas/pull/640))
- code-gen: error when JS keywords are used as group names
  ([#638](https://github.com/compasjs/compas/pull/638))
- code-gen: fix names for optional, pick, omit and searchable type
  ([#639](https://github.com/compasjs/compas/pull/639))

### [v0.0.112](https://github.com/compasjs/compas/releases/tag/v0.0.112)

- code-gen: add $raw to generated where clause builder
  ([#633](https://github.com/compasjs/compas/pull/633))
- code-gen: simplify generated select query via query builder
  ([#632](https://github.com/compasjs/compas/pull/632))
- code-gen: throw when generated queryBuilder function is awaited
  ([#631](https://github.com/compasjs/compas/pull/631))

### [v0.0.111](https://github.com/compasjs/compas/releases/tag/v0.0.111)

- build(deps): bump @types/node from 14.14.21 to 14.14.22
  ([#622](https://github.com/compasjs/compas/pull/622))
- build(deps): bump eslint-config-prettier from 7.1.0 to 7.2.0
  ([#621](https://github.com/compasjs/compas/pull/621))
- build(deps): bump postgres from 2.0.0-beta.2 to 2.0.0-beta.3
  ([#623](https://github.com/compasjs/compas/pull/623))
- build(deps-dev): bump react-query from 3.5.15 to 3.6.0
  ([#620](https://github.com/compasjs/compas/pull/620),
  [#627](https://github.com/compasjs/compas/pull/627))
- cli: cleaner test output on failed results
  ([#628](https://github.com/compasjs/compas/pull/628))
- code-gen: generate queries per model in a file
  ([#629](https://github.com/compasjs/compas/pull/629))
- stdlib: add types to process errors
  ([#626](https://github.com/compasjs/compas/pull/626))
- stdlib: use crypto randomUUID if available
  ([#619](https://github.com/compasjs/compas/pull/619))
- store: force call `setStoreQueries`
  ([#630](https://github.com/compasjs/compas/pull/630))

### [v0.0.110](https://github.com/compasjs/compas/releases/tag/v0.0.110)

- build(deps): bump @types/node from 14.14.20 to 14.14.21
  ([#610](https://github.com/compasjs/compas/pull/610))
- build(deps): bump chokidar from 3.5.0 to 3.5.1
  ([#614](https://github.com/compasjs/compas/pull/614))
- build(deps): bump eslint from 7.17.0 to 7.18.0
  ([#613](https://github.com/compasjs/compas/pull/613))
- build(deps-dev): bump react-query from 3.5.12 to 3.5.15
  ([#612](https://github.com/compasjs/compas/pull/612) ,
  [#615](https://github.com/compasjs/compas/pull/615))
- chore: minor comment and type fixes
- chore: update order of changelog and contributing
- code-gen: add possible type results to the query builder functions
  ([#618](https://github.com/compasjs/compas/pull/618))
- code-gen: fix name clash for self referencing tables in the query-builder
  ([#616](https://github.com/compasjs/compas/pull/616))

### [v0.0.109](https://github.com/compasjs/compas/releases/tag/v0.0.109)

- build(deps-dev): bump react-query from 3.5.11 to 3.5.12
  ([#608](https://github.com/compasjs/compas/pull/608))
- chore: fix linting on CI
- chore: various code-gen OpenAPI fixes + bench using Github API spec
  ([#609](https://github.com/compasjs/compas/pull/609))
- cli: harden test runner by waiting till all results are collected from the
  workers
- code-gen: add support for idempotent routes
  ([#607](https://github.com/compasjs/compas/pull/607))
- store: format caught job queue errors
- bench: create benchmark against the Github v3 API
- code-gen: transform named types in the OpenAPI importer
- code-gen: support default and optional path and query params in openAPI
  converter
- code-gen: deep copy validation result on App extend

### [v0.0.108](https://github.com/compasjs/compas/releases/tag/v0.0.108)

- build(deps): bump @types/minio from 7.0.6 to 7.0.7
  ([#596](https://github.com/compasjs/compas/pull/596))
- build(deps): bump @types/node from 14.14.19 to 14.14.20
  ([#584](https://github.com/compasjs/compas/pull/584))
- build(deps): bump chokidar from 3.4.3 to 3.5.0
  ([#594](https://github.com/compasjs/compas/pull/594))
- build(deps): bump koa from 2.13.0 to 2.13.1
  ([#585](https://github.com/compasjs/compas/pull/585))
- build(deps-dev): bump react-query from 3.5.9 to 3.5.11
  ([#592](https://github.com/compasjs/compas/pull/592),
  [#586](https://github.com/compasjs/compas/pull/586))
- chore: fix changelog for v0.0.107
- chore: verify oneToOneReverse sql builder
- cli: add verbose option to proxy
  ([#587](https://github.com/compasjs/compas/pull/587))
- cli: bump dependencies for template
- code-gen: add support for sql ILIKE
  ([#599](https://github.com/compasjs/compas/pull/599))
- code-gen: allow custom shortName and detect duplicate short names
  ([#602](https://github.com/compasjs/compas/pull/602))
- code-gen: fix loading of patterns via OpenAPI spec
  ([#601](https://github.com/compasjs/compas/pull/601))
- code-gen: generated router should work without events on the context
  ([#591](https://github.com/compasjs/compas/pull/591))
- server: add option to logger to disable event creation and logging
  ([#590](https://github.com/compasjs/compas/pull/590))
- store: prioritize priority over scheduled at in JobWorker
  ([#600](https://github.com/compasjs/compas/pull/600))
- store: remove duplicate recurring jobs when recurring job is registered
- store: use different internal function for minio listObjects

### [v0.0.107](https://github.com/compasjs/compas/releases/tag/v0.0.107)

- build(deps): bump @types/node from 14.14.16 to 14.14.19
  ([#577](https://github.com/compasjs/compas/pull/577),
  [#580](https://github.com/compasjs/compas/pull/580))
- build(deps): bump c8 from 7.3.5 to 7.4.0
  ([#578](https://github.com/compasjs/compas/pull/578))
- build(deps): bump eslint from 7.16.0 to 7.17.0
  ([#581](https://github.com/compasjs/compas/pull/581))
- build(deps): bump mime-types from 2.1.27 to 2.1.28
  ([#579](https://github.com/compasjs/compas/pull/579))
- build(deps-dev): bump react-query from 3.5.5 to 3.5.9
  ([#576](https://github.com/compasjs/compas/pull/576),
  [#582](https://github.com/compasjs/compas/pull/582))
- chore: fix changelog script to accomadate for front-matter
- chore: remove all references to docs in this repo
- cli: add parallel test running and order randomizer
  ([#575](https://github.com/compasjs/compas/pull/575))
- cli: add test case for visualise with arguments
- cli: fix watch and restart behaviour of long running processes
  ([#583](https://github.com/compasjs/compas/pull/583))
- docs: move all docs to the docs repo
- insight: logger write pretty in a single call
- stdlib: fix promise printing on unhandledRejections
- store: await connection closes on errors in migrations
- store: fix flaky test postgres connections

### [v0.0.106](https://github.com/compasjs/compas/releases/tag/v0.0.106)

- \*: remove @name usage in JSDoc
- build(deps): bump @types/node from 14.14.14 to 14.14.16
  ([#569](https://github.com/compasjs/compas/pull/569))
- build(deps-dev): bump react-query from 3.4.1 to 3.5.5
  ([#570](https://github.com/compasjs/compas/pull/570))
- code-gen: generate some default type imports for sql and router generator
  ([#571](https://github.com/compasjs/compas/pull/571))
- insight,stdlib: stricter NODE_ENV checks
  ([#572](https://github.com/compasjs/compas/pull/572))
- store: rename isQueryObject to isQueryPart
  ([#573](https://github.com/compasjs/compas/pull/573))

### [v0.0.105](https://github.com/compasjs/compas/releases/tag/v0.0.105)

- build(deps): bump eslint from 7.15.0 to 7.16.0
  ([#557](https://github.com/compasjs/compas/pull/557))
- build(deps): bump eslint-config-prettier from 7.0.0 to 7.1.0
  ([#556](https://github.com/compasjs/compas/pull/556))
- build(deps-dev): bump axios from 0.21.0 to 0.21.1
  ([#561](https://github.com/compasjs/compas/pull/561))
- build(deps-dev): bump react-query from 3.4.0 to 3.4.1
  ([#562](https://github.com/compasjs/compas/pull/562))
- cli: fix usage of code-gen internals in visualise
  ([#563](https://github.com/compasjs/compas/pull/563))
- code-gen: fix duplicate check and hash calculation for validators
  ([#565](https://github.com/compasjs/compas/pull/565))
- code-gen: remove getGroupsThatIncludeType
  ([#564](https://github.com/compasjs/compas/pull/564))

### [v0.0.104](https://github.com/compasjs/compas/releases/tag/v0.0.104)

- build(deps): bump @types/node from 14.14.11 to 14.14.14
  ([#545](https://github.com/compasjs/compas/pull/545),
  [#548](https://github.com/compasjs/compas/pull/548),
  [#552](https://github.com/compasjs/compas/pull/552))
- build(deps): bump ini from 1.3.5 to 1.3.7
  ([#546](https://github.com/compasjs/compas/pull/546))
- build(deps): bump minio from 7.0.17 to 7.0.18
  ([#553](https://github.com/compasjs/compas/pull/553))
- build(deps-dev): bump react-query from 2.26.4 to 3.4.0
  ([#550](https://github.com/compasjs/compas/pull/550),
  [#554](https://github.com/compasjs/compas/pull/554),
  [#555](https://github.com/compasjs/compas/pull/555))
- build(deps-dev): bump typescript from 4.1.2 to 4.1.3
  ([#549](https://github.com/compasjs/compas/pull/549))
- build(deps-dev): bump yup from 0.32.6 to 0.32.8
  ([#544](https://github.com/compasjs/compas/pull/544))
- chore: only run CodeQL checks on main
- code-gen: remove App#new
- code-gen: remove trailing dot from propertyPath when validating query
  arguments ([#543](https://github.com/compasjs/compas/pull/543))
- code-gen: support react-query v3

### [v0.0.103](https://github.com/compasjs/compas/releases/tag/v0.0.103)

- bench: make validator benchmarks more comparable
  ([#536](https://github.com/compasjs/compas/pull/536))
- build(deps): bump @types/node from 14.14.9 to 14.14.11
  ([#541](https://github.com/compasjs/compas/pull/541),
  [#513](https://github.com/compasjs/compas/pull/513))
- build(deps): bump eslint from 7.14.0 to 7.15.0
  ([#531](https://github.com/compasjs/compas/pull/531))
- build(deps): bump eslint-config-prettier from 6.15.0 to 7.0.0
  ([#537](https://github.com/compasjs/compas/pull/537))
- build(deps): bump minio from 7.0.16 to 7.0.17
  ([#512](https://github.com/compasjs/compas/pull/512))
- build(deps): bump prettier from 2.2.0 to 2.2.1
  ([#520](https://github.com/compasjs/compas/pull/520))
- build(deps-dev): bump react-query from 2.26.3 to 2.26.4
  ([#538](https://github.com/compasjs/compas/pull/538))
- build(deps-dev): bump yup from 0.30.0 to 0.32.6
  ([#510](https://github.com/compasjs/compas/pull/510),
  [#528](https://github.com/compasjs/compas/pull/528),
  [#529](https://github.com/compasjs/compas/pull/529),
  [#530](https://github.com/compasjs/compas/pull/530),
  [#539](https://github.com/compasjs/compas/pull/539),
  [#540](https://github.com/compasjs/compas/pull/540))
- chore: bump dependabot config so github picks it up
- chore: checkout CodeQL
- chore: initial release notes for 0.0.103
  ([#527](https://github.com/compasjs/compas/pull/527))
- chore: remove external checks on CI
- chore: rename lbu to compas
- code-gen: add dumpApiStructure and throwingValidators options
  ([#534](https://github.com/compasjs/compas/pull/534))
- code-gen: add support for OR in the sql where partials
  ([#518](https://github.com/compasjs/compas/pull/518))
- code-gen: add support for custom any validators
  ([#517](https://github.com/compasjs/compas/pull/517))
- code-gen: almost always inline 'any' validators
- code-gen: decently stable hash calculation for anonymous validators
  ([#519](https://github.com/compasjs/compas/pull/519))
- code-gen: fix generic type sql transformer
- code-gen: fix property access quoting in sql result transformers
- code-gen: inline basic validators
  ([#521](https://github.com/compasjs/compas/pull/521))
- code-gen: introduce query-builder, drop query-traverser
  ([#511](https://github.com/compasjs/compas/pull/511))
- code-gen: remove validatorSetError
  ([#535](https://github.com/compasjs/compas/pull/535))
- code-gen: simplify object strict validation
- code-gen: validators for sql where and builders
  ([#526](https://github.com/compasjs/compas/pull/526))
- code-gen: various inline validator fixes, inline booleans
- docs: use a Jekyll plugin to generate the sitemap
- lint-config: add no-unsafe-optional-chain rule to lint config
  ([#533](https://github.com/compasjs/compas/pull/533))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.103.html).

### [v0.0.102](https://github.com/compasjs/compas/releases/tag/v0.0.102)

- build(deps): bump @types/node from 14.14.7 to 14.14.9
  ([#493](https://github.com/compasjs/compas/pull/493),
  [#501](https://github.com/compasjs/compas/pull/501))
- build(deps): bump eslint from 7.13.0 to 7.14.0
  ([#504](https://github.com/compasjs/compas/pull/504))
- build(deps): bump prettier from 2.1.2 to 2.2.0
  ([#505](https://github.com/compasjs/compas/pull/505))
- build(deps-dev): bump fastest-validator from 1.8.0 to 1.9.0
  ([#492](https://github.com/compasjs/compas/pull/492))
- build(deps-dev): bump react-query from 2.26.2 to 2.26.3
  ([#503](https://github.com/compasjs/compas/pull/503))
- build(deps-dev): bump typescript from 4.0.5 to 4.1.2
  ([#500](https://github.com/compasjs/compas/pull/500))
- build(deps-dev): bump yup from 0.29.3 to 0.30.0
  ([#499](https://github.com/compasjs/compas/pull/499))
- ci: move to new set-env way
  ([#496](https://github.com/compasjs/compas/pull/496))
- code-gen: deduplicate values passed to anyOf
  ([#506](https://github.com/compasjs/compas/pull/506))
- code-gen: support not defined route responses
  ([#507](https://github.com/compasjs/compas/pull/507))
- lint-config: use meriyah parser in prettier, disable eslint import rules
- stdlib: improve error formatting
  ([#502](https://github.com/compasjs/compas/pull/502))

Overall a few small breaking changes. We format errors with AppError#format in
more places now, which should result in consistent behaviour. Running
`yarn compoas lint` should be 10 - 20 % faster than before, however this also
meant disabling some slow rules related to analyzing imports, namely
`import/named, import/namespace & import/export`.

Not sure what the timeline will be on the next release, because the
[query-builder](https://github.com/compasjs/compas/issues/388) is somewhat more
complex than expected.

### [v0.0.101](https://github.com/compasjs/compas/releases/tag/v0.0.101)

- store: support POSTGRES\_{HOST,USER,PASSWORD,DATABASE}

### [v0.0.100](https://github.com/compasjs/compas/releases/tag/v0.0.100)

- build(deps): bump @types/node from 14.14.6 to 14.14.7
  ([#486](https://github.com/compasjs/compas/pull/486))
- cli: better timeout error message in the test runner
- cli: log response status in proxy
  ([#489](https://github.com/compasjs/compas/pull/489))
- code-gen: better error message when loading from remote.
- code-gen: support setting primary key in generated insert queries
  ([#491](https://github.com/compasjs/compas/pull/491))
- server: expose x-request-id in CORS headers
  ([#490](https://github.com/compasjs/compas/pull/490))

### [v0.0.99](https://github.com/compasjs/compas/releases/tag/v0.0.99)

- build(deps): bump eslint from 7.12.1 to 7.13.0
  ([#485](https://github.com/compasjs/compas/pull/485))
- build(deps-dev): bump react from 16.14.0 to 17.0.1
  ([#478](https://github.com/compasjs/compas/pull/478))
- cli: better error messages when graphviz is not installed
  ([#480](https://github.com/compasjs/compas/pull/480))
- cli: visualise use format and output from cli arguments
  ([#484](https://github.com/compasjs/compas/pull/484))
- code-gen: add raw value support to AnyType
- code-gen: fix deletedAt check with Date in the future
  ([#483](https://github.com/compasjs/compas/pull/483))
- code-gen: micro optimization in array validators

The most notable feature is
`T.any().raw("QueryPart", { typeScript: "import { QueryPart } from '@lbu/store';" })`
support. This allows you to generate correct typings and integrate with native
types provided by the platform or other packages. There should be no breaking
changes.

### [v0.0.98](https://github.com/compasjs/compas/releases/tag/v0.0.98)

- build(deps-dev): bump react-query from 2.25.2 to 2.26.2
  ([#465](https://github.com/compasjs/compas/pull/465),
  [#474](https://github.com/compasjs/compas/pull/474))
- cli: add visualise command, sql only
  ([#472](https://github.com/compasjs/compas/pull/472))
- code-gen: add field checks to partials when on staging
  ([#477](https://github.com/compasjs/compas/pull/477))
- code-gen: various small fixes
  ([#475](https://github.com/compasjs/compas/pull/475))
- store: various migration error handling improvements
  ([#476](https://github.com/compasjs/compas/pull/476))

No release notes, but migration file has changed, so a database reset is
necessary. We also are stricter on input values in the query partials, so expect
tests breaking.

### [v0.0.97](https://github.com/compasjs/compas/releases/tag/v0.0.97)

- code-gen: fix generating ES Modules when it's not needed

### [v0.0.96](https://github.com/compasjs/compas/releases/tag/v0.0.96)

- bench: add yup and fastest-validators to the benchmarks
  ([#463](https://github.com/compasjs/compas/pull/463))
- code-gen: always use string for date in browser environments
- code-gen: only use an extensions in imports in ES Modules
  ([#464](https://github.com/compasjs/compas/pull/464))

### [v0.0.95](https://github.com/compasjs/compas/releases/tag/v0.0.95)

- code-gen: some refactoring for more correct type output

### [v0.0.94](https://github.com/compasjs/compas/releases/tag/v0.0.94)

- code-gen: collect static check errors and pretty print
  ([#457](https://github.com/compasjs/compas/pull/457))
- code-gen: flatten output ([#460](https://github.com/compasjs/compas/pull/460))
- code-gen: sort structure imports and root exports
  ([#459](https://github.com/compasjs/compas/pull/459))
- stdlib: add support for util.inspect.custom to AppError
  ([#458](https://github.com/compasjs/compas/pull/458))

Structure and validators imports and exports have changed. Make sure to fix
these.

### [v0.0.93](https://github.com/compasjs/compas/releases/tag/v0.0.93)

- insight: remove dependency on stdlib

### [v0.0.92](https://github.com/compasjs/compas/releases/tag/v0.0.92)

- build(deps): bump @types/node from 14.14.5 to 14.14.6
  ([#451](https://github.com/compasjs/compas/pull/451))
- code-gen: add more input checks to App.addRelations
- code-gen: fix TS strict for apiClient with file uploads
- code-gen: fix missing response when importing from OpenApi spec
- code-gen: fix recursive types with a suffix
- code-gen: fix whereIn and whereNotIn generation
- code-gen: process data before resolving addRelations
- stdlib: cache environment variables
  ([#454](https://github.com/compasjs/compas/pull/454))

### [v0.0.91](https://github.com/compasjs/compas/releases/tag/v0.0.91)

- code-gen: fix default allowNull on uuid type

### [v0.0.90](https://github.com/compasjs/compas/releases/tag/v0.0.90)

- code-gen: fix tags set on a RouteBuilder
  ([#449](https://github.com/compasjs/compas/pull/449))
- code-gen: short circuit insert queries without values
  ([#448](https://github.com/compasjs/compas/pull/448))
- code-gen: support allow null on various types, loosen schema
  ([#450](https://github.com/compasjs/compas/pull/450))

No release notes today :S

### [v0.0.89](https://github.com/compasjs/compas/releases/tag/v0.0.89)

- build(deps): bump @types/node from 14.14.2 to 14.14.5
  ([#422](https://github.com/compasjs/compas/pull/422),
  [#435](https://github.com/compasjs/compas/pull/435))
- build(deps): bump eslint from 7.12.0 to 7.12.1
  ([#434](https://github.com/compasjs/compas/pull/434))
- build(deps): bump eslint-config-prettier from 6.14.0 to 6.15.0
  ([#441](https://github.com/compasjs/compas/pull/441))
- build(deps-dev): bump typescript from 4.0.3 to 4.0.5
  ([#433](https://github.com/compasjs/compas/pull/433))
- chore: lowercase 'type' in logs
  ([#429](https://github.com/compasjs/compas/pull/429))
- cli: skip restart debounce on 'rs' in watch mode
  ([#440](https://github.com/compasjs/compas/pull/440))
- code-gen: add docs to types
  ([#442](https://github.com/compasjs/compas/pull/442))
- docs: update README.md ([#432](https://github.com/compasjs/compas/pull/432))
- stdlib: use format error on global exception handlers
  ([#443](https://github.com/compasjs/compas/pull/443))
- store: fix typ definition of isQueryPart
- store: floor result of average time to completion
  ([#430](https://github.com/compasjs/compas/pull/430))
- store: queue scheduling and updating of recurring jobs
  ([#431](https://github.com/compasjs/compas/pull/431))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.89.html).

### [v0.0.88](https://github.com/compasjs/compas/releases/tag/v0.0.88)

- build(deps): bump c8 from 7.3.4 to 7.3.5
  ([#418](https://github.com/compasjs/compas/pull/418))
- build(deps): bump eslint from 7.11.0 to 7.12.0
  ([#415](https://github.com/compasjs/compas/pull/415))
- build(deps-dev): bump axios from 0.20.0 to 0.21.0
  ([#414](https://github.com/compasjs/compas/pull/414))
- code-gen: subquery support in 'in' and 'notIn' sql where
  ([#420](https://github.com/compasjs/compas/pull/420))
- code-gen: support Typescript script mode
  ([#416](https://github.com/compasjs/compas/pull/416))
- docs: add information about test and bench to cli.md
- insight: add application name to context
  ([#419](https://github.com/compasjs/compas/pull/419))
- insight: improve performance of ndjson logging
  ([#417](https://github.com/compasjs/compas/pull/417))

### [v0.0.87](https://github.com/compasjs/compas/releases/tag/v0.0.87)

- code-gen: follow references completely when linking up
- code-gen: make sure apiClient types are registered

### [v0.0.86](https://github.com/compasjs/compas/releases/tag/v0.0.86)

- server: add support for keeping a public cookie
  ([#412](https://github.com/compasjs/compas/pull/412))

### [v0.0.85](https://github.com/compasjs/compas/releases/tag/v0.0.85)

- build(deps): bump @types/node from 14.14.0 to 14.14.2
  ([#410](https://github.com/compasjs/compas/pull/410))
- build(deps): bump eslint-config-prettier from 6.13.0 to 6.14.0
  ([#409](https://github.com/compasjs/compas/pull/409))
- build(deps-dev): bump react-query from 2.23.1 to 2.25.2
  ([#411](https://github.com/compasjs/compas/pull/411))
- ci: fix create release workflow
- ci: improve release note formatting
- code-gen: fix api client error handling with streams
  ([#408](https://github.com/compasjs/compas/pull/408))
- code-gen: improve types of generated routes
- code-gen: improve types of sql traversal queries
- code-gen: router rename event before validators
- stdlib: add stream to buffer function
  ([#407](https://github.com/compasjs/compas/pull/407))

### [v0.0.84](https://github.com/compasjs/compas/releases/tag/v0.0.84)

- build(deps): bump @types/node from 14.11.10 to 14.14.0
  ([#405](https://github.com/compasjs/compas/pull/405))
- chore: automatically create a release on new tags
- ci: run tests and benchmarks on Node.js 15
  ([#403](https://github.com/compasjs/compas/pull/403))
- code-gen: do loose structure validation
  ([#398](https://github.com/compasjs/compas/pull/398))
- code-gen: fix structure dump
  ([#396](https://github.com/compasjs/compas/pull/396))
- code-gen: fix where 'in' and 'notIn' generation
- code-gen: implement 'patch' method support
  ([#404](https://github.com/compasjs/compas/pull/404))
- code-gen: support adding relations to 'foreign' structure.
  ([#402](https://github.com/compasjs/compas/pull/402))
- server: skip event logging on OPTIONS requests
  ([#397](https://github.com/compasjs/compas/pull/397))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.84.html).

### [v0.0.83](https://github.com/compasjs/compas/releases/tag/v0.0.83)

- build(deps): bump @types/node from 14.11.8 to 14.11.10
  ([#390](https://github.com/compasjs/compas/pull/390))
- build(deps): bump c8 from 7.3.3 to 7.3.4
  ([#382](https://github.com/compasjs/compas/pull/382))
- build(deps): bump eslint-config-prettier from 6.12.0 to 6.13.0
  ([#389](https://github.com/compasjs/compas/pull/389))
- build(deps-dev): bump react from 16.13.1 to 16.14.0
  ([#381](https://github.com/compasjs/compas/pull/381))
- code-gen: disable some sql generation parts when type is a view
  ([#392](https://github.com/compasjs/compas/pull/392))
- code-gen: refactor types, validator and sql generators
  ([#377](https://github.com/compasjs/compas/pull/377))
- store: add support to explain and analyze any query
  ([#391](https://github.com/compasjs/compas/pull/391))
- store: support nested file groups with custom ordering
  ([#393](https://github.com/compasjs/compas/pull/393))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.83.html).

### [v0.0.82](https://github.com/compasjs/compas/releases/tag/v0.0.82)

- build(deps): bump chokidar from 3.4.2 to 3.4.3
  ([#379](https://github.com/compasjs/compas/pull/379))
- store: add export for 'addRecurringJobToQueue'
  ([#376](https://github.com/compasjs/compas/pull/376))
- store: add tests for recurring job scheduling
  ([#380](https://github.com/compasjs/compas/pull/380))

### [v0.0.81](https://github.com/compasjs/compas/releases/tag/v0.0.81)

- build(deps): bump @types/node from 14.11.4 to 14.11.8
  ([#362](https://github.com/compasjs/compas/pull/362),
  [#368](https://github.com/compasjs/compas/pull/368),
  [#374](https://github.com/compasjs/compas/pull/374))
- build(deps): bump c8 from 7.3.1 to 7.3.3
  ([#369](https://github.com/compasjs/compas/pull/369))
- build(deps): bump eslint from 7.10.0 to 7.11.0
  ([#373](https://github.com/compasjs/compas/pull/373))
- build(deps): bump koa-session from 6.0.0 to 6.1.0
  ([#365](https://github.com/compasjs/compas/pull/365))
- ci: dispatch sha and pr to external e2e test repo
  ([#359](https://github.com/compasjs/compas/pull/359))
- code-gen: add T.searchable and support boolean in where clauses
  ([#371](https://github.com/compasjs/compas/pull/371))
- docs: include contributing.md on Github pages
- store: add meta field on file
  ([#363](https://github.com/compasjs/compas/pull/363))
- store: add support for recurring jobs
  ([#364](https://github.com/compasjs/compas/pull/364))
- store: try multiple ways of resolving a migration namespace import
  ([#361](https://github.com/compasjs/compas/pull/361))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.81.html).

### [v0.0.80](https://github.com/compasjs/compas/releases/tag/v0.0.80)

- build(deps): bump @types/node from 14.11.2 to 14.11.4
  ([#351](https://github.com/compasjs/compas/pull/351))
- code-gen: fix generated query function promise type
  ([#352](https://github.com/compasjs/compas/pull/352))
- insight: add basic event system
  ([#356](https://github.com/compasjs/compas/pull/356))
- insight: add function to get rowCount and diskSize per postgres table
  ([#355](https://github.com/compasjs/compas/pull/355))
- server: implement event from insight on the context
  ([#357](https://github.com/compasjs/compas/pull/357))

### [v0.0.79](https://github.com/compasjs/compas/releases/tag/v0.0.79)

- build(deps): bump postgres from 2.0.0-beta.0 to 2.0.0-beta.2
  ([#332](https://github.com/compasjs/compas/pull/332),
  [#346](https://github.com/compasjs/compas/pull/346))
- build(deps-dev): bump react-query from 2.23.0 to 2.23.1
  ([#349](https://github.com/compasjs/compas/pull/349))
- chore: automatically add link to release notes in the changelog and update
  publish guide
- chore: cleanup dependabot config
- chore: change default branch name to `main`
- cli: warn on usage of parent `t.xx` in sub tests
  ([#348](https://github.com/compasjs/compas/pull/348))
- code-gen: generate cancel token support in browser environments
  ([#347](https://github.com/compasjs/compas/pull/347))
- code-gen: open api importer fixes
  ([#345](https://github.com/compasjs/compas/pull/345))
- code-gen: remove defaultValue from generated where type
  ([#339](https://github.com/compasjs/compas/pull/339))
- code-gen: support `withSoftDeletes` and remove `withHistory`
  ([#334](https://github.com/compasjs/compas/pull/334))
- store: cleanup table names
  ([#350](https://github.com/compasjs/compas/pull/350))
- store: consistent internal query formatting
- store: enable soft deletes for fileStore
  ([#340](https://github.com/compasjs/compas/pull/340))
- store: reset postgres#end timeout in tests
- store: return hash changes from getMigrationsToBeApplied
  ([#341](https://github.com/compasjs/compas/pull/341))

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.79.html).

### [v0.0.78](https://github.com/compasjs/compas/releases/tag/v0.0.78)

- code-gen: fix default value of `docString`
  ([#326](https://github.com/compasjs/compas/pull/326))

### [v0.0.77](https://github.com/compasjs/compas/releases/tag/v0.0.77)

- cli: remove concurrent test support
  ([#324](https://github.com/compasjs/compas/pull/324))
- code-gen: validator default to undefined on empty strings
  ([#325](https://github.com/compasjs/compas/pull/325))

### [v0.0.76](https://github.com/compasjs/compas/releases/tag/v0.0.76)

- build(deps): bump eslint from 7.9.0 to 7.10.0
  ([#313](https://github.com/compasjs/compas/pull/313))
- build(deps): bump eslint-config-prettier from 6.11.0 to 6.12.0
  ([#312](https://github.com/compasjs/compas/pull/312))
- build(deps): bump eslint-plugin-import from 2.22.0 to 2.22.1
  ([#321](https://github.com/compasjs/compas/pull/321))
- cli: allow running tests in concurrently
  ([#322](https://github.com/compasjs/compas/pull/322))
- cli: allow switching between postgres versions
  ([#317](https://github.com/compasjs/compas/pull/317))
- cli: make sure Postgres is ready before returning from `docker up`
  ([#306](https://github.com/compasjs/compas/pull/306))
- code-gen: convert default value always to a string
- code-gen: generate sql where clause for optional values with a default type
  ([#314](https://github.com/compasjs/compas/pull/314))
- code-gen: sql follow references in DDL and where clause
  ([#315](https://github.com/compasjs/compas/pull/315))
- code-gen: support providing default types on a RouteCreator
  ([#318](https://github.com/compasjs/compas/pull/318))
- code-gen: verify path params against params type before generating
  ([#305](https://github.com/compasjs/compas/pull/305))
- docs: consistent urls in config and sitemap
- docs: update env documentation
- docs: update sitemap to use extensions on the urls
- store: remove FileStoreContext out of files
  ([#320](https://github.com/compasjs/compas/pull/320))

### [v0.0.75](https://github.com/compasjs/compas/releases/tag/v0.0.75)

- build(deps): bump @types/node from 14.11.1 to 14.11.2
  ([#299](https://github.com/compasjs/compas/pull/299))
- build(deps): bump c8 from 7.3.0 to 7.3.1
  ([#301](https://github.com/compasjs/compas/pull/301))
- code-gen: apiClient should not call getHeaders in browser environment
  ([#302](https://github.com/compasjs/compas/pull/302))
- docs: move to plain Github pages and Jekyll
  ([#298](https://github.com/compasjs/compas/pull/298))

### [v0.0.74](https://github.com/compasjs/compas/releases/tag/v0.0.74)

- build(deps-dev): bump react-query from 2.22.0 to 2.23.0
  ([#292](https://github.com/compasjs/compas/pull/292))
- build(deps-dev): bump typescript from 4.0.2 to 4.0.3
  ([#293](https://github.com/compasjs/compas/pull/293))
- cli: fix bench callback type
- cli: fix recursive error formatting
- cli: lint exit with error when CI=true
- code-gen: scoped api client generation for browser envs
  ([#294](https://github.com/compasjs/compas/pull/294),
  [#295](https://github.com/compasjs/compas/pull/295))

### [v0.0.73](https://github.com/compasjs/compas/releases/tag/v0.0.73)

- build(deps): bump @types/node from 14.10.2 to 14.11.1
  ([#281](https://github.com/compasjs/compas/pull/281),
  [#287](https://github.com/compasjs/compas/pull/287))
- build(deps-dev): bump react-query from 2.20.0 to 2.22.0
  ([#282](https://github.com/compasjs/compas/pull/282),
  [#288](https://github.com/compasjs/compas/pull/288))
- chore: cleanup fs/promises imports
  ([#289](https://github.com/compasjs/compas/pull/289))
- chore: disable testing.js script, since the generated code is not checked in
- cli: catch and handle assertion errors in tests
  ([#285](https://github.com/compasjs/compas/pull/285))
- code-gen,stdlib: move templates to code-gen
  ([#286](https://github.com/compasjs/compas/pull/286))
- code-gen: apiClient calls returns Promise
- code-gen: apiClient handleError should use response headers and data
- stdlib,cli,server: add and use AppError.format
  ([#284](https://github.com/compasjs/compas/pull/284))

### [v0.0.72](https://github.com/compasjs/compas/releases/tag/v0.0.72)

- build(deps): bump @types/node from 14.10.1 to 14.10.2
  ([#277](https://github.com/compasjs/compas/pull/277))
- build(deps): bump prettier from 2.1.1 to 2.1.2
  ([#278](https://github.com/compasjs/compas/pull/278))
- build(deps-dev): bump react-query from 2.17.0 to 2.20.0
  ([#268](https://github.com/compasjs/compas/pull/268),
  [#275](https://github.com/compasjs/compas/pull/275),
  [#276](https://github.com/compasjs/compas/pull/276),
  [#280](https://github.com/compasjs/compas/pull/280))
- chore: add SECURITY.md ([#271](https://github.com/compasjs/compas/pull/271))
- code-gen: AppError and response validation in apiClient
  ([#274](https://github.com/compasjs/compas/pull/274))
- code-gen: add group and item sorting before generation
  ([#272](https://github.com/compasjs/compas/pull/272))
- code-gen: experiment with using `isBrowser` and `isNode` in the generated file
  type
- code-gen: make tags available in the router
- code-gen: use isNode check in apiClient generator
  ([#273](https://github.com/compasjs/compas/pull/273))
- server: consistent logging of request length

### [v0.0.71](https://github.com/compasjs/compas/releases/tag/v0.0.71)

- build(deps): bump @types/node from 14.6.4 to 14.10.1
  ([#264](https://github.com/compasjs/compas/pull/264),
  [#261](https://github.com/compasjs/compas/pull/261))
- build(deps): bump eslint from 7.8.1 to 7.9.0
  ([#265](https://github.com/compasjs/compas/pull/265))
- build(deps): bump node-fetch from 2.6.0 to 2.6.1
  ([#258](https://github.com/compasjs/compas/pull/258))
- build(deps-dev): bump react-query from 2.15.4 to 2.17.0
  ([#263](https://github.com/compasjs/compas/pull/263),
  [#266](https://github.com/compasjs/compas/pull/266))
- cli: format info property on caught exceptions in bench and test
  ([#257](https://github.com/compasjs/compas/pull/257))
- code-gen: add simple options to App#generate to provide better defaults
  ([#260](https://github.com/compasjs/compas/pull/260))
- code-gen: add validators in App#addRaw and before dumping structure
  ([#259](https://github.com/compasjs/compas/pull/259))
- code-gen: consistent handling of references
- code-gen: consistent usage of 'item' in generators
- code-gen: fix sql generation of nullable foreign key column
  ([#255](https://github.com/compasjs/compas/pull/255))
- code-gen: object validation strict by default
  ([#256](https://github.com/compasjs/compas/pull/256))
- code-gen: remove unnecessary internal nesting on structure
- store: fix sessions with a maxAge of 'session'
  ([#267](https://github.com/compasjs/compas/pull/267))

### [v0.0.70](https://github.com/compasjs/compas/releases/tag/v0.0.70)

- code-gen: fix breaking changes in react-query types
  ([#252](https://github.com/compasjs/compas/pull/252))

### [v0.0.69](https://github.com/compasjs/compas/releases/tag/v0.0.69)

- build(deps-dev): bump react-query from 2.15.1 to 2.15.4
  ([#249](https://github.com/compasjs/compas/pull/249))
- code-gen: add sql properties to generated types
  ([#250](https://github.com/compasjs/compas/pull/250))
- code-gen: remove stub generators
  ([#247](https://github.com/compasjs/compas/pull/247))

### [v0.0.68](https://github.com/compasjs/compas/releases/tag/v0.0.68)

- build(deps): bump @types/node from 14.6.1 to 14.6.4
  ([#229](https://github.com/compasjs/compas/pull/229),
  [#237](https://github.com/compasjs/compas/pull/237))
- build(deps): bump eslint from 7.7.0 to 7.8.1
  ([#224](https://github.com/compasjs/compas/pull/224))
- build(deps-dev): bump react-query from 2.12.1 to 2.15.1
  ([#222](https://github.com/compasjs/compas/pull/222),
  [#225](https://github.com/compasjs/compas/pull/225),
  [#228](https://github.com/compasjs/compas/pull/228),
  [#238](https://github.com/compasjs/compas/pull/238),
  [#241](https://github.com/compasjs/compas/pull/241))
- build(deps-dev): bump typedoc from 0.18.0 to 0.19.0
- chore: add coverage summary to PR's
  ([#243](https://github.com/compasjs/compas/pull/243))
- chore: create script to automate changelog a little bit
- chore: fix PR links in the changelog
- chore: fix linting ([#231](https://github.com/compasjs/compas/pull/231))
- chore: remove typedoc setup
  ([#236](https://github.com/compasjs/compas/pull/236))
- chore: setup CODEOWNERS again
- ci: comment benchmark result to PR
  ([#244](https://github.com/compasjs/compas/pull/244))
- ci: create dependabot config file
  ([#226](https://github.com/compasjs/compas/pull/226))
- cli, stdlib: move bench to cli
  ([#240](https://github.com/compasjs/compas/pull/240))
- cli: add some testing for the provided template
  ([#234](https://github.com/compasjs/compas/pull/234))
- cli: configure timeout of sub tests via `t.timeout`
  ([#232](https://github.com/compasjs/compas/pull/232))
- code-gen: add optional, omit and pick types
  ([#220](https://github.com/compasjs/compas/pull/220))
- code-gen: change default number to be an integer instead of float
  ([#221](https://github.com/compasjs/compas/pull/221))
- code-gen: self host validation for App.extend
  ([#246](https://github.com/compasjs/compas/pull/246))
- docs: regenerate for v0.0.67
- stdlib: improve perf of uuid
  ([#242](https://github.com/compasjs/compas/pull/242))
- stdlib: support custom exec options
  ([#233](https://github.com/compasjs/compas/pull/233))

### [v0.0.67](https://github.com/compasjs/compas/releases/tag/v0.0.67)

- cli: add command to reset current database
  ([#213](https://github.com/compasjs/compas/pull/213))
- cli: run test teardown before printing results
  ([#212](https://github.com/compasjs/compas/pull/212))
- code-gen: follow references when resolving defaults in sql generation
  ([#215](https://github.com/compasjs/compas/pull/215))

### [v0.0.66](https://github.com/compasjs/compas/releases/tag/v0.0.66)

Everything is breaking!

- code-gen: add default min(1) to string type
- code-gen: generated ORDER BY for select queries withDates
- cli: configure test timeout, setup and teardown function in test/config.js
- store: add copyAllObjects to clone a complete bucket
- store: configurable postgres template support

### [v0.0.65](https://github.com/compasjs/compas/releases/tag/v0.0.65)

- cli: increase static test timeout to 15 seconds

### [v0.0.64](https://github.com/compasjs/compas/releases/tag/v0.0.64)

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
  [`TestRunner`](https://compasjs.com/#/api?id=interface-testrunner)

### [v0.0.63](https://github.com/compasjs/compas/releases/tag/v0.0.63)

- code-gen: remove support for both files and body add the same time
- server: remove support for fields in a multipart scenario

##### Breaking

- Use separate routes when both files and body are currently on a single route.

### [v0.0.62](https://github.com/compasjs/compas/releases/tag/v0.0.62)

- cli: use http-proxy directly
- cli: support 'rs' in watch mode, mimicking nodemon
- stdlib: add exitCode to `exec`
- stdlib: rename `code` to `exitCode` in `spawn`
- server,code-gen: fix serialization of nested objects
- code-gen: postgres relation generation fixes

##### Breaking

- The return type of `spawn` and `exec` now have an `exitCode`
- Using a lower level `http-proxy` for `lbu proxy`

### [v0.0.61](https://github.com/compasjs/compas/releases/tag/v0.0.61)

- code-gen: cleanup tags in doc blocks Conditionally render tags if they exists
  in doc blocks for router, apiClient and reactQuery
- server: log key and info if originalError is also AppError

##### Breaking

- code-gen: remove tag middleware
- cli: replace nodemon with chokidar
- server: handle multipart request with formidable (without koa-body)
- code-gen: transform array/objects to Querystrings because of missing support
  in FormData

### [v0.0.60](https://github.com/compasjs/compas/releases/tag/v0.0.60)

- stdlib: remove logger as argument to mainFn
- stdlib: add process exception handling in mainFn
- stdlib: AppError check typeof status and key parameter

##### Breaking

- Remove logger argument from `mainFn`, change to
  `mainFn(import.meta, () => {})`

### [v0.0.59](https://github.com/compasjs/compas/releases/tag/v0.0.59)

- cli: add some logging to proxy errors
- code-gen: fix react-query enabled check

### [v0.0.58](https://github.com/compasjs/compas/releases/tag/v0.0.58)

- code-gen: fix setting headers in form-data upload
- code-gen: add support for file download in the apiClient

### [v0.0.57](https://github.com/compasjs/compas/releases/tag/v0.0.57)

- cli: fix memory leak in proxy
- cli: add some request logging to the proxy
- server: add request content-length to server logs

### [v0.0.56](https://github.com/compasjs/compas/releases/tag/v0.0.56)

- cli: use isProduction and isStaging in template
- cli: add proxy command for local development. Usable via `yarn compoas proxy`
- store: make sure sessionStore checks expired sessions
- server: use isProduction and isStaging in defaults
- server: simplify session handling
- server: fix sendFile compatibility with FileStore and FileCache

### [v0.0.55](https://github.com/compasjs/compas/releases/tag/v0.0.55)

- code-gen: fix reactQuery disabled options
- code-gen: add getGroupsThatIncludeType utility
- store: fix types for FileCache
- stdlib: add isProduction and isStaging helpers
- server: cors allow localhost when `isStaging`
- server: set localhost cookies when server runs on staging

### [v0.0.54](https://github.com/compasjs/compas/releases/tag/v0.0.54)

- code-gen: hotfix apiClient body template error (missing comma)

### [v0.0.53](https://github.com/compasjs/compas/releases/tag/v0.0.53)

- docs: more docs for @lbu/server and @lbu/store
- docs: add sitemap.xml
- deps: bump various dependencies
- code-gen: fix FormData package usage in the apiClient
- code-gen: fix headers send by the apiClient when using FormData
- code-gen: render Date as type string in all cases for frontend generation
- stdlib: improve benchmark performance

### [v0.0.52](https://github.com/compasjs/compas/releases/tag/v0.0.52)

- code-gen: add AppErrorResponse to generated reactQueries.ts
- store: remove auto delete interval from session store
- store: provide clean method on session store
- server: support custom \_domain and \_secure on session cookies
- server: fork koa-compose

##### Breaking

- Run `const store = newSessionStore(); store.clean()` in a user scheduled job.
  The session store does not automatically cleanup old sessions
- `closeTestApp` always returns a Promise

### [v0.0.51](https://github.com/compasjs/compas/releases/tag/v0.0.51)

- code-gen: support generating left join queries for oneToMany relations
- code-gen: fix for Typescript not recognizing interfaces used in JS files

### [v0.0.50](https://github.com/compasjs/compas/releases/tag/v0.0.50)

- code-gen: fix bug on `SelectWith` query identifiers

### [v0.0.49](https://github.com/compasjs/compas/releases/tag/v0.0.49)

- code-gen: fix syntax error in apiClient (introduced in v0.0.48)

### [v0.0.48](https://github.com/compasjs/compas/releases/tag/v0.0.48)

- stdlib: mainFn exit with status(1) when catching errors
- stdlib,cli: add experimental support for benchmarking
- code-gen: support both body and files on a single route
- code-gen: support generating left join queries for manyToOne relations
- code-gen: various small fixes

### [v0.0.47](https://github.com/compasjs/compas/releases/tag/v0.0.47)

- code-gen: small fix for reference sql generation

### [v0.0.46](https://github.com/compasjs/compas/releases/tag/v0.0.46)

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

### [v0.0.45](https://github.com/compasjs/compas/releases/tag/v0.0.45)

- code-gen: hotfix sql template issues for postgres 2.0

  Fixes introduces template bug in 0.0.44

### [v0.0.44](https://github.com/compasjs/compas/releases/tag/v0.0.44)

- BREAKING: code-gen: sql template column and table identifiers to camelCase

  Generated sql templates use camelCase nameschema instead of snake_case now.
  All migrations or queries depended on LBU structure needs to be updated.

### [v0.0.43](https://github.com/compasjs/compas/releases/tag/v0.0.43)

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

### [v0.0.42](https://github.com/compasjs/compas/releases/tag/v0.0.42)

- code-gen: useQuery hook now enabled by default

### [v0.0.41](https://github.com/compasjs/compas/releases/tag/v0.0.41)

- server: fix cors issue, and do some micro optimizations

### [v0.0.40](https://github.com/compasjs/compas/releases/tag/v0.0.40)

- code-gen: generate valid dependant queries for react-query >=2 (#88, #80)

### [v0.0.39](https://github.com/compasjs/compas/releases/tag/v0.0.39)

- code-gen: always quote object keys on mock objects

### [v0.0.38](https://github.com/compasjs/compas/releases/tag/v0.0.38)

- code-gen: validator supports collecting errors instead of throwing
- code-gen: always quote object keys in types generator

### [v0.0.37](https://github.com/compasjs/compas/releases/tag/v0.0.37)

- code-gen: fix generic Typescript type when key is an union type

### [v0.0.36](https://github.com/compasjs/compas/releases/tag/v0.0.36)

- code-gen: fix react-query import in generated file

### [v0.0.35](https://github.com/compasjs/compas/releases/tag/v0.0.35)

- server: add server testing utilities
- code-gen: e2e testing of generated router, validator and apiClient
- cli: remove asyncShould(Not)Throw functions added to tape
- code-gen: generate Postgres upsert queries for all searchable fields

### [v0.0.34](https://github.com/compasjs/compas/releases/tag/v0.0.34)

- code-gen: try an fix for `WHERE IN` generation.

### [v0.0.33](https://github.com/compasjs/compas/releases/tag/v0.0.33)

- code-gen: fix api client generation of interceptors

### [v0.0.32](https://github.com/compasjs/compas/releases/tag/v0.0.32)

- code-gen: various fixes
- code-gen: fixed x-request-id in apiClient
- code-gen: add option to disable mock and validator generator for a type

### [v0.0.31](https://github.com/compasjs/compas/releases/tag/v0.0.31)

- stdlib: resolve camelToSnakeCase issue with long strings

### [v0.0.30](https://github.com/compasjs/compas/releases/tag/v0.0.30)

- docs: add api docs for code-gen and server
- code-gen: various fixes
- deps: various bumps

### [v0.0.29](https://github.com/compasjs/compas/releases/tag/v0.0.29)

- server: add support for CORS_URL env variable
- stdlib: add type definition file
- stdlib: add uuid.isValid function
- code-gen: improve router generated JSDoc

### [v0.0.28](https://github.com/compasjs/compas/releases/tag/v0.0.28)

- code-gen: remove axios dependency in loadFromRemote and accept as argument

### [v0.0.27](https://github.com/compasjs/compas/releases/tag/v0.0.27)

- stdlib: expose pathJoin as alternative for `import { join } from "path";`
- cli: add coverage command, runs tests and collects coverage information
- insight,cli: provide typescript declaration files
- docs: initialize docsify
- docs: add typedoc for generating api information based on declaration files

### [v0.0.26](https://github.com/compasjs/compas/releases/tag/v0.0.26)

- @lbu/code-gen: make sure to deepcopy baseData for type plugins

### [v0.0.25](https://github.com/compasjs/compas/releases/tag/v0.0.25)

- @lbu/code-gen: add react-query generator
- @lbu/lint-config: remove JSDoc plugin
- @lbu/code-gen: make generators stable
- @lbu/cli: update boilerplate add (test-)services code

### [v0.0.24](https://github.com/compasjs/compas/releases/tag/v0.0.24)

- @lbu/code-gen: fix nested reference lookups in sql code-generation

### [v0.0.23](https://github.com/compasjs/compas/releases/tag/v0.0.23)

- @lbu/lint-config: version bumps and disabled jsdoc/require-returns-description
  rule
- @lbu/code-gen: minor fixes to the update queries generation

### [v0.0.22](https://github.com/compasjs/compas/releases/tag/v0.0.22)

- @lbu/code-gen: fix setting column to null in update queries

### [v0.0.21](https://github.com/compasjs/compas/releases/tag/v0.0.21)

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

### [v0.0.20](https://github.com/compasjs/compas/releases/tag/v0.0.20)

- @lbu/code-gen: support OpenAPI conversion
- @lbu/store: add file-cache, uses memory & local disk to speed up retrieving
  items from S3
- \*: various dependency bumps
- @lbu/store: cleaner result on getMigrationsToBeApplied
- @lbu/server: make sendFile compatible with file-cache

### [v0.0.19](https://github.com/compasjs/compas/releases/tag/v0.0.19)

- @lbu/insight: BREAKING, remove 'varargs' support from logger
- @lbu/code-gen: reuse generated validators
- @lbu/code-gen: strip more new lines from output, which results in better
  readability

### [v0.0.18](https://github.com/compasjs/compas/releases/tag/v0.0.18)

- @lbu/stdlib: vendor uuid v4 generation

### [v0.0.17](https://github.com/compasjs/compas/releases/tag/v0.0.17)

- @lbu/cli: various template fixes
- @lbu/\*: various dependency updates
- @lbu/server: add a sendFile utility
- @lbu/stdlib: add camelToSnakecase utility
- @lbu/store: add JobQueue implementation
- @lbu/code-gen: normalize generate & generateStubs
- @lbu/code-gen: add basic sql query generator

### [v0.0.16](https://github.com/compasjs/compas/releases/tag/v0.0.16)

- @lbu/code-gen: minor fixes
- @lbu/cli: add tape as a dependency
- @lbu/store: only truncate tables in testing when there are tables to be
  truncated
- @lbu/stdlib: add noop function

### [v0.0.15](https://github.com/compasjs/compas/releases/tag/v0.0.15)

- @lbu/server,stdlib: move AppError to stdlib
- @lbu/code-gen: small fixes

### [v0.0.14](https://github.com/compasjs/compas/releases/tag/v0.0.14)

- @lbu/store: add session store
- @lbu/server: add session middleware
- @lbu/code-gen: rename \_Optional to \_Input
- @lbu/code-gen: add date type

### [v0.0.13](https://github.com/compasjs/compas/releases/tag/v0.0.13)

- @lbu/code-gen: add dumpStructure option to generateStubs

### [v0.0.12](https://github.com/compasjs/compas/releases/tag/v0.0.12)

- Move project to Github
- @lbu/cli: add docker clean command
- @lbu/code-gen: remove the need to register coreTypes
- @lbu/code-gen: support generating stubs
- @lbu/stdlib: small fixes
- @lbu/store: small fixes for database creation

### [v0.0.11](https://github.com/compasjs/compas/releases/tag/v0.0.11)

- @lbu/store: initial release! Already supports test databases, migrations and a
  persistent file store in combination with minio
- @lbu/server: remove global state from body parsers
- @lbu/code-gen: various bug fixes. The output should be ESLint error free after
  formatting.
- @lbu/cli: update template
- @lbu/cli: improve command executor, now supports passing in flags to Node.js
  as well as to the program it self
- Various test and documentation improvements

### [v0.0.10](https://github.com/compasjs/compas/releases/tag/v0.0.10)

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

### [v0.0.9](https://github.com/compasjs/compas/releases/tag/v0.0.12)

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

### [v0.0.8](https://github.com/compasjs/compas/releases/tag/v0.0.8)

- Various fixes
- @lbu/insight: Simple log processing setup

### [v0.0.7](https://github.com/compasjs/compas/releases/tag/v0.0.7)

- BREAKING: export es modules and drop CommonJS support
- BREAKING: Only supporting >= Node.js 13
- @lbu/code-gen: Big refactor, now with a separate model & mocks generator
- @lbu/cli: Supports yarn scripts in watch mode
- @lbu/insight: A tad faster
- @lbu/lint-config: Support ES modules
- @lbu/server: Refactor error handler, inline cors, improvements to defaults
- @lbu/stdlib: Translation system, utilities for moving from CommonJS to ES
  modules

### [v0.0.6](https://github.com/compasjs/compas/releases/tag/v0.0.6)

- @lbu/code-gen: JSDoc generation and router tags support
- @lbu/\*: Various bugs fixed

### [v0.0.5](https://github.com/compasjs/compas/releases/tag/v0.0.5)

- Rewritten from scratch in plain old JavaScript
- @lbu/cli is now more a script runner than anything else
- @lbu/koa is replaced by @lbu/server
- @lbu/register is removed
- @lbu/lint-config drops Typescript support
- @lbu/stdlib now contains a basic templating functionality
- @lbu/code-gen is refactored, needs some more thinking before adding a fluent
  api back

### [v0.0.4](https://github.com/compasjs/compas/releases/tag/v0.0.4)

- Replaced @lbu/validator with @lbu/code-gen
- @lbu/code-gen supports generating validator functions and routers
- Add @lbu/koa with some minimal middleware

### [v0.0.3](https://github.com/compasjs/compas/releases/tag/v0.0.3)

- @lbu/validator refactor and pretty much stable feature wise
- Various fixes in @lbu/cli and @lbu/stdlib

### [v0.0.2](https://github.com/compasjs/compas/releases/tag/v0.0.2)

- Add @lbu/register
- Add @lbu/cli lint command
- Improve @lbu/cli template

### [v0.0.1](https://github.com/compasjs/compas/releases/tag/v0.0.1)

- Initial release
