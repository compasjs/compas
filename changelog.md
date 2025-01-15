---
editLink: false
---

# Changelog

### [v0.15.8](https://github.com/compasjs/compas/releases/tag/v0.15.8)

#### Bug fixes

- fix(code-gen): select correct response validators in router and api client
  [`f01ab6`](https://github.com/compasjs/compas/commit/f01ab62a1de4986b0ff03f11c871b1cf1080ab6a)

### [v0.15.7](https://github.com/compasjs/compas/releases/tag/v0.15.7)

#### Bug fixes

- fix(code-gen): correctly add ts-nocheck on crud files, use input type for
  `ctx.body` in router generator
  [`6ef73d`](https://github.com/compasjs/compas/commit/6ef73d4e3d03a82ee8b338f94253f7194fa466a9)

#### Other

- chore(sentry): remove deprecated metrics
  [`bfb1a5`](https://github.com/compasjs/compas/commit/bfb1a5c8a0a207d99b2efa250f738412b777c460)

#### Dependency updates

- build(deps): bump the aws-sdk group a bunch of times.
  ([#3469](https://github.com/compasjs/compas/pull/3469),
  [#3488](https://github.com/compasjs/compas/pull/3488),
  [#3504](https://github.com/compasjs/compas/pull/3504),
  [#3523](https://github.com/compasjs/compas/pull/3523))
- build(deps): bump c8 from 10.1.2 to 10.1.3
  ([#3496](https://github.com/compasjs/compas/pull/3496))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump pino from 9.5.0 to 9.6.0
  ([#3516](https://github.com/compasjs/compas/pull/3516))
  - [Release notes](https://github.com/pinojs/pino/releases)

### [v0.15.6](https://github.com/compasjs/compas/releases/tag/v0.15.6)

#### Features

- feat(code-gen): include validators when targetting Node.js with ts-axios
  [`5c9f89`](https://github.com/compasjs/compas/commit/5c9f89101bb7950795b39da1cef23481f15c6355)

#### Bug fixes

- fix(stdlib): type input of AppError#cause as unknown
  [`8ed577`](https://github.com/compasjs/compas/commit/8ed57783289cc08289aaa890088184df3a2656a6)

#### Dependency updates

- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3462](https://github.com/compasjs/compas/pull/3462))
  [`b649df`](https://github.com/compasjs/compas/commit/b649df6c62cfeba76fc56f97114d193f68531bf9)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.696.0 to 3.697.0
  ([#3465](https://github.com/compasjs/compas/pull/3465))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.696.0 to 3.697.0
  ([#3465](https://github.com/compasjs/compas/pull/3465))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.15.5](https://github.com/compasjs/compas/releases/tag/v0.15.5)

#### Bug fixes

- fix(code-gen): various type issues in the TS postgres generator
  [`de3d2f`](https://github.com/compasjs/compas/commit/de3d2f3f856afacdd1d7069c514a0f2315803435)
- fix(code-gen): more fixes for backend TypeScript targets
  [`2a45b2`](https://github.com/compasjs/compas/commit/2a45b24dc7fe4964116f0c71b8f1cf520b7a14c7)

#### Dependency updates

- build(deps): bump @aws-sdk/client-s3 from 3.689.0 to 3.691.0
  ([#3456](https://github.com/compasjs/compas/pull/3456))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.689.0 to 3.691.0
  ([#3456](https://github.com/compasjs/compas/pull/3456))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.15.4](https://github.com/compasjs/compas/releases/tag/v0.15.4)

#### Other

- chore(\*): remove extra nesting in package.json#exports field
  [`96e238`](https://github.com/compasjs/compas/commit/96e238276bd6087b332f110408fcf9c9098ce589)

#### Dependency updates

- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3453](https://github.com/compasjs/compas/pull/3453))
  [`de9308`](https://github.com/compasjs/compas/commit/de93089b610f7ca65946adbd1ac756ba81c7afd9)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.688.0 to 3.689.0
  ([#3454](https://github.com/compasjs/compas/pull/3454))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.688.0 to 3.689.0
  ([#3454](https://github.com/compasjs/compas/pull/3454))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.15.3](https://github.com/compasjs/compas/releases/tag/v0.15.3)

#### Features

- feat(code-gen,store): dynamically resolve query builder results based on the
  passed in builder
  [`f0f730`](https://github.com/compasjs/compas/commit/f0f73046cd263f4a486e991487552e376a70945e)

#### Dependency updates

- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3432](https://github.com/compasjs/compas/pull/3432),
  [#3443](https://github.com/compasjs/compas/pull/3443))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump file-type from 19.5.0 to 19.6.0
  ([#3416](https://github.com/compasjs/compas/pull/3416))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump postgres from 3.4.4 to 3.4.5
  ([#3434](https://github.com/compasjs/compas/pull/3434))
  - [Release notes](https://github.com/porsager/postgres/releases)

### [v0.15.2](https://github.com/compasjs/compas/releases/tag/v0.15.2)

#### Features

- feat(cli): optional `t` argument for `newTestEvent`
  [`129de8`](https://github.com/compasjs/compas/commit/129de8e9e7a51681c836455db7c311ab71799b9d)

#### Bug fixes

- fix(code-gen): add trailing comma in multi-line imports
  [`e7fb6a`](https://github.com/compasjs/compas/commit/e7fb6a67d2dd7a4001dfe4448d6c724c9d396dc6)

#### Dependency updates

- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3415](https://github.com/compasjs/compas/pull/3415),
  [#3422](https://github.com/compasjs/compas/pull/3422),
  [#3429](https://github.com/compasjs/compas/pull/3429))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump pino from 9.4.0 to 9.5.0
  ([#3417](https://github.com/compasjs/compas/pull/3417))
  - [Release notes](https://github.com/pinojs/pino/releases)

### [v0.15.1](https://github.com/compasjs/compas/releases/tag/v0.15.1)

#### Bug fixes

- fix(code-gen): fix regression
  [`138b43`](https://github.com/compasjs/compas/commit/138b431f966b62cdc2e7afa0ecd744256d8ca428)
- fix(server): handle change on body parser
  [`817e84`](https://github.com/compasjs/compas/commit/817e84fee4a3cd5ce39bb084414f4d788a161bf0)

### [v0.15.0](https://github.com/compasjs/compas/releases/tag/v0.15.0)

#### Breaking changes

- chore(eslint-plugin): drop package
  [`17d132`](https://github.com/compasjs/compas/commit/17d132ed7806900188d2bc80caf9b1ff8a5ccc93)
  - Use `@lightbase/eslint-config` instead. It is almost fully compatible, but
    requires some migration. Please follow the
    [migration guide](https://github.com/lightbasenl/platforms/blob/main/packages/eslint-config/MIGRATION_GUIDE.md).

#### Features

- feat(code-gen): support TypeScript target for router and database generators
  [`c1739c`](https://github.com/compasjs/compas/commit/c1739c19f5f008a12b33a9c97f95b0df5fdecde5)

#### Other

- chore: replace ESLint setup
  [`591faa`](https://github.com/compasjs/compas/commit/591faa4007ef84bc9d8fde7270a2b3c5f506f498)

#### Dependency updates

- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3369](https://github.com/compasjs/compas/pull/3369))
  [`51860b`](https://github.com/compasjs/compas/commit/51860b319cc64e331587dd4604966e58445a7f26)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3376](https://github.com/compasjs/compas/pull/3376))
  [`ea8d44`](https://github.com/compasjs/compas/commit/ea8d44621fe2f3a10e040de8b1aad73c171e83a2)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3387](https://github.com/compasjs/compas/pull/3387))
  [`537143`](https://github.com/compasjs/compas/commit/537143e4657b2177bb9deb80e521576dbabaca58)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.654.0 to 3.667.0
  ([#3380](https://github.com/compasjs/compas/pull/3380),
  [#3393](https://github.com/compasjs/compas/pull/3393),
  [#3396](https://github.com/compasjs/compas/pull/3396),
  [#3399](https://github.com/compasjs/compas/pull/3399),
  [#3401](https://github.com/compasjs/compas/pull/3401),
  [#3402](https://github.com/compasjs/compas/pull/3402),
  [#3405](https://github.com/compasjs/compas/pull/3405))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.654.0 to 3.667.0
  ([#3380](https://github.com/compasjs/compas/pull/3380),
  [#3393](https://github.com/compasjs/compas/pull/3393),
  [#3396](https://github.com/compasjs/compas/pull/3396),
  [#3399](https://github.com/compasjs/compas/pull/3399),
  [#3401](https://github.com/compasjs/compas/pull/3401),
  [#3402](https://github.com/compasjs/compas/pull/3402),
  [#3405](https://github.com/compasjs/compas/pull/3405))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.14.1](https://github.com/compasjs/compas/releases/tag/v0.14.1)

#### Bug fixes

- fix(code-gen): convert numbers to string in functions using FormData
  ([#3350](https://github.com/compasjs/compas/pull/3350))
  [`047cc5`](https://github.com/compasjs/compas/commit/047cc5aa13f3c8c4508007306cc843ff9a5f5481)

#### Other

- chore(cli,stdlib): fix flaky tests
  [`1a9bde`](https://github.com/compasjs/compas/commit/1a9bde4d853aa8230abaf27e79f12de76c16030b)

#### Dependency updates

- build(deps): bump pino from 9.3.2 to 9.4.0
  ([#3353](https://github.com/compasjs/compas/pull/3353))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump sharp from 0.33.4 to 0.33.5
  ([#3329](https://github.com/compasjs/compas/pull/3329))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump eslint-plugin-import from 2.29.1 to 2.30.0
  ([#3352](https://github.com/compasjs/compas/pull/3352))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.637.0 to 3.649.0
  ([#3356](https://github.com/compasjs/compas/pull/3356),
  [#3364](https://github.com/compasjs/compas/pull/3364))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.637.0 to 3.649.0
  ([#3356](https://github.com/compasjs/compas/pull/3356),
  [#3364](https://github.com/compasjs/compas/pull/3364))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump file-type from 19.4.1 to 19.5.0
  ([#3359](https://github.com/compasjs/compas/pull/3359))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)

### [v0.14.0](https://github.com/compasjs/compas/releases/tag/v0.14.0)

#### Breaking changes

- chore(stdlib,store,server): remove Sentry v7 compatibility
  [`381cfa`](https://github.com/compasjs/compas/commit/381cfab1ed2b79f618cf26a5a926a1b79d68918e)
  - Compas now only works with Sentry v8+

### [v0.13.1](https://github.com/compasjs/compas/releases/tag/v0.13.1)

#### Bug fixes

- fix(stdlib,server): correct Sentry sampled checks and dropping of trace events
  [`f70085`](https://github.com/compasjs/compas/commit/f7008555aa619f4bf950ead558e50fd014134da2)

#### Dependency updates

- build(deps): bump file-type from 19.3.0 to 19.4.1
  ([#3337](https://github.com/compasjs/compas/pull/3337))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.635.0 to 3.637.0
  ([#3336](https://github.com/compasjs/compas/pull/3336))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.635.0 to 3.637.0
  ([#3336](https://github.com/compasjs/compas/pull/3336))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.13.0](https://github.com/compasjs/compas/releases/tag/v0.13.0)

#### Features

- feat(code-gen): always expose the Compas structure in OpenAPI format
  [`18cc26`](https://github.com/compasjs/compas/commit/18cc26f4dd053a7c375b84f7e44f296eaa88c21f)
- feat(store): add option to 'jobSessionStoreCleanup' to revoke sessions after N
  days
  [`21a3f8`](https://github.com/compasjs/compas/commit/21a3f86c8711b944f2b0903c5b5a385b90aed960)

#### Other

- chore(release): don't try to commit package-lock.json
  [`d31756`](https://github.com/compasjs/compas/commit/d31756ac4dfb43ddc3ea9d03ffc2c051df1e4b06)
- chore: fix type issues
  [`c71a6b`](https://github.com/compasjs/compas/commit/c71a6b0a998aa38a02727a503265693dbcd9aab9)

#### Dependency updates

- build(deps): bump the aws-sdk group across 1 directory with 2 updates
  ([#3330](https://github.com/compasjs/compas/pull/3330))
  [`468dac`](https://github.com/compasjs/compas/commit/468dac5940cff24ebbcd07639064556057393254)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump tar from 6.2.1 to 7.4.3
  ([#3274](https://github.com/compasjs/compas/pull/3274))
  - Major version bump
  - [Release notes](https://github.com/isaacs/node-tar/releases)

### [v0.12.4](https://github.com/compasjs/compas/releases/tag/v0.12.4)

#### Other

- chore(changelog): clarify v0.12.0 release notes
  [`bdab74`](https://github.com/compasjs/compas/commit/bdab74d5a5b29df089087c171ae48bf14c908eb0)
- chore: remove lockfile + prevent creation
  [`6075e3`](https://github.com/compasjs/compas/commit/6075e338a834e1b8e3850fbd7a01059b962214b8)
- chore(store): call `eventStop` in `queueWorker` if application didn't
  [`14b9b3`](https://github.com/compasjs/compas/commit/14b9b35683ebc0dd2debec0b79f74f97f5e4eeb4)

#### Dependency updates

- build(deps): bump sharp from 0.33.3 to 0.33.4
  ([#3247](https://github.com/compasjs/compas/pull/3247))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump @babel/eslint-parser from 7.24.1 to 7.25.1
  ([#3249](https://github.com/compasjs/compas/pull/3249),
  [#3285](https://github.com/compasjs/compas/pull/3285))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump recast from 0.23.6 to 0.23.9
  ([#3253](https://github.com/compasjs/compas/pull/3253))
  - [Release notes](https://github.com/benjamn/recast/releases)
- build(deps): bump file-type from 19.0.0 to 19.3.0
  ([#3265](https://github.com/compasjs/compas/pull/3265))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump pino from 9.2.0 to 9.3.2
  ([#3272](https://github.com/compasjs/compas/pull/3272))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump prettier from 3.3.2 to 3.3.3
  ([#3256](https://github.com/compasjs/compas/pull/3256))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump @babel/core from 7.24.7 to 7.25.2
  ([#3285](https://github.com/compasjs/compas/pull/3285))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.554.0 to 3.620.1
  ([#3284](https://github.com/compasjs/compas/pull/3284))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.554.0 to 3.620.1
  ([#3284](https://github.com/compasjs/compas/pull/3284))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.12.3](https://github.com/compasjs/compas/releases/tag/v0.12.3)

#### Bug fixes

- fix(sentry): use local identity functions when `startNewTrace` is not
  available
  [`28e89d`](https://github.com/compasjs/compas/commit/28e89ddbca9ed23f6bd0ab85a81915eeb22b8618)

### [v0.12.2](https://github.com/compasjs/compas/releases/tag/v0.12.2)

#### Features

- feat(stdlib,store,server): Sentry v7 & v8 compat
  [`738283`](https://github.com/compasjs/compas/commit/7382836934485aafb58875d468ef0faba0d36395)

### [v0.12.1](https://github.com/compasjs/compas/releases/tag/v0.12.1)

#### Features

- feat(stdlib,queue): explicit wrap Sentry in new traces
  [`3ff39e`](https://github.com/compasjs/compas/commit/3ff39e4516762da99e1a4599a087704ba77e66fc)

### [v0.12.0](https://github.com/compasjs/compas/releases/tag/v0.12.0)

#### Notable changes

- feat(stdlib): support Sentry v8
  [`8891d3`](https://github.com/compasjs/compas/commit/8891d38d76fdb7c5043241d6fef1b0a8eaf0f20b)
  - Compatible with both Sentry v7 & v8.
  - Note that Sentry v8 uses Node.js Module Loader hooks, which doesn't support
    primitive live bindings and thus might break your application. Watch
    https://github.com/getsentry/sentry-javascript/issues/12806 for updates.
  - For v8, the following options can be removed from the `Sentry.init` call:
    - Removes the need for `_experiments.metricsAggregator`
    - Removes the need for calling
      `Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()`.
    - Removes the need for explicitly setting `captureErrorCause: true`.

#### Features

- feat(cli): widen range of supported Postgres versions
  [`4cd0b7`](https://github.com/compasjs/compas/commit/4cd0b7719eb3c3013cb77f50136035b658f6f52d)
- feat(cli): prefer 'lint' and 'lint:ci' scripts from `package.json` when
  running 'compas lint'
  [`127d73`](https://github.com/compasjs/compas/commit/127d73b2cef7dd9bd3373e11bf8e70e7b81225db)

#### Bug fixes

- fix(server): collapse sentry metrics for OPTIONS and HEAD requests
  [`5167f1`](https://github.com/compasjs/compas/commit/5167f112553f948b5d6b8cd9b3df883789a7de64)

#### Other

- chore(dependabot): drop grouped updates
  [`928b6d`](https://github.com/compasjs/compas/commit/928b6d5a53463b543fd682c26fc707659e9809ec)
- chore(ci): simplify CI
  [`4a24ee`](https://github.com/compasjs/compas/commit/4a24ee83bc39f6a5bed2da77e8c488ba4d52ce73)

#### Dependency updates

- build(deps): bump braces from 3.0.2 to 3.0.3 in the npm_and_yarn group
  ([#3212](https://github.com/compasjs/compas/pull/3212))
  [`d2fda5`](https://github.com/compasjs/compas/commit/d2fda56a85614e8b08316b1da9141f78c680c8ad)
- build(deps): bump pino from 8.20.0 to 9.2.0
  ([#3234](https://github.com/compasjs/compas/pull/3234))
  - Major version bump
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump c8 from 9.1.0 to 10.1.2
  ([#3229](https://github.com/compasjs/compas/pull/3229))
  - Major version bump
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump co-body from 6.1.0 to 6.2.0
  ([#3231](https://github.com/compasjs/compas/pull/3231))
- build(deps): bump prettier from 3.2.5 to 3.3.2
  ([#3228](https://github.com/compasjs/compas/pull/3228))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump eslint-plugin-jsdoc from 48.2.3 to 48.7.0
  ([#3244](https://github.com/compasjs/compas/pull/3244))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @babel/core from 7.24.4 to 7.24.7
  ([#3237](https://github.com/compasjs/compas/pull/3237))
  - [Release notes](https://github.com/babel/babel/releases)

### [v0.11.2](https://github.com/compasjs/compas/releases/tag/v0.11.2)

#### Features

- feat(server,store): keep track of Sentry metrics about which routes and jobs
  are run
  [`ca1a0a`](https://github.com/compasjs/compas/commit/ca1a0a82e54d5ef50231d2eed4f717b41fcef89a)

### [v0.11.1](https://github.com/compasjs/compas/releases/tag/v0.11.1)

#### Features

- feat(server): force a new Sentry trace id for each request
  [`6ca680`](https://github.com/compasjs/compas/commit/6ca6806aaf7da68ea9ff3c132f29424b78370901)
- feat(store): force a new Sentry trace id for job
  [`f4de6a`](https://github.com/compasjs/compas/commit/f4de6a09db5a9a56ac05b12e0bf172c3ed20d200)

#### Bug fixes

- fix(stdlib): enable event_span logging, even if sentry is used
  [`dfc0da`](https://github.com/compasjs/compas/commit/dfc0daa1c005b7c517768d5a5c7190bec40f1927)

### [v0.11.0](https://github.com/compasjs/compas/releases/tag/v0.11.0)

#### Breaking changes

- feat(eslint-plugin): stricter checks on missing `eventStart` calls
  [`491561`](https://github.com/compasjs/compas/commit/491561c10ccc52ba32df2cd740fc7594a4b268ea)
  - Correctness checks; if `event` is passed into an async function, you most
    certainly want to call `eventStart`.

#### Features

- feat(stdlib): make AppError compatible with Sentry
  [`056d40`](https://github.com/compasjs/compas/commit/056d4025662e09754df25ec0212051b114c1d579)

#### Bug fixes

- fix(cli): make sure to load .cjs and .mjs test files
  [`ed546c`](https://github.com/compasjs/compas/commit/ed546c56ec26a2e958e20a138738ab9dd1775044)

### [v0.10.6](https://github.com/compasjs/compas/releases/tag/v0.10.6)

#### Features

- feat(stdlib): only add logs as breadcrumbs if a span is active
  [`d1a897`](https://github.com/compasjs/compas/commit/d1a897608b4a0b7baf4f0961cd91cc2f7fda4543)
- feat(cli): hard error the test runner if we don't have a test config and no
  package.json in the cwd
  [`fb1166`](https://github.com/compasjs/compas/commit/fb1166e70a39188ea883f60fb12cddf4466fb9f9)

#### Other

- chore(stdlib): fix TS issues
  [`ce2f67`](https://github.com/compasjs/compas/commit/ce2f67e9c7d6894293a84c97a0a91b34a463e1a4)

### [v0.10.5](https://github.com/compasjs/compas/releases/tag/v0.10.5)

#### Features

- feat(server): skip sentry span creation for head and options requests
  [`31eb5b`](https://github.com/compasjs/compas/commit/31eb5b9a3f5e68a076624eacb3abf755084ce57f)
- feat(store): only start Sentry span for queries if a parent span exists
  [`d5d842`](https://github.com/compasjs/compas/commit/d5d8428300cae829d01b349037d4e704e07dbf09)

### [v0.10.4](https://github.com/compasjs/compas/releases/tag/v0.10.4)

#### Bug fixes

- fix(stdlib): make sure to flush Sentry before exit
  [`579c04`](https://github.com/compasjs/compas/commit/579c044bd304a110cfee04604b579c8a4bc8d04c)
- fix(server): sent http method as sentry attribute
  [`42fdeb`](https://github.com/compasjs/compas/commit/42fdebd8d77e8489ceb24d241b03aa08877b6634)

### [v0.10.3](https://github.com/compasjs/compas/releases/tag/v0.10.3)

#### Bug fixes

- fix(store): import `_compasSentryEnableQuerySpans`
  [`eae66a`](https://github.com/compasjs/compas/commit/eae66a0d62db04baf7e638295ce158c8fbee76ef)

### [v0.10.2](https://github.com/compasjs/compas/releases/tag/v0.10.2)

#### Features

- feat(server): use conventional 'op', force transaction, provide more data to
  Sentry
  [`cc9203`](https://github.com/compasjs/compas/commit/cc9203efab450437d1854423e7419bc755ee9baf)
- feat(stdlib,store): use conventional 'op', force transaction, support queries
  as spans
  [`432c51`](https://github.com/compasjs/compas/commit/432c5192ad4da53fc337f8201482179ed9ba4983)

### [v0.10.1](https://github.com/compasjs/compas/releases/tag/v0.10.1)

#### Features

- feat(stdlib): add Sentry support
  [`a8a4ef`](https://github.com/compasjs/compas/commit/a8a4ef2d47da2484faa49519be8f2b34e3e29c4f)
- feat(store): add Sentry support to the queue
  [`b8041f`](https://github.com/compasjs/compas/commit/b8041feb018aa29459ba146a4011c5bb6ee8c3b3)
- feat(server): add Sentry support to the Koa instance returned by `getApp`
  [`db1ea9`](https://github.com/compasjs/compas/commit/db1ea9fab69fab40248ba417fa79ecf491f8f002)

See the
[inline docs](https://github.com/compasjs/compas/blob/main/packages/stdlib/src/sentry.js)
for more information.

#### Dependency updates

- build(deps): bump prettier from 3.1.1 to 3.2.5
  ([#3047](https://github.com/compasjs/compas/pull/3047),
  [#3064](https://github.com/compasjs/compas/pull/3064))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump c8 from 9.0.0 to 9.1.0
  ([#3047](https://github.com/compasjs/compas/pull/3047))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump dotenv from 16.3.1 to 16.4.5
  ([#3047](https://github.com/compasjs/compas/pull/3047),
  [#3064](https://github.com/compasjs/compas/pull/3064),
  [#3079](https://github.com/compasjs/compas/pull/3079),
  [#3089](https://github.com/compasjs/compas/pull/3089))
- build(deps): bump @aws-sdk/client-s3 from 3.489.0 to 3.554.0
  ([#3047](https://github.com/compasjs/compas/pull/3047),
  [#3064](https://github.com/compasjs/compas/pull/3064),
  [#3079](https://github.com/compasjs/compas/pull/3079),
  [#3085](https://github.com/compasjs/compas/pull/3085),
  [#3104](https://github.com/compasjs/compas/pull/3104),
  [#3139](https://github.com/compasjs/compas/pull/3139),
  [#3150](https://github.com/compasjs/compas/pull/3150))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.489.0 to 3.554.0
  ([#3047](https://github.com/compasjs/compas/pull/3047),
  [#3064](https://github.com/compasjs/compas/pull/3064),
  [#3079](https://github.com/compasjs/compas/pull/3079),
  [#3085](https://github.com/compasjs/compas/pull/3085),
  [#3104](https://github.com/compasjs/compas/pull/3104),
  [#3139](https://github.com/compasjs/compas/pull/3139),
  [#3150](https://github.com/compasjs/compas/pull/3150))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump sharp from 0.33.1 to 0.33.3
  ([#3047](https://github.com/compasjs/compas/pull/3047),
  [#3139](https://github.com/compasjs/compas/pull/3139))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump @babel/core from 7.23.7 to 7.24.4
  ([#3064](https://github.com/compasjs/compas/pull/3064),
  [#3104](https://github.com/compasjs/compas/pull/3104),
  [#3139](https://github.com/compasjs/compas/pull/3139))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.23.3 to 7.24.1
  ([#3064](https://github.com/compasjs/compas/pull/3064),
  [#3139](https://github.com/compasjs/compas/pull/3139))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint-plugin-jsdoc from 48.0.2 to 48.2.3
  ([#3064](https://github.com/compasjs/compas/pull/3064),
  [#3079](https://github.com/compasjs/compas/pull/3079),
  [#3085](https://github.com/compasjs/compas/pull/3085),
  [#3089](https://github.com/compasjs/compas/pull/3089),
  [#3104](https://github.com/compasjs/compas/pull/3104),
  [#3139](https://github.com/compasjs/compas/pull/3139))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump pino from 8.17.2 to 8.20.0
  ([#3064](https://github.com/compasjs/compas/pull/3064),
  [#3085](https://github.com/compasjs/compas/pull/3085),
  [#3150](https://github.com/compasjs/compas/pull/3150))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump actions/setup-node from 4.0.0 to 4.0.2
  ([#3069](https://github.com/compasjs/compas/pull/3069))
  - [Release notes](https://github.com/actions/setup-node/releases)
- build(deps): bump chokidar from 3.5.3 to 3.6.0
  ([#3079](https://github.com/compasjs/compas/pull/3079))
  - [Release notes](https://github.com/paulmillr/chokidar/releases)
- build(deps): bump recast from 0.23.4 to 0.23.6
  ([#3104](https://github.com/compasjs/compas/pull/3104),
  [#3139](https://github.com/compasjs/compas/pull/3139))
  - [Release notes](https://github.com/benjamn/recast/releases)
- build(deps): bump eslint from 8.56.0 to 8.57.0
  ([#3104](https://github.com/compasjs/compas/pull/3104))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump tar from 6.2.0 to 6.2.1
  ([#3139](https://github.com/compasjs/compas/pull/3139))
  - [Release notes](https://github.com/isaacs/node-tar/releases)
- build(deps): bump koa from 2.15.0 to 2.15.3
  ([#3139](https://github.com/compasjs/compas/pull/3139),
  [#3150](https://github.com/compasjs/compas/pull/3150))
- build(deps): bump postgres from 3.4.3 to 3.4.4
  ([#3139](https://github.com/compasjs/compas/pull/3139))
  - [Release notes](https://github.com/porsager/postgres/releases)

### [v0.10.0](https://github.com/compasjs/compas/releases/tag/v0.10.0)

#### Features

- feat(code-gen): support `Updater` in RQ `setQueryData`
  [`7ba289`](https://github.com/compasjs/compas/commit/7ba289bbbf6e7597c0890d34eba73b8573b9f043)
- feat(store): accept a `tokenMaxAgeResolver` in the session settings
  [`9fa68b`](https://github.com/compasjs/compas/commit/9fa68b8caa0f547c4adc47cfa22cc87d770930b2)

#### Other

- chore: run `npm pkg fix`
  [`5dc314`](https://github.com/compasjs/compas/commit/5dc314839505516707694669c34df911e7d70cf9)

#### Dependency updates

- build(deps): bump github/codeql-action from 2 to 3
  ([#3014](https://github.com/compasjs/compas/pull/3014))
  [`e3252b`](https://github.com/compasjs/compas/commit/e3252b5ec6deef5466ad55d05d3f1ac1b2fd1157)
  - [Release notes](https://github.com/github/codeql-action/releases)
- build(deps): bump actions/upload-artifact from 3 to 4
  ([#3016](https://github.com/compasjs/compas/pull/3016))
  [`57398e`](https://github.com/compasjs/compas/commit/57398eb32df2b8594bcae483a2a416758ab72c04)
  - [Release notes](https://github.com/actions/upload-artifact/releases)
- build(deps): bump file-type from 18.7.0 to 19.0.0
  ([#3032](https://github.com/compasjs/compas/pull/3032))
  - Major version bump
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump c8 from 8.0.1 to 9.0.0
  ([#3032](https://github.com/compasjs/compas/pull/3032))
  - Major version bump
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump eslint-plugin-jsdoc from 46.9.0 to 48.0.2
  ([#3032](https://github.com/compasjs/compas/pull/3032))
  - Major version bump
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @babel/core from 7.23.5 to 7.23.7
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint from 8.54.0 to 8.56.0
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-config-prettier from 9.0.0 to 9.1.0
  ([#3035](https://github.com/compasjs/compas/pull/3035))
- build(deps): bump eslint-plugin-import from 2.29.0 to 2.29.1
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump prettier from 3.1.0 to 3.1.1
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump koa from 2.14.2 to 2.15.0
  ([#3035](https://github.com/compasjs/compas/pull/3035))
- build(deps): bump pino from 8.16.2 to 8.17.2
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.462.0 to 3.489.0
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.462.0 to 3.489.0
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump sharp from 0.33.0 to 0.33.1
  ([#3035](https://github.com/compasjs/compas/pull/3035))
  - [Release notes](https://github.com/lovell/sharp/releases)

### [v0.9.0](https://github.com/compasjs/compas/releases/tag/v0.9.0)

#### Features

- feat(cli): support `--use-host` on `compas docker` commands
  [`428f5a`](https://github.com/compasjs/compas/commit/428f5af2cb401598a0db16bd9956537b37b2ed8d)

#### Other

- chore: run prettier on all files
  [`e3009b`](https://github.com/compasjs/compas/commit/e3009b9f14c0cb4d1d9bc0f8cd87c2df960e86b8)

#### Dependency updates

- build(deps): bump @aws-sdk/client-s3 from 3.445.0 to 3.462.0
  ([#2968](https://github.com/compasjs/compas/pull/2968),
  [#3006](https://github.com/compasjs/compas/pull/3006))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.445.0 to 3.462.0
  ([#2968](https://github.com/compasjs/compas/pull/2968),
  [#3006](https://github.com/compasjs/compas/pull/3006))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump file-type from 18.6.0 to 18.7.0
  ([#2968](https://github.com/compasjs/compas/pull/2968))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump prettier from 3.0.3 to 3.1.0
  ([#2968](https://github.com/compasjs/compas/pull/2968))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump @babel/core from 7.23.3 to 7.23.5
  ([#3006](https://github.com/compasjs/compas/pull/3006))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint from 8.53.0 to 8.54.0
  ([#3006](https://github.com/compasjs/compas/pull/3006))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump sharp from 0.32.6 to 0.33.0
  ([#3006](https://github.com/compasjs/compas/pull/3006))
  - Major version bump
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump pino from 8.16.1 to 8.16.2
  ([#3006](https://github.com/compasjs/compas/pull/3006))
  - [Release notes](https://github.com/pinojs/pino/releases)

### [v0.8.1](https://github.com/compasjs/compas/releases/tag/v0.8.1)

#### Other

- examples(react-fetch): show GitHub emojis
  [`cc6b52`](https://github.com/compasjs/compas/commit/cc6b521ec0f3b378ff549ddd78b8cc71e4aa058b)

#### Dependency updates

- build(deps): bump eslint from 8.52.0 to 8.53.0
  ([#2949](https://github.com/compasjs/compas/pull/2949))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.436.0 to 3.445.0
  ([#2949](https://github.com/compasjs/compas/pull/2949),
  [#2956](https://github.com/compasjs/compas/pull/2956))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.436.0 to 3.445.0
  ([#2949](https://github.com/compasjs/compas/pull/2949),
  [#2956](https://github.com/compasjs/compas/pull/2956))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump file-type from 18.5.0 to 18.6.0
  ([#2949](https://github.com/compasjs/compas/pull/2949))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump postgres from 3.4.1 to 3.4.3
  ([#2949](https://github.com/compasjs/compas/pull/2949))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump @babel/core from 7.23.2 to 7.23.3
  ([#2959](https://github.com/compasjs/compas/pull/2959))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.22.15 to 7.23.3
  ([#2959](https://github.com/compasjs/compas/pull/2959))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint-plugin-jsdoc from 46.8.2 to 46.9.0
  ([#2959](https://github.com/compasjs/compas/pull/2959))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.8.0](https://github.com/compasjs/compas/releases/tag/v0.8.0)

#### Features

- feat(code-gen): generate RQ5 like object arguments while staying on RQ4
  [`127699`](https://github.com/compasjs/compas/commit/127699362951d66d65b0c6abdc613fb9b420b035)
  - References [#2644](https://github.com/compasjs/compas/pull/2644)
- feat(code-gen): support react-query v5
  [`e4862f`](https://github.com/compasjs/compas/commit/e4862f36f2879bda72ef14983cf4cbee216b9b70)
  - Closes [#2644](https://github.com/compasjs/compas/pull/2644)

#### Dependency updates

- build(deps): bump @aws-sdk/client-s3 from 3.428.0 to 3.436.0
  ([#2907](https://github.com/compasjs/compas/pull/2907),
  [#2922](https://github.com/compasjs/compas/pull/2922))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.428.0 to 3.436.0
  ([#2907](https://github.com/compasjs/compas/pull/2907),
  [#2922](https://github.com/compasjs/compas/pull/2922))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump actions/setup-node from 3.8.1 to 4.0.0
  ([#2919](https://github.com/compasjs/compas/pull/2919))
  - Major version bump
  - [Release notes](https://github.com/actions/setup-node/releases)
- build(deps): bump postgres from 3.4.0 to 3.4.1
  ([#2922](https://github.com/compasjs/compas/pull/2922))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump eslint from 8.51.0 to 8.52.0
  ([#2922](https://github.com/compasjs/compas/pull/2922))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-import from 2.28.1 to 2.29.0
  ([#2922](https://github.com/compasjs/compas/pull/2922))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump pino from 8.16.0 to 8.16.1
  ([#2922](https://github.com/compasjs/compas/pull/2922))
  - [Release notes](https://github.com/pinojs/pino/releases)

### [v0.7.6](https://github.com/compasjs/compas/releases/tag/v0.7.6)

#### Features

- feat(store): support specifying a maintenance database when using
  'createIfNotExists'
  [`673276`](https://github.com/compasjs/compas/commit/673276158f890ac1cc1b936df3124a0db578fd7d)

#### Bug fixes

- fix(examples): correct subCommand check
  ([#2850](https://github.com/compasjs/compas/pull/2850))
  [`c73d66`](https://github.com/compasjs/compas/commit/c73d66dfbc6a6d87b3ca7734a66055a3110a925a)
- fix(store): use stream.Readable types in file functions
  [`729347`](https://github.com/compasjs/compas/commit/7293477b4f3b959fa0515e1b0a1dd35b30179a27)
- fix(store): skip transform on unsupported image formats like .ico files
  [`0a4745`](https://github.com/compasjs/compas/commit/0a4745b40dcb52c182cf15d5f6c444603a7792db)
- fix(code-gen): align response type in react-query generator when not known
  [`d933b8`](https://github.com/compasjs/compas/commit/d933b85c102b075804b57dc0d36d960d60e5b1fb)

#### Other

- chore(docs): fix typo in types-and-validators.md
  [`97b797`](https://github.com/compasjs/compas/commit/97b797715b3ed6b2806ac83cb54cdec4e8b39124)
- chore(docs): add CI docs
  [`663d58`](https://github.com/compasjs/compas/commit/663d587dcdb230cb73fa7f8bcb14d74b9ba966b0)
- chore(compas): drop package
  [`5c4664`](https://github.com/compasjs/compas/commit/5c4664d59e4a47d5062dd865a6bd0e6bb3b7b9c4)

#### Dependency updates

- build(deps): bump @aws-sdk/client-s3 from 3.414.0 to 3.428.0
  ([#2849](https://github.com/compasjs/compas/pull/2849),
  [#2858](https://github.com/compasjs/compas/pull/2858),
  [#2875](https://github.com/compasjs/compas/pull/2875),
  [#2890](https://github.com/compasjs/compas/pull/2890))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.414.0 to 3.428.0
  ([#2849](https://github.com/compasjs/compas/pull/2849),
  [#2858](https://github.com/compasjs/compas/pull/2858),
  [#2875](https://github.com/compasjs/compas/pull/2875),
  [#2890](https://github.com/compasjs/compas/pull/2890))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump sharp from 0.32.5 to 0.32.6
  ([#2849](https://github.com/compasjs/compas/pull/2849))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump @babel/core from 7.22.19 to 7.23.2
  ([#2849](https://github.com/compasjs/compas/pull/2849),
  [#2858](https://github.com/compasjs/compas/pull/2858),
  [#2890](https://github.com/compasjs/compas/pull/2890))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint-plugin-jsdoc from 46.8.1 to 46.8.2
  ([#2849](https://github.com/compasjs/compas/pull/2849))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump eslint from 8.49.0 to 8.51.0
  ([#2858](https://github.com/compasjs/compas/pull/2858),
  [#2890](https://github.com/compasjs/compas/pull/2890))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump pino from 8.15.1 to 8.16.0
  ([#2875](https://github.com/compasjs/compas/pull/2875),
  [#2890](https://github.com/compasjs/compas/pull/2890))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump postgres from 3.3.5 to 3.4.0
  ([#2890](https://github.com/compasjs/compas/pull/2890))
  - [Release notes](https://github.com/porsager/postgres/releases)

### [v0.7.5](https://github.com/compasjs/compas/releases/tag/v0.7.5)

#### Bug fixes

- fix(compas): merge file change paths on debounced calls
  [`30f464`](https://github.com/compasjs/compas/commit/30f464d8f6689591453ad338fda63490d1902ee2)
- fix(compas): use original process env when spawning actions
  [`7711cb`](https://github.com/compasjs/compas/commit/7711cbab97848f6ace6e94100c837a280ede6b61)
- fix(compas): only print info on changes to the resolved config
  [`e493d1`](https://github.com/compasjs/compas/commit/e493d1656518992cf50adb4c1c215ab8058e4ea7)
- fix(compas): only print info on changes to the started docker containers
  [`01ef1e`](https://github.com/compasjs/compas/commit/01ef1eb9f5410d790b63fb65ee68110deb8607e1)

#### Other

- chore(docs): add page scaffolding for lint and migration integrations
  [`20a815`](https://github.com/compasjs/compas/commit/20a8151078b81ac12129b7a29a1c8682db606e05)

### [v0.7.4](https://github.com/compasjs/compas/releases/tag/v0.7.4)

#### Features

- feat(compas): improved package manager support
  [`0c59d0`](https://github.com/compasjs/compas/commit/0c59d09a50fb1a328140d264acf3db4e8ae0b2c6)
- feat(compas): add inferred 'dev', 'lint' and 'test' actions
  [`59bb35`](https://github.com/compasjs/compas/commit/59bb3582e4b218014a908722eef4773f12212987)
- feat(compas): add 'compas init docker'
  [`1b18b4`](https://github.com/compasjs/compas/commit/1b18b4d0b36a310af1eb8cbda826195e5b6a9e6f)
- feat(compas): add docker integration in dev server
  [`560f0b`](https://github.com/compasjs/compas/commit/560f0bbea460951b1a9129b77a9ac3a2b29420f9)

#### Bug fixes

- fix(compas): debounce persist cache, fix package-manager comparison
  [`1c0578`](https://github.com/compasjs/compas/commit/1c057832b80279877378a58a30b4b693871a8514)
- fix(compas): don't assume stdin has 'setRawMode'
  [`eba39e`](https://github.com/compasjs/compas/commit/eba39e8b2c5abe81e22100ebda5c3733a5361f8c)
- fix(cli): correctly clean on `compas docker clean --project foo-bar` with a
  `-` in the name
  [`6cf9cc`](https://github.com/compasjs/compas/commit/6cf9ccaed2382975173f19334bf8eab4579d4a37)

#### Other

- chore(compas): add cli test setup
  [`26a8c5`](https://github.com/compasjs/compas/commit/26a8c52d20b535aa59bd2f2113feca61d3fbe910)
- chore(compas): better test abstraction
  [`89e1f9`](https://github.com/compasjs/compas/commit/89e1f9cf19a0cd7311bb5ecd8b10464b85cacc1f)
- chore(docs): add docs on inferred actions
  [`471ebe`](https://github.com/compasjs/compas/commit/471ebe75d04a9c24e037a2afe10e08a426e0309a)
- chore(compas): use unique test directories
  [`6ca3da`](https://github.com/compasjs/compas/commit/6ca3dad9d70234ea9f79220e53eea127db4e0672)
- chore(compas): minimize dangling promises
  [`1ec564`](https://github.com/compasjs/compas/commit/1ec564e0823a6044402a9781954522fb2a899794)
- chore(docs): add docs on the Docker integrations for the new CLI
  [`d95259`](https://github.com/compasjs/compas/commit/d952592f7bf886a8443343243cc8d64ebfc26802)
- chore(docs): add minor update to background jobs handler timeout
  [`5f1d65`](https://github.com/compasjs/compas/commit/5f1d65d054767f6a5a914591ac5a0328dd1cbe4a)
- chore(ci): persist cache directory on CI failures
  [`b74d1f`](https://github.com/compasjs/compas/commit/b74d1fe4981b3f9ad1c8a58fa9d54be93b5443bf)
- chore(compas): wait for the file-watchers in tests
  [`a6f65e`](https://github.com/compasjs/compas/commit/a6f65e79509526a9a280b1840ae2967d1e72bbff)

#### Dependency updates

- build(deps): bump @babel/core from 7.22.11 to 7.22.19
  ([#2830](https://github.com/compasjs/compas/pull/2830),
  [#2841](https://github.com/compasjs/compas/pull/2841))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.22.11 to 7.22.15
  ([#2830](https://github.com/compasjs/compas/pull/2830))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint from 8.48.0 to 8.49.0
  ([#2830](https://github.com/compasjs/compas/pull/2830))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump tar from 6.1.15 to 6.2.0
  ([#2830](https://github.com/compasjs/compas/pull/2830))
  - [Release notes](https://github.com/isaacs/node-tar/releases)
- build(deps): bump pino from 8.15.0 to 8.15.1
  ([#2830](https://github.com/compasjs/compas/pull/2830))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.400.0 to 3.414.0
  ([#2830](https://github.com/compasjs/compas/pull/2830),
  [#2841](https://github.com/compasjs/compas/pull/2841))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.400.0 to 3.414.0
  ([#2830](https://github.com/compasjs/compas/pull/2830),
  [#2841](https://github.com/compasjs/compas/pull/2841))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump eslint-plugin-jsdoc from 46.5.1 to 46.8.1
  ([#2841](https://github.com/compasjs/compas/pull/2841))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.7.3](https://github.com/compasjs/compas/releases/tag/v0.7.3)

#### Features

- feat(store): only let image transformations fail on Sharp errors
  [`945136`](https://github.com/compasjs/compas/commit/945136d8b3046f804d49819a498e2d1627ea5ad3)

### [v0.7.2](https://github.com/compasjs/compas/releases/tag/v0.7.2)

#### Bug fixes

- fix(compas): prevent infinite recursion while loading configs
  [`9eb460`](https://github.com/compasjs/compas/commit/9eb4607ea276fc3ceef5df91b830e64180c92a30)
- fix(code-gen): include correct files in package
  [`06011b`](https://github.com/compasjs/compas/commit/06011b3bed0fd555e2caeccba2391284f0e4ec03)

#### Other

- chore(compas): fix compas version used in 'compas init'
  [`462445`](https://github.com/compasjs/compas/commit/4624452da6e0e8a9c07e8e0eee6900fd22fe2bb8)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 46.5.0 to 46.5.1
  ([#2821](https://github.com/compasjs/compas/pull/2821))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump prettier from 3.0.2 to 3.0.3
  ([#2821](https://github.com/compasjs/compas/pull/2821))
  - [Release notes](https://github.com/prettier/prettier/releases)

### [v0.7.1](https://github.com/compasjs/compas/releases/tag/v0.7.1)

#### Features

- feat(compas): add support for `npx compas@latest init`
  [`5137c8`](https://github.com/compasjs/compas/commit/5137c8a26a38629526cd9c2778a442caddbacfb7)
- feat(compas): reimplement `zakmes`, add package manager support
  [`07f28e`](https://github.com/compasjs/compas/commit/07f28e610ba3c05b0e0610c81b5f959c67a11435)
- feat(code-gen): expand validator error message on query builder validation
  errors
  [`69c379`](https://github.com/compasjs/compas/commit/69c379a0f0b81a0e823ab680d6f1072776b0cc4d)
- feat(code-gen): add error when an uppercase character is used in
  `.shortName()`
  [`9d6098`](https://github.com/compasjs/compas/commit/9d6098ed225a2aeb5571929f7d2bbdad4b25bf21)

#### Bug fixes

- fix(eslint-plugin): ignore `eventStop` calls that are not in a function
  [`2b2f2b`](https://github.com/compasjs/compas/commit/2b2f2bf260d3bb9320f2272aabecd12f40e476f2)
- fix(all): cleanup .npmignore usage, so types are included again
  [`b141ad`](https://github.com/compasjs/compas/commit/b141ad08bc8d02af3ae0c11ac2d21d780c54dd74)
- fix(store): ignore invalid JPEG's when transforming images
  [`440202`](https://github.com/compasjs/compas/commit/4402025f3f2e9ce6d2a11b2899ab11abdb3d394f)
- fix(stdlib): prevent zombie processes on process exit
  [`e30cbb`](https://github.com/compasjs/compas/commit/e30cbbd68fc3e0c5f3c38fcd71399db763633a8d)

#### Other

- chore(docs): write some docs on the new CLI
  [`37b81c`](https://github.com/compasjs/compas/commit/37b81c31340c393f9174ac9590601f29cae1f156)
- chore(docs): rename `npx compas install` to `npx compas init`
  [`40fc90`](https://github.com/compasjs/compas/commit/40fc908dd88375adcaabff6d429f16312748a7d0)
- chore(docs): fix links to new alpha docs
  [`d0607c`](https://github.com/compasjs/compas/commit/d0607c40a9bf1029a753e1f31048ed27c70d3c93)
- chore(compas): move some file around before expansion
  [`dd3b44`](https://github.com/compasjs/compas/commit/dd3b44519e7f2d74829f96505754b058e40bd524)
- chore(docs): update vitepress
  [`3ff4bd`](https://github.com/compasjs/compas/commit/3ff4bd61ee4ac9650fab04bf4da23df113a4a680)
- chore(compas): prevent zombie processes
  [`896a29`](https://github.com/compasjs/compas/commit/896a29fabc33ba0c4fb375bcab79c2f246694a00)

#### Dependency updates

- build(deps): bump @aws-sdk/client-s3 from 3.395.0 to 3.400.0
  ([#2813](https://github.com/compasjs/compas/pull/2813),
  [#2816](https://github.com/compasjs/compas/pull/2816))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.395.0 to 3.400.0
  ([#2813](https://github.com/compasjs/compas/pull/2813),
  [#2816](https://github.com/compasjs/compas/pull/2816))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/core from 7.22.10 to 7.22.11
  ([#2813](https://github.com/compasjs/compas/pull/2813))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.22.10 to 7.22.11
  ([#2813](https://github.com/compasjs/compas/pull/2813))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint-plugin-jsdoc from 46.4.6 to 46.5.0
  ([#2813](https://github.com/compasjs/compas/pull/2813))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @parcel/watcher from 2.2.0 to 2.3.0
  ([#2813](https://github.com/compasjs/compas/pull/2813))
  - [Release notes](https://github.com/parcel-bundler/watcher/releases)
- build(deps): bump eslint from 8.47.0 to 8.48.0
  ([#2816](https://github.com/compasjs/compas/pull/2816))
  - [Release notes](https://github.com/eslint/eslint/releases)

### [v0.7.0](https://github.com/compasjs/compas/releases/tag/v0.7.0)

Introducing the experimental `zakmes` CLI for an integrated development
experience! Installable via the `compas` package. See the
[docs](https://compasjs.com/docs/getting-started.html) for more information and
follow [the issue](https://github.com/compasjs/compas/issues/2774) to stay up to
date.

#### Features

- feat(eslint-plugin): add 'node-builtin-module-url-import' rule
  [`923e7b`](https://github.com/compasjs/compas/commit/923e7b00c1f329a3594211d584174c6445be55e7)
  - Auto-fixes any import of Node.js builtins you use the `node:` specifier.

#### Other

- docs(stdlib): minor insight event documentation improvement
  ([#2728](https://github.com/compasjs/compas/pull/2728))
  [`9a8afc`](https://github.com/compasjs/compas/commit/9a8afc4dde76ff137371e96ccca60c9ee5906a14)
- chore(docs): use vitepress sitemap feature
  [`28fcb1`](https://github.com/compasjs/compas/commit/28fcb184332db836f70d0726601997f1352e72a3)
- chore: cleanup code-mods
  [`c80410`](https://github.com/compasjs/compas/commit/c80410cddb6529f9e6dfa376994e65de5e98114c)
- chore: typescript maintenance
  [`7b3e0f`](https://github.com/compasjs/compas/commit/7b3e0f9520f700ff585dd1bc8f1ac814d8330635)
- chore(release): fail release if types don't check out
  [`fb4e4d`](https://github.com/compasjs/compas/commit/fb4e4dceac88140ed13d448cf006575dd29c1de1)
- chore(docs): customize vitepress theme to use green colors
  [`ba082d`](https://github.com/compasjs/compas/commit/ba082d3638caa842aa876289cbdfb6b7691af243)
- chore(typescript): remove tsc from the internal generate command
  [`c3ab53`](https://github.com/compasjs/compas/commit/c3ab53dad257242ea4b19c40027edb28b59f7d24)
- chore(dependabot): group all dependency updates
  [`b7186e`](https://github.com/compasjs/compas/commit/b7186ee9ebffcd1e76afccc5652fb9d7f76077de)

#### Dependency updates

- build(deps): bump sharp from 0.32.3 to 0.32.5
  ([#2743](https://github.com/compasjs/compas/pull/2743),
  [#2799](https://github.com/compasjs/compas/pull/2799))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump c8 from 8.0.0 to 8.0.1
  ([#2753](https://github.com/compasjs/compas/pull/2753))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump pino from 8.14.1 to 8.15.0
  ([#2757](https://github.com/compasjs/compas/pull/2757),
  [#2779](https://github.com/compasjs/compas/pull/2779))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump eslint-plugin-jsdoc from 46.4.4 to 46.4.6
  ([#2758](https://github.com/compasjs/compas/pull/2758),
  [#2778](https://github.com/compasjs/compas/pull/2778))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump eslint-config-prettier from 8.8.0 to 9.0.0
  ([#2759](https://github.com/compasjs/compas/pull/2759),
  [#2773](https://github.com/compasjs/compas/pull/2773),
  [#2777](https://github.com/compasjs/compas/pull/2777))
  - Major version bump
- build(deps): bump eslint-plugin-import from 2.27.5 to 2.28.1
  ([#2761](https://github.com/compasjs/compas/pull/2761),
  [#2804](https://github.com/compasjs/compas/pull/2804))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump eslint from 8.45.0 to 8.47.0
  ([#2760](https://github.com/compasjs/compas/pull/2760),
  [#2792](https://github.com/compasjs/compas/pull/2792))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.374.0 to 3.395.0
  ([#2770](https://github.com/compasjs/compas/pull/2770),
  [#2783](https://github.com/compasjs/compas/pull/2783),
  [#2804](https://github.com/compasjs/compas/pull/2804))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.374.0 to 3.395.0
  ([#2770](https://github.com/compasjs/compas/pull/2770),
  [#2783](https://github.com/compasjs/compas/pull/2783),
  [#2804](https://github.com/compasjs/compas/pull/2804))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump prettier from 3.0.0 to 3.0.2
  ([#2772](https://github.com/compasjs/compas/pull/2772),
  [#2798](https://github.com/compasjs/compas/pull/2798))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump @babel/core from 7.22.9 to 7.22.10
  ([#2781](https://github.com/compasjs/compas/pull/2781))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.22.9 to 7.22.10
  ([#2781](https://github.com/compasjs/compas/pull/2781))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump recast from 0.23.3 to 0.23.4
  ([#2790](https://github.com/compasjs/compas/pull/2790))
  - [Release notes](https://github.com/benjamn/recast/releases)
- build(deps): bump bcrypt from 5.1.0 to 5.1.1
  ([#2797](https://github.com/compasjs/compas/pull/2797))
  - [Release notes](https://github.com/kelektiv/node.bcrypt.js/releases)
- build(deps): bump cron-parser from 4.8.1 to 4.9.0
  ([#2795](https://github.com/compasjs/compas/pull/2795))
  - [Release notes](https://github.com/harrisiirak/cron-parser/releases)
- build(deps): bump dotenv from 16.0.3 to 16.3.1
  ([#2804](https://github.com/compasjs/compas/pull/2804))

### [v0.6.0](https://github.com/compasjs/compas/releases/tag/v0.6.0)

#### Features

- feat(store): silently ignore file transforms on non-image files
  [`08f097`](https://github.com/compasjs/compas/commit/08f097ecde79ca8bad613c16cec07b75124ffe0b)

#### Other

- chore(dependabot): group babel and typescript-eslint bumps
  [`c59721`](https://github.com/compasjs/compas/commit/c5972158af5655bb7ab736bf39f0b44a1fc6f438)
- chore(dependabot): group `@types/` bumps
  [`5f257f`](https://github.com/compasjs/compas/commit/5f257f36867d2accfccdffd2ca2eaa22338d04fc)
- chore(examples): increase test timeout for file-handling example
  [`d6bfa3`](https://github.com/compasjs/compas/commit/d6bfa3356e413875e770a6105cd732b9d9c21a49)
- examples(file-handling): fix blob creation from stream
  [`7f4257`](https://github.com/compasjs/compas/commit/7f4257f791da92b11bfd8c1040f52e87f0b73802)
- chore(changelog): handle grouped dependabot bumps
  [`39ca1f`](https://github.com/compasjs/compas/commit/39ca1f153e2b224999c32991d5e2f9c7da232176)

#### Dependency updates

- build(deps): bump @babel/core from 7.22.5 to 7.22.9
  ([#2715](https://github.com/compasjs/compas/pull/2715),
  [#2730](https://github.com/compasjs/compas/pull/2730))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.22.5 to 7.22.9
  ([#2715](https://github.com/compasjs/compas/pull/2715),
  [#2730](https://github.com/compasjs/compas/pull/2730))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.363.0 to 3.370.0
  ([#2716](https://github.com/compasjs/compas/pull/2716),
  [#2724](https://github.com/compasjs/compas/pull/2724),
  [#2731](https://github.com/compasjs/compas/pull/2731))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.363.0 to 3.370.0
  ([#2716](https://github.com/compasjs/compas/pull/2716),
  [#2724](https://github.com/compasjs/compas/pull/2724),
  [#2731](https://github.com/compasjs/compas/pull/2731))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump actions/setup-node from 3.6.0 to 3.7.0
  ([#2712](https://github.com/compasjs/compas/pull/2712))
  - [Release notes](https://github.com/actions/setup-node/releases)
- build(deps): bump prettier from 2.8.8 to 3.0.0
  ([#2714](https://github.com/compasjs/compas/pull/2714))
  - Major version bump
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump sharp from 0.32.1 to 0.32.3
  ([#2734](https://github.com/compasjs/compas/pull/2734))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump eslint-plugin-jsdoc from 46.4.3 to 46.4.4
  ([#2733](https://github.com/compasjs/compas/pull/2733))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump eslint from 8.44.0 to 8.45.0
  ([#2732](https://github.com/compasjs/compas/pull/2732))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump semver from 6.3.0 to 6.3.1
  ([#2723](https://github.com/compasjs/compas/pull/2723))
  - [Release notes](https://github.com/npm/node-semver/releases)
- build(deps): bump recast from 0.23.2 to 0.23.3
  ([#2725](https://github.com/compasjs/compas/pull/2725))
  - [Release notes](https://github.com/benjamn/recast/releases)

### [v0.5.5](https://github.com/compasjs/compas/releases/tag/v0.5.5)

#### Features

- feat(store): add `w=original` support to `fileSendTransformedImage`, keep
  track of original image width and height
  [`88adad`](https://github.com/compasjs/compas/commit/88adad4abccd0b5c5723bfa8aed017ff107e0da2)
- feat(store): add `fileTransformInPlace`
  [`d61c3d`](https://github.com/compasjs/compas/commit/d61c3d91bd04c9030c0263e7828b0b079b6c4f13)
- feat(store): support `fileTransformInPlaceOptions` in `fileCreateOrUpdate`
  [`e461e2`](https://github.com/compasjs/compas/commit/e461e234ca9bb1198ec370cc2c86ab075723c745)
- feat(store): export list of supported image content types
  [`f6cc29`](https://github.com/compasjs/compas/commit/f6cc2961e280572c15b6af5143d15b38b979759a)

#### Other

- chore(dependabot): group aws-sdk dependency updates
  [`da7b1e`](https://github.com/compasjs/compas/commit/da7b1edfebe97619fabe15fc7587b2bea4287edf)

### [v0.5.4](https://github.com/compasjs/compas/releases/tag/v0.5.4)

#### Features

- feat(code-gen): add hook name to required variables check in the react-query
  generator
  [`93c80e`](https://github.com/compasjs/compas/commit/93c80e0a99673c0003ff1fb95918f1c3bb2904fb)
- feat(eslint-plugin): disable warning on unsupported TS versions
  [`18f909`](https://github.com/compasjs/compas/commit/18f909fe07b6650c98b19211aae15fc348405346)

#### Other

- chore(docs): update site description
  [`fc5966`](https://github.com/compasjs/compas/commit/fc5966257fd921317aad124dbcb1c75be5f84f1c),
  [`589278`](https://github.com/compasjs/compas/commit/58927841d48db48765526b95ec4e0eb90427457e)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 46.2.6 to 46.4.3
  ([#2685](https://github.com/compasjs/compas/pull/2685),
  [#2691](https://github.com/compasjs/compas/pull/2691),
  [#2697](https://github.com/compasjs/compas/pull/2697),
  [#2701](https://github.com/compasjs/compas/pull/2701))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump eslint from 8.43.0 to 8.44.0
  ([#2700](https://github.com/compasjs/compas/pull/2700))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.354.0 to 3.363.0
  ([#2699](https://github.com/compasjs/compas/pull/2699))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.354.0 to 3.363.0
  ([#2698](https://github.com/compasjs/compas/pull/2698))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.5.3](https://github.com/compasjs/compas/releases/tag/v0.5.3)

#### Features

- feat(cli): expose the test name via `t.name` in the test runner
  [`900de5`](https://github.com/compasjs/compas/commit/900de5c803fcdf2a9c9e5a61246f5808f19f36cc)
- feat(cli): pad the 'threadId' in test runner logs to align when a high number
  of workers / randomize rounds are used
  [`024813`](https://github.com/compasjs/compas/commit/024813cb4936e8d9618e14ec5678fe862bde29b1)
- feat(cli): add `t.jobs` to configure concurrent subtests
  [`3d0b9e`](https://github.com/compasjs/compas/commit/3d0b9eb1c29a7115225d6b1502867bfee80cdd5b)
- feat(cli): add support for `.mjs` and `.cjs` scripts in `compas run`
  [`9632d8`](https://github.com/compasjs/compas/commit/9632d8025a2b4612a126f670f0131f4eea7e9a21)

#### Bug fixes

- fix(code-gen): correctly import & export dateOnly & timeOnly via OpenAPI
  [`62f4d9`](https://github.com/compasjs/compas/commit/62f4d9099831d3460a51c83c81097128f874d5fe)
- fix(store): change error log to info log when trying to transform an already
  removed file
  [`f8c6ff`](https://github.com/compasjs/compas/commit/f8c6ff6d523d984768803d6cd10ad63fc2276d08)

#### Other

- chore(prettier): ignore `dist` directories
  [`d9967a`](https://github.com/compasjs/compas/commit/d9967a24bcdeedd94f2b21612234b68009dce93d)
- chore(cli): refactor internal config of `compas test`
  [`d937d1`](https://github.com/compasjs/compas/commit/d937d17b52719a32e81aff7af21068023f68eb27)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 45.0.0 to 46.2.6
  ([#2643](https://github.com/compasjs/compas/pull/2643))
  - Major version bump; enables the
    [`jsdoc/no-defaults`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-defaults.md#readme)
    rule by default.
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @babel/eslint-parser from 7.21.8 to 7.22.5
  ([#2645](https://github.com/compasjs/compas/pull/2645))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/core from 7.22.1 to 7.22.5
  ([#2646](https://github.com/compasjs/compas/pull/2646))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump c8 from 7.14.0 to 8.0.0
  ([#2659](https://github.com/compasjs/compas/pull/2659))
  - Major version bump
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump eslint from 8.42.0 to 8.43.0
  ([#2664](https://github.com/compasjs/compas/pull/2664))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.347.1 to 3.354.0
  ([#2665](https://github.com/compasjs/compas/pull/2665))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.347.1 to 3.354.0
  ([#2669](https://github.com/compasjs/compas/pull/2669))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.5.2](https://github.com/compasjs/compas/releases/tag/v0.5.2)

#### Features

- feat(cli): check if '.cache' is git ignored in `compas check-env`
  [`70573d`](https://github.com/compasjs/compas/commit/70573d75de253359d6ca81db358e2081868cdd20)
- feat(cli): remove 'graphviz' check from `compas check-env`
  [`91cf87`](https://github.com/compasjs/compas/commit/91cf879e209daf5ce9fb4d76616a0cbb6a5649b3)

#### Bug fixes

- fix(code-gen): always generate the `Pretty` type even if global api clients is
  on
  [`550143`](https://github.com/compasjs/compas/commit/550143b679b754e9fb47777e08149fba5e58035a)
- fix(store): verify that the s3Client has a region before attempting to resolve
  the bucket
  [`4d25a9`](https://github.com/compasjs/compas/commit/4d25a9402544854cc5c8365ac298a607a4c4ba9d)

#### Other

- chore(examples): add .gitignore to all examples
  [`d8a5eb`](https://github.com/compasjs/compas/commit/d8a5ebb43a4281f27a7ea5f4cf813b116b4778c3)
- chore(cli): update description of `compas check-env`
  [`3b246f`](https://github.com/compasjs/compas/commit/3b246fa224f37aa8733c728903dd1829d556f0e1)
- examples(react-fetch): init example
  [`82ec52`](https://github.com/compasjs/compas/commit/82ec52e14ac87ac99c1f11b1377604815ef9abb1)
- chore(store): prefer `Object.keys` over `Object.entries`
  [`99d996`](https://github.com/compasjs/compas/commit/99d99684d1880a5fb3dce878730d0a18942e6ba5)
- chore(code-gen): prefer `Object.keys` over `Object.entries`
  [`63f71b`](https://github.com/compasjs/compas/commit/63f71b094a3f7178cb3ada149a34d9f019b16fc3)
- chore: fix TS issues after bump to 5.1.3
  [`55df94`](https://github.com/compasjs/compas/commit/55df944f3e78d801a808f855971497c69d9a7a3a)

#### Dependency updates

- build(deps): bump postgres from 3.3.4 to 3.3.5
  ([#2621](https://github.com/compasjs/compas/pull/2621))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump file-type from 18.4.0 to 18.5.0
  ([#2633](https://github.com/compasjs/compas/pull/2633))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.341.0 to 3.347.1
  ([#2638](https://github.com/compasjs/compas/pull/2638))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump eslint from 8.41.0 to 8.42.0
  ([#2629](https://github.com/compasjs/compas/pull/2629))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.341.0 to 3.347.1
  ([#2639](https://github.com/compasjs/compas/pull/2639))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.5.1](https://github.com/compasjs/compas/releases/tag/v0.5.1)

#### Other

- perf(code-gen): init js validator objects with known keys
  [`47259f`](https://github.com/compasjs/compas/commit/47259fb88a1e639abeae498ee2b624956a5d2b41)

### [v0.5.0](https://github.com/compasjs/compas/releases/tag/v0.5.0)

#### Breaking changes

- feat(stdlib): condense logs for events
  [`4e6983`](https://github.com/compasjs/compas/commit/4e698351c820a3acc4c9b944e6c2d2e9f5e6fd2c)
  - Changed the internal memory structure of events. `callStack` is now `span`.
    `parent` is removed and replaced by a `rootEvent`. Nested properties are
    affected as well. Usages like `event.name` still work as expected.
  - Changed the logs produced by the events. The `type` is now `event_span`
    instead of `event_callstack`. In these logs `callStack` is also replaced by
    span. Nested properties are affected as well to improve parsing and
    visualizing them. Please check the new logs and feel free to open an issue
    if you have trouble with migrating.

#### Features

- feat(code-gen): pretty react-query hook types
  [`7c644d`](https://github.com/compasjs/compas/commit/7c644dc9faca665a69981ea99f21bb6a64e46406)

#### Dependency updates

- build(deps): bump eslint from 8.40.0 to 8.41.0
  ([#2599](https://github.com/compasjs/compas/pull/2599))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 44.2.4 to 45.0.0
  ([#2603](https://github.com/compasjs/compas/pull/2603),
  [#2612](https://github.com/compasjs/compas/pull/2612))
  - Major version bump
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @babel/core from 7.21.8 to 7.22.1
  ([#2611](https://github.com/compasjs/compas/pull/2611))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.332.0 to 3.341.0
  ([#2610](https://github.com/compasjs/compas/pull/2610))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump c8 from 7.13.0 to 7.14.0
  ([#2614](https://github.com/compasjs/compas/pull/2614))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.332.0 to 3.341.0
  ([#2613](https://github.com/compasjs/compas/pull/2613))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.4.0](https://github.com/compasjs/compas/releases/tag/v0.4.0)

#### Breaking changes

There are a few structure breaking changes to clean up compatibility with old
code-gen. Make sure that the API is updated before any consumer is.

- feat(cli,store): align migration related functions
  [`bacfe3`](https://github.com/compasjs/compas/commit/bacfe34674e2426ae83de9214055e725e2d1c957)
  - Renamed `newMigrateContext` to `migrationsInitContext`. It also accepts an
    object with `migrationsDirectory` instead of a 'string' as the second
    argument. As before, if you don't provide a `migrationsDirectory` it
    defaults to `$cwd/migrations`.
  - Renamed `getMigrationsToBeApplied` to `migrationsGetInfo`. The result is
    wrapped in a promise.
  - Renamed `runMigrations` to `migrationsRun`.
  - All individual functions now acquire and release a Postgres lock instead of
    keeping the lock alive for the whole connection. This allows you to use
    these functions more easily in application code.
  - Dropped `--keep-alive` and `--without-lock` from `compas migrate`. If you
    need this functionality, you are better off calling the migration functions
    on application startup.
- feat(code-gen): drop `T.any().raw()` and `T.any().validator()`
  [`9d4f7a`](https://github.com/compasjs/compas/commit/9d4f7a7d16d2d0677dccdf8127ae6ece5b969fb2)
  - `T.any().raw()` and `T.any().validator()` were not implemented in the new
    code-gen. Use `T.any().implementations()` instead.
- feat(code-gen): drop `T.bool().convert()`, `T.number().convert()` and
  `T.string().convert()`
  [`d704a6`](https://github.com/compasjs/compas/commit/d704a6710949e6858fb79d4943ae818072301666)
  - The new code-gen automatically converts booleans, numbers and dates from
    their string representation.
- feat(code-gen): re-instantiate `T.array().convert()`
  [`d3aabb`](https://github.com/compasjs/compas/commit/d3aabbd874bc218bc9dceb8ccf9bbe4d63b751ca)
  - JS validators don't automatically convert single values to arrays anymore.
    Adding this as the default caused performance problems with the Typescript
    compiler and complex recursive types. It also caused a bad DX, where setting
    an empty array and trying to push later would result in a type error. Also
    not every planned target language has support to type this correctly anyway,
    so it should be used sparingly.
- feat(code-gen): drop `R.files()`
  [`569b2b`](https://github.com/compasjs/compas/commit/569b2b3e75b88ab04ebdddae6f6519937518de70)
  - Use `R.body()` instead of `R.files()`
  - When using the Koa router, change usages of `ctx.validatedFiles` with
    `ctx.validatedBody`
  - Auto-generated type names for files inputs like `PostSetHeaderImageFiles`
    will be renamed to `PostSetHeaderImageBody`.
  - Executing this change on the server doesn't require immediate regeneration
    of api clients. The way they currently send files is compatible.

#### Features

- feat(code-gen): add expected patterns to docs if no docs exist on `T.uuid()`,
  `T.date().{timeOnly,dateOnly}()`
  [`41e3e3`](https://github.com/compasjs/compas/commit/41e3e3fcfc1ff3103548acb2095cefc8d18232c2)
- feat(code-gen): add stricter validation on `R.params()` and `R.query()`
  [`21c9b7`](https://github.com/compasjs/compas/commit/21c9b711506c84da854443a981766cecf7a008ec)
- feat(code-gen): improve react-query DX by accepting a partial object on
  `useQuery` hooks
  [`430449`](https://github.com/compasjs/compas/commit/430449b52d77839849773eb71996590c065ef980)
- feat(code-gen): define behavior for `T.file()` in `R.body()`
  ([#2597](https://github.com/compasjs/compas/pull/2597))
  [`80429b`](https://github.com/compasjs/compas/commit/80429b09708adcb8dce7d6b683df70b8d8d5b461)

#### Bug fixes

- fix(code-gen): don't throw a 404 on no match in the router
  [`077da8`](https://github.com/compasjs/compas/commit/077da8a5f245163f9c214ea03eff8ccbf94c10fa)

#### Other

- chore(docs): add `T.array().convert()` to the docs
  [`9744e6`](https://github.com/compasjs/compas/commit/9744e6c54d3374e13078fa9c27397c7bee765a8a)
- chore: add a quick citgm command for testing unreleased Compas versions on
  local projects
  [`4b7ba7`](https://github.com/compasjs/compas/commit/4b7ba7cdb59da9aac8f9d7f497a88fdd37e7761d)

#### Dependency updates

- build(deps): bump recast from 0.22.0 to 0.23.2
  ([#2585](https://github.com/compasjs/compas/pull/2585))
  - Major version bump
- build(deps): bump tar from 6.1.14 to 6.1.15
  ([#2591](https://github.com/compasjs/compas/pull/2591))
  - [Release notes](https://github.com/isaacs/node-tar/releases)
- build(deps): bump eslint-plugin-jsdoc from 44.2.3 to 44.2.4
  ([#2588](https://github.com/compasjs/compas/pull/2588))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.3.2](https://github.com/compasjs/compas/releases/tag/v0.3.2)

#### Features

- feat(store): add `deleteJobOnCompletion` to the queue worker
  [`c82034`](https://github.com/compasjs/compas/commit/c82034d95916bea066d176fa4127a1a455fff76a)

#### Other

- chore(docs): generate sitemap
  [`aab7d8`](https://github.com/compasjs/compas/commit/aab7d81b128326a1d57fb491febf89171ee9b78c)
- chore(code-gen): rename internal code-gen group
  [`4bf684`](https://github.com/compasjs/compas/commit/4bf6848de218a33acd817c2ccaaacc0f18a8311e)
- chore(code-gen): cleanup RouteBuilder `internalSettings`
  [`1cd8f6`](https://github.com/compasjs/compas/commit/1cd8f625ba1cb8d0bf10548273e27bd348d4df61)
- chore(changelog): correct minor bumps in `0.x.y` ranges
  [`684e02`](https://github.com/compasjs/compas/commit/684e02babe45738bdd940edbcdd13a72db38c6c3)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 44.0.1 to 44.2.3
  ([#2580](https://github.com/compasjs/compas/pull/2580))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @types/formidable from 2.0.5 to 2.0.6
  ([#2574](https://github.com/compasjs/compas/pull/2574))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.328.0 to 3.332.0
  ([#2583](https://github.com/compasjs/compas/pull/2583))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.328.0 to 3.332.0
  ([#2582](https://github.com/compasjs/compas/pull/2582))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.3.1](https://github.com/compasjs/compas/releases/tag/v0.3.1)

#### Bug fixes

- fix(code-gen): strip undefined query parameters in the fetch api clients
  [`d3b51e`](https://github.com/compasjs/compas/commit/d3b51ecabf076f01ebbbc4a9cdf888725fc85c5c)

#### Dependency updates

- build(deps): bump file-type from 18.3.0 to 18.4.0
  ([#2576](https://github.com/compasjs/compas/pull/2576))

### [v0.3.0](https://github.com/compasjs/compas/releases/tag/v0.3.0)

#### Features

- feat(code-gen): add support for `transformContext` with custom readable types
  in CRUD
  [`65979a`](https://github.com/compasjs/compas/commit/65979a0f2880c6dad0a137a55d6298bbd6d10f8c)

#### Other

- chore(code-gen): cleanup 'NamedType' usages
  [`8a8434`](https://github.com/compasjs/compas/commit/8a84348f0037323da3f948509f910b58fd9faac8)
- chore(code-gen): cleanup experimental development test setup
  [`85918b`](https://github.com/compasjs/compas/commit/85918bd786d6e4341a0ecc546b054c2269bbed52)
- chore(code-gen): combine all internal utils
  [`6a61e7`](https://github.com/compasjs/compas/commit/6a61e7c588272ff31b33eae48d41cf95cd3cb6e2)
- chore(code-gen): speed up examples test by running them in parallel
  [`69cfb6`](https://github.com/compasjs/compas/commit/69cfb6a0de4090fb0663f0cd494f2538407de5d4)
- chore(test): increase timeout of examples test
  [`4ecd95`](https://github.com/compasjs/compas/commit/4ecd95d50e00a46c3435d09b338a7288581be75f)

#### Dependency updates

- build(deps): bump pino from 8.12.1 to 8.14.1
  ([#2567](https://github.com/compasjs/compas/pull/2567))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump eslint-plugin-jsdoc from 43.2.0 to 44.0.1
  ([#2568](https://github.com/compasjs/compas/pull/2568))
  - Major version bump
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.2.0](https://github.com/compasjs/compas/releases/tag/v0.2.0)

#### Features

- feat(code-gen): disable array auto-conversion types for the TS target
  [`4e5961`](https://github.com/compasjs/compas/commit/4e5961b559a82f82f3971b69be8fa6e268efe914)

#### Dependency updates

- build(deps): bump @aws-sdk/lib-storage from 3.327.0 to 3.328.0
  ([#2563](https://github.com/compasjs/compas/pull/2563))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.327.0 to 3.328.0
  ([#2561](https://github.com/compasjs/compas/pull/2561))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.1.0](https://github.com/compasjs/compas/releases/tag/v0.1.0)

#### Breaking changes

- fix(server): rename `formLimit` option to `urlencodedLimit` in
  `createBodyParsers`
  [`d600ac`](https://github.com/compasjs/compas/commit/d600ac5bc47c0506ced0d5f68767df818c49b201)
  - Rename your usage of `formLimit` to `urlencodedLimit` in the first argument
    to `createBodyParsers`
- feat(server,code-gen): combine json & multipart 'createBodyParsers' into a
  single 'createBodyParser'
  [`df9e43`](https://github.com/compasjs/compas/commit/df9e43ec0fcd09ed394acff6158da9fd0866c3d7)
  - Removed `createBodyParsers` use `createBodyParser` instead.
  - `createBodyParser` by default does not parse multipart bodies. This should
    be explicitly enabled with `multipart: true`. Configure its options with
    'multipartOptions' to set a custom `maxFileSize` for example.
  - Changed the `jsonLimit` default to '5mb'.
  - The generated Koa router now accepts a single body parser instead of the
    previous body parser pair returned by 'createBodyParsers'.
  - The updated usage looks something like:
  ```js
  app.use(
    router(
      createBodyParser({
        multipart: true,
        multipartOptions: {
          maxFileSize: 15 * 1024 * 2024,
        },
      }),
    ),
  );
  ```
- feat(code-gen): promote experimental to stable
  ([#2559](https://github.com/compasjs/compas/pull/2559))
  [`247aa0`](https://github.com/compasjs/compas/commit/247aa0af3876919428c659107c6110bc357a4788)
  - Removes support for old code-gen. Use the new target based code-gen instead.
    See the new [docs](https://compasjs.com/generators/introduction.html) and
    [migration guide](https://compasjs.com/releases/code-gen-migration.html).
  - It is expected that future Compas release fully break structure
    compatibility with legacy clients, so make sure to migrate as soon as
    possible.
  - Update any `@compas/code-gen/experimental` import to `@compas/code-gen`

#### Features

- feat(code-gen/experimental: few percent speedup of array validation
  [`26fb77`](https://github.com/compasjs/compas/commit/26fb77938c754cbeb3641698df25d02c4514a7dc)
- feat(code-gen/experimental): generate serializable query keys in the
  react-query wrapper
  [`8d74da`](https://github.com/compasjs/compas/commit/8d74da0dfa4bc5a331b08fe1424c3b7913443d2c)
- feat(code-gen/experimental): generate type docs strings as JSDoc blocks
  [`a94ee5`](https://github.com/compasjs/compas/commit/a94ee518f0350f1e886a31faa57c97fdc0cd9762)
- feat(code-gen): allow CRUD generation for entities with file relations
  [`727b50`](https://github.com/compasjs/compas/commit/727b5041773e0978cbe5c57b0195ecc83d9400f9)

#### Bug fixes

- fix(code-gen/experimental): correctly resolve code-gen version when generating
  OpenAPI specs
  [`28fa44`](https://github.com/compasjs/compas/commit/28fa445cf51996e5f2184993838228e328a86dcc)

#### Other

- chore: cleanup release notes and changelogs
  [`143743`](https://github.com/compasjs/compas/commit/14374390606bc3e3a66c7848cc3873ece8d622ad)

#### Dependency updates

- build(deps): bump tar from 6.1.13 to 6.1.14
  ([#2547](https://github.com/compasjs/compas/pull/2547))
  - [Release notes](https://github.com/isaacs/node-tar/releases)
- build(deps): bump pino from 8.11.0 to 8.12.1
  ([#2546](https://github.com/compasjs/compas/pull/2546),
  [#2552](https://github.com/compasjs/compas/pull/2552))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump @babel/core from 7.21.4 to 7.21.8
  ([#2549](https://github.com/compasjs/compas/pull/2549))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.321.1 to 3.327.0
  ([#2558](https://github.com/compasjs/compas/pull/2558))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/eslint-parser from 7.21.3 to 7.21.8
  ([#2550](https://github.com/compasjs/compas/pull/2550))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.321.1 to 3.327.0
  ([#2557](https://github.com/compasjs/compas/pull/2557))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump eslint-plugin-jsdoc from 43.1.1 to 43.2.0
  ([#2560](https://github.com/compasjs/compas/pull/2560))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump eslint from 8.39.0 to 8.40.0
  ([#2562](https://github.com/compasjs/compas/pull/2562))
  - [Release notes](https://github.com/eslint/eslint/releases)

### [v0.0.249](https://github.com/compasjs/compas/releases/tag/v0.0.249)

#### Breaking changes

- feat(code-gen): combine files & body handling when body is multipart
  [`1af5f7`](https://github.com/compasjs/compas/commit/1af5f7d9a87552076c47f76e7639b0a637492547)
  - The open api importer is not compatible anymore with 'legacy' code-gen,
    please migrate to experimental code-gen.
  - Rewrite of FormData handling in the 'experimental' api clients, check the
    new generate output and retest your usages of features using multipart
    bodies / files.
  - In the near future, we will fully combine `files` & `body` handling for the
    backends as well.
- feat(cli,code-gen): remove `compas visualise`
  [`4c6784`](https://github.com/compasjs/compas/commit/4c67841a17be2ce89073145eea2e52d32721c2b1)
  - Use the 'includeEntityDiagram' option of the database generator instead.

#### Features

- feat(store): automatically create migration table if not exists
  [`9496b1`](https://github.com/compasjs/compas/commit/9496b11fa19e9e517ae4a14432f87ed4d4653bf3)
- feat(code-gen): include docs & infer object type in openapi importer
  [`a67b38`](https://github.com/compasjs/compas/commit/a67b383dce6a606acbb2b18ae487a53e8bb6bda0)
- feat(cli): add code-mod to convert api clients to experimental code-gen
  [`0a3ba6`](https://github.com/compasjs/compas/commit/0a3ba6e2233a24e15e0268bdf37ba2c7b956859e)

#### Bug fixes

- fix(code-gen/experimental): use anyOf#discriminant in JS validators
  [`3fa324`](https://github.com/compasjs/compas/commit/3fa324f983589fa26b6664a1304a6cc8687f75f9)
- fix(code-gen): correct url trimming for openapi imports
  [`f64593`](https://github.com/compasjs/compas/commit/f6459340f6e1cce003d403b69898e50b0ce5d3f0)
- fix(code-gen/experimental): don't generate react-query wrapper if query, body
  or files are not objects
  [`fb2b2d`](https://github.com/compasjs/compas/commit/fb2b2d9fb2ea2762d2b3a8ca373e048aacebb399)

#### Other

- chore(code-gen/experimental): remove old README.md
  [`c96bc4`](https://github.com/compasjs/compas/commit/c96bc400ac596289aab7f2317ce0c1d7173ac489)
- chore(code-gen/experimental): update test helpers
  [`1bffb3`](https://github.com/compasjs/compas/commit/1bffb3d317a860673939d137c26dd91efabcdbc2)
- chore(examples): align example APP_NAME values
  [`f78959`](https://github.com/compasjs/compas/commit/f7895983655c5d822f4c3c98dc9c381b1664d14a)
- chore(code-gen/experimental): add e2e crud tests
  [`64d07c`](https://github.com/compasjs/compas/commit/64d07ce6a4b8e01305fcf65bdab5963f4a194074)
- chore(generate): parallelize example generation
  [`f01e64`](https://github.com/compasjs/compas/commit/f01e64fbfd73d85c689bc726921181a14a43e4b3)
- chore(code-gen/experimental): add crud nested tests
  [`61f419`](https://github.com/compasjs/compas/commit/61f419af50bc29620dfe5ca00b75ec02b1b3663c)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 43.0.7 to 43.1.1
  ([#2531](https://github.com/compasjs/compas/pull/2531))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump file-type from 18.2.1 to 18.3.0
  ([#2535](https://github.com/compasjs/compas/pull/2535))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump sharp from 0.32.0 to 0.32.1
  ([#2541](https://github.com/compasjs/compas/pull/2541))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.317.0 to 3.321.1
  ([#2538](https://github.com/compasjs/compas/pull/2538))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.317.0 to 3.321.1
  ([#2539](https://github.com/compasjs/compas/pull/2539))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### Previous releases

See the
[history](https://github.com/compasjs/compas/blob/eaa62289e64516149a64b814ad36403c9316f313/changelog.md)
for earlier changelogs (< v0.0.249).
