---
editLink: false
---

# Changelog

### [v0.0.246](https://github.com/compasjs/compas/releases/tag/v0.0.246)

#### Breaking changes

- chore: change the minimum supported version to Node.js 18
  ([#2506](https://github.com/compasjs/compas/pull/2506))
  [`354b15`](https://github.com/compasjs/compas/commit/354b15d82d106170c3d1eb10e8d427dcf103bbc1)
  - Dropped support for Node.js 16

#### Features

- feat(server): always log the structured request information in the log
  middleware
  [`1a4716`](https://github.com/compasjs/compas/commit/1a4716f63673bc34f9b238a88a14be50ff62e96f)
- feat(code-gen/experimental): support custom readable types
  [`1f5c99`](https://github.com/compasjs/compas/commit/1f5c99214272fbcfbb593d8c32489fa808b87a78)
  - Closes [#2472](https://github.com/compasjs/compas/pull/2472)

#### Bug fixes

- fix(code-gen/experimental): satisfy typescript when working with upload files
  in the api clients
  [`d6544a`](https://github.com/compasjs/compas/commit/d6544a82d2db4a73d0d58bda5f8f868a78750806)
- fix(code-gen/experimental): make sure array based filters in crud are optional
  [`f26766`](https://github.com/compasjs/compas/commit/f267666f999bcf88c261b8fe2e79a9ad0a7a96ed)

#### Other

- examples(crud-simple-todo): init example
  [`b10b20`](https://github.com/compasjs/compas/commit/b10b20b21c3d513e08cc127149c1b4078fde62bb)
- chore: fix example generation on CI
  [`9b6c14`](https://github.com/compasjs/compas/commit/9b6c146bb6c94f81554a928de0a11613192c3477)
- examples(crud-simple-todo): fix flaky tests
  [`6be87f`](https://github.com/compasjs/compas/commit/6be87ffcfc51ed1a62cc159eaadd73a4cbc1b2de)
- chore(code-gen/experimental): copy CRUD partials from legacy
  [`d75aa2`](https://github.com/compasjs/compas/commit/d75aa288d03a6d49a56cefb501c143578473d80b)

### [v0.0.245](https://github.com/compasjs/compas/releases/tag/v0.0.245)

#### Bug fixes

- fix(store): stricter session token checks before verify and decode
  [`28282a`](https://github.com/compasjs/compas/commit/28282a66775db4664c65c33c31f80d6dbd6bd786)

### [v0.0.244](https://github.com/compasjs/compas/releases/tag/v0.0.244)

#### Bug fixes

- fix(store): stricter checks on missing tokens
  [`df6cfb`](https://github.com/compasjs/compas/commit/df6cfb2c028bebbd4366426a24d23daddffb9e2d)

#### Dependency updates

- build(deps): bump koa from 2.14.1 to 2.14.2
  ([#2503](https://github.com/compasjs/compas/pull/2503))
  - [Release notes](https://github.com/koajs/koa/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.309.0 to 3.312.0
  ([#2502](https://github.com/compasjs/compas/pull/2502))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.309.0 to 3.312.0
  ([#2504](https://github.com/compasjs/compas/pull/2504))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.0.243](https://github.com/compasjs/compas/releases/tag/v0.0.243)

#### Features

- feat(code-gen/experimental): separate common wrapper file
  [`d2c76d`](https://github.com/compasjs/compas/commit/d2c76d080bccabdbd826e8e9d9824e18f675ba56)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 40.1.2 to 41.1.1
  ([#2497](https://github.com/compasjs/compas/pull/2497),
  [#2501](https://github.com/compasjs/compas/pull/2501))
  - Major version bump
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.0.242](https://github.com/compasjs/compas/releases/tag/v0.0.242)

#### Features

- feat(eslint-plugin): enforce multiline JSDoc description indentation
  [`5c108a`](https://github.com/compasjs/compas/commit/5c108abb9289a7263240433702eb398662e18b35)
- feat(eslint-plugin): enforce asterisks on each line of JSDoc blocks
  [`1a23f6`](https://github.com/compasjs/compas/commit/1a23f6bc2f2ebea87f7baef27effeb11cea30bf8)
- feat(eslint-plugin): disallow hyphen before param description in JSDoc blocks
  [`8a543f`](https://github.com/compasjs/compas/commit/8a543f66d50fae4e2809870f7f31151e1a12ba2f)
- feat(eslint-plugin): require a return type if the `@returns` tag is present in
  JSDoc blocks
  [`3e54b1`](https://github.com/compasjs/compas/commit/3e54b172df67204f4520a86bc7ab144451ad1a49)
- feat(eslint-plugin): check duplicate export names
  [`718f8e`](https://github.com/compasjs/compas/commit/718f8ee15a556fa69693ddd368e8e6c474a72aa8)
- feat(eslint-plugin): stricter checks on existence of imported symbols
  [`f6096f`](https://github.com/compasjs/compas/commit/f6096f201167087f693efedf8172624e15fc67f9)
- feat(eslint-plugin): report event-name error on empty string
  [`8b26de`](https://github.com/compasjs/compas/commit/8b26deaa40053b624b38c88dc12d06b45dfa0611)
- feat(compas): remove all exports, include all packages
  [`9043fc`](https://github.com/compasjs/compas/commit/9043fc449cdb2c7a9fd44d997a70ab070c5e55bd)

#### Bug fixes

- fix(code-gen/experimental): allow custom `.min` & `.max` values greater than
  normal int sizes
  [`89f829`](https://github.com/compasjs/compas/commit/89f829d46f96cd91101c598166cbddfbb38dba0a)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 40.1.1 to 40.1.2
  ([#2495](https://github.com/compasjs/compas/pull/2495))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.299.0 to 3.309.0
  ([#2494](https://github.com/compasjs/compas/pull/2494))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.299.0 to 3.309.0
  ([#2493](https://github.com/compasjs/compas/pull/2493))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.0.241](https://github.com/compasjs/compas/releases/tag/v0.0.241)

#### Breaking changes

- feat(code-gen/experimental): add fetch api client support, flatten accepted
  properties in react-query wrapper
  ([#2490](https://github.com/compasjs/compas/pull/2490))
  [`7b5c44`](https://github.com/compasjs/compas/commit/7b5c44f7b7c3004f7b48dd8c04dfc2529315a515)
  - Closes [#2471](https://github.com/compasjs/compas/pull/2471)
  - Closes [#2489](https://github.com/compasjs/compas/pull/2489)
  - The generated react-query wrapper for the experimental Axios based apiClient
    now accepts a flattened object. Internally, this is split back out again in
    to the `params`, `query`, `body` and `files` objects to pass in to the
    apiClient.
- feat(store): change queue `maxRetryCount` to 2
  [`04c957`](https://github.com/compasjs/compas/commit/04c9574efe29b5a33301a14f770a8d60175f267f)
  - The default number of retries goes down from 5 to 2 times. Most of the time
    if a job fails, it will fail on all retries as well. If you have a flaky
    job, you may want to catch all errors, and let the job schedule itself
    another time, instead of relying on auto retries.

#### Features

- feat(cli): only try to load commands from files that statically have an
  exported `cliDefinition`
  [`219644`](https://github.com/compasjs/compas/commit/219644d047c5104f181a7bbd542f3e4a8496b205)
- feat(code-gen/experimental): ensure unique name for inline CRUD items
  [`201c03`](https://github.com/compasjs/compas/commit/201c0317a1d92de6942c4ffca5ca5cc13312fd2e)
- feat(code-gen/experimental): consistent generate api client paths without
  leading slash
  [`65ad67`](https://github.com/compasjs/compas/commit/65ad67a07d9e2ea424129d9efb2925ed88c17d1f)
- feat(code-gen/experimental): cleanup tests, document ways of testing and
  implement utils
  [`29717d`](https://github.com/compasjs/compas/commit/29717d90ab120f0888f3089ae000657b30b00678)

#### Bug fixes

- fix(store): remove quality support for resized gifs
  [`0e13d6`](https://github.com/compasjs/compas/commit/0e13d66dba4fa0e5f611c152a72b61917c08329b)
- fix(code-gen/experimental): disable `enableQueries` in the route structure
  [`fc8d57`](https://github.com/compasjs/compas/commit/fc8d57955a65c934ee9fe76788ce7072629d3137)
- fix(store): catch any error when cleaning up the test PG database
  [`52417b`](https://github.com/compasjs/compas/commit/52417b9da32152013305a94bb65d1ace2125274c)

#### Other

- chore(docs): add some contents in entity structure creation
  [`d55cfa`](https://github.com/compasjs/compas/commit/d55cfafbcd587e5a1836d071efbabae88659e742)
- chore(docs): add some contents about crud generation
  [`ff2222`](https://github.com/compasjs/compas/commit/ff22220ba9175d4a5db441b898363bc142943cc2)
- chore(docs): add usage koa-router and axios-api-client
  [`f89839`](https://github.com/compasjs/compas/commit/f8983926fb898882ac129bf588f9210ac3406396)
- chore(examples): replace 'default' and 'with-auth' examples w/ the
  `-experimental` ones
  [`e57394`](https://github.com/compasjs/compas/commit/e57394a07800d68580346faf06ab6aec3519eaf3)
- chore(docs): fix sidebar names for the examples
  [`fb6abe`](https://github.com/compasjs/compas/commit/fb6abea8e348ec077e7930f13ccab6b51d93427b)
- chore(docs): small improvements and added references to generated koa router
  usage
  [`451873`](https://github.com/compasjs/compas/commit/4518736574dc33f11c2f142f852a4d04983d7483)
- chore(docs): clean up old code-gen docs
  [`40d20b`](https://github.com/compasjs/compas/commit/40d20b9e398955be7fceabafc564e896546c5e8d)
- chore(docs): re-add generated query usage
  [`77a355`](https://github.com/compasjs/compas/commit/77a3555ca7224cd88c25524f08b5ecb9d9826705)
- chore(tests): cleanup .cache directory usage
  [`030185`](https://github.com/compasjs/compas/commit/030185765bd7569579ce5352ec48594b83796bbc)
- chore(code-gen/experimental): add some tests, run and satisfy tsc
  [`ee9b7a`](https://github.com/compasjs/compas/commit/ee9b7a5b36b30a05879eb96a6c3d520caa36bc82)

#### Dependency updates

- build(deps): bump sharp from 0.31.3 to 0.32.0
  ([#2455](https://github.com/compasjs/compas/pull/2455))
  - Major version bump
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump prettier from 2.8.6 to 2.8.7
  ([#2458](https://github.com/compasjs/compas/pull/2458))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.295.0 to 3.299.0
  ([#2456](https://github.com/compasjs/compas/pull/2456))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.295.0 to 3.299.0
  ([#2454](https://github.com/compasjs/compas/pull/2454))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @types/koa from 2.13.5 to 2.13.6
  ([#2463](https://github.com/compasjs/compas/pull/2463))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 8.36.0 to 8.38.0
  ([#2467](https://github.com/compasjs/compas/pull/2467),
  [#2492](https://github.com/compasjs/compas/pull/2492))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump @babel/core from 7.21.3 to 7.21.4
  ([#2481](https://github.com/compasjs/compas/pull/2481))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint-plugin-jsdoc from 40.1.0 to 40.1.1
  ([#2477](https://github.com/compasjs/compas/pull/2477))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.0.240](https://github.com/compasjs/compas/releases/tag/v0.0.240)

#### Breaking changes

- fix(store): correctly send untransformed file if the transform is not yet
  created in `fileSendTransformedImageResponse`
  [`1fb24c`](https://github.com/compasjs/compas/commit/1fb24c0f70458a6648bbc41c42ec6de78833c8dd)
  - Compas could have incorrectly send a random image when the necessary
    transform was not found. This only affects you when you use
    `fileSendTransformedImageResponse`. We now should correctly send the
    original file on the first load.

#### Other

- chore(code-gen/experimental): satisfy Typescript
  [`a496d2`](https://github.com/compasjs/compas/commit/a496d260feec3ab6aa07535bd0729f873799222b)

#### Dependency updates

- build(deps): bump prettier from 2.8.5 to 2.8.6
  ([#2446](https://github.com/compasjs/compas/pull/2446))
  - [Release notes](https://github.com/prettier/prettier/releases)

### [v0.0.239](https://github.com/compasjs/compas/releases/tag/v0.0.239)

#### Features

- feat(code-gen/experimental): add discriminant support to anyOf
  ([#2448](https://github.com/compasjs/compas/pull/2448))
  [`ea502f`](https://github.com/compasjs/compas/commit/ea502f11813d0b4988b6312af70d78bc78cb9bb6)

#### Bug fixes

- fix(code-gen/experimental): ignore relations when serializing api structure
  [`a86a5b`](https://github.com/compasjs/compas/commit/a86a5bafb6ae6a16d0eb472b66c75277a0781455)

#### Other

- chore(code-gen/experimental): generate more unique variable names in the
  validators
  [`020ac5`](https://github.com/compasjs/compas/commit/020ac59bf85e920f2d25d18a3b5de0e50cfd1916)

### [v0.0.238](https://github.com/compasjs/compas/releases/tag/v0.0.238)

#### Bug fixes

- fix(store): use `.execRaw` internally on file-send and file-jobs
  [`e0af17`](https://github.com/compasjs/compas/commit/e0af17d426c4d9bd9d51111306293422165a56a7)

### [v0.0.237](https://github.com/compasjs/compas/releases/tag/v0.0.237)

#### Bug fixes

- fix(store): export 'jobFileTransformImage'
  [`022f99`](https://github.com/compasjs/compas/commit/022f99a2b9d484626395eae3b8a8e5ec7f667e21)

### [v0.0.236](https://github.com/compasjs/compas/releases/tag/v0.0.236)

#### Breaking changes

- feat(store): migrate image transform to a job
  [`22eea4`](https://github.com/compasjs/compas/commit/22eea42be2d20adbe5dd998deaba2e9aa297aa4d)
  - `fileSendTransformedImageResponse` now adds jobs to the queue instead of
    transforming in request. Add
    `{ "compas.file.transformImage": jobFileTransformImage(s3Client), }` to your
    queue handlers.

#### Features

- feat(code-gen): require at least a single oneOf value
  [`f7322c`](https://github.com/compasjs/compas/commit/f7322cbddfa12d9b1f59ea86820aff9f27f03986)

#### Other

- chore(changelog): double down on ignoring dev deps updates
  [`f9c8c0`](https://github.com/compasjs/compas/commit/f9c8c0d2e4718d8e262c7c10ee51413f8d72ff2f)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 40.0.2 to 40.1.0
  ([#2428](https://github.com/compasjs/compas/pull/2428),
  [#2436](https://github.com/compasjs/compas/pull/2436))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump eslint-config-prettier from 8.7.0 to 8.8.0
  ([#2443](https://github.com/compasjs/compas/pull/2443))
  - [Release notes](https://github.com/prettier/eslint-config-prettier/releases)
- build(deps): bump prettier from 2.8.4 to 2.8.5
  ([#2439](https://github.com/compasjs/compas/pull/2439))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.290.0 to 3.295.0
  ([#2442](https://github.com/compasjs/compas/pull/2442))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.290.0 to 3.295.0
  ([#2444](https://github.com/compasjs/compas/pull/2444))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.0.235](https://github.com/compasjs/compas/releases/tag/v0.0.235)

#### Features

- feat(store): support empty updates in the generated update helper
  [`b2c546`](https://github.com/compasjs/compas/commit/b2c546386b0475ac3456e1b8a5093030bc5bdf39)

#### Bug fixes

- fix(code-gen/experimental): handle string min(0) in combination with optional
  in the validators
  [`a04a54`](https://github.com/compasjs/compas/commit/a04a5483bb87d7b416788b902258da7db6faac2c)

#### Dependency updates

- build(deps): bump @aws-sdk/client-s3 from 3.279.0 to 3.290.0
  ([#2414](https://github.com/compasjs/compas/pull/2414),
  [#2421](https://github.com/compasjs/compas/pull/2421))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.279.0 to 3.290.0
  ([#2413](https://github.com/compasjs/compas/pull/2413),
  [#2419](https://github.com/compasjs/compas/pull/2419))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/core from 7.21.0 to 7.21.3
  ([#2423](https://github.com/compasjs/compas/pull/2423))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint from 8.35.0 to 8.36.0
  ([#2416](https://github.com/compasjs/compas/pull/2416))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 40.0.1 to 40.0.2
  ([#2418](https://github.com/compasjs/compas/pull/2418))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @babel/eslint-parser from 7.19.1 to 7.21.3
  ([#2424](https://github.com/compasjs/compas/pull/2424))
  - [Release notes](https://github.com/babel/babel/releases)

### [v0.0.234](https://github.com/compasjs/compas/releases/tag/v0.0.234)

#### Features

- feat(store): improve error handling around migrations
  [`73c2dd`](https://github.com/compasjs/compas/commit/73c2dd7f39956fa55678d7d5b526c874e7a1d8c2)

#### Bug fixes

- fix(store): remove cron jobs created via manual reruns
  [`0cc953`](https://github.com/compasjs/compas/commit/0cc953c49d21a60db0a9128705afdb634cd8983e)
- fix(code-gen/experimental): correct validator pattern explanation for
  `timeOnly` dates
  [`5ca28b`](https://github.com/compasjs/compas/commit/5ca28baaa003feeb107fa1fc2dd37237b30c784c)

#### Other

- chore(docs): add boolean, number and string to build structure
  [`28ec7e`](https://github.com/compasjs/compas/commit/28ec7e79ca539210555c220daec3625773d6ead6)
- chore(docs): add the rest to types and validators
  [`920a29`](https://github.com/compasjs/compas/commit/920a29b5977fea2c73c2a8304255364b12eab8ff)
- chore(docs): scaffold build-structure pages
  [`f143c3`](https://github.com/compasjs/compas/commit/f143c3704b8378195ca75967afb36d7d749e3b1b)
- chore(code-gen/experimental): update todo list
  [`fb00a6`](https://github.com/compasjs/compas/commit/fb00a6beda630941599b9c67fd27748f829c6494)
- chore(docs): add route definition docs
  [`49477a`](https://github.com/compasjs/compas/commit/49477acef135132cc8f978d6781095c7e723260a)

#### Dependency updates

- build(deps): bump cron-parser from 4.8.0 to 4.8.1
  ([#2405](https://github.com/compasjs/compas/pull/2405))
  - [Release notes](https://github.com/harrisiirak/cron-parser/releases)
- build(deps): bump postgres from 3.3.3 to 3.3.4
  ([#2406](https://github.com/compasjs/compas/pull/2406))
  - [Release notes](https://github.com/porsager/postgres/releases)

### [v0.0.233](https://github.com/compasjs/compas/releases/tag/v0.0.233)

#### Bug fixes

- fix(store): always set an empty buffer as the response
  [`5bd03c`](https://github.com/compasjs/compas/commit/5bd03c5c14064b53e81eac562c717becb11a6466)

### [v0.0.232](https://github.com/compasjs/compas/releases/tag/v0.0.232)

#### Breaking changes

- feat(code-gen): remove cross-references from OpenAPI importer
  [`c18ca2`](https://github.com/compasjs/compas/commit/c18ca2f2f9033d97b3e947909582ee366c8eed47)
  - The OpenAPI importer did always cross-reference routes to the default group.
    This allowed you to only generate on your default group and still get all
    the types and routes from a specification. This behaviour is now removed.
    Only impacts when the 'default' group is also used in `enabledGroups` in a
    generate call.

#### Features

- feat(code-gen): add date 'dateOnly' support in the open api importer
  [`9e45db`](https://github.com/compasjs/compas/commit/9e45db05fc58a3cf0e862324ebe6f1aef439875f)
- feat(cli): consistent printing when running test setup and teardown
  [`4a9e98`](https://github.com/compasjs/compas/commit/4a9e9816fac7421e92b548a931bce396a4b855c7)
- feat(code-gen): more descriptive extend names
  [`e113e2`](https://github.com/compasjs/compas/commit/e113e28e20795879354fd369216f2ea46d1148c0)

#### Bug fixes

- fix(code-gen): correctly handling existing trailing slashes in the open api
  spec
  [`a04b3b`](https://github.com/compasjs/compas/commit/a04b3bd7b993918e7765f7b1a4e935b743b6a4ed)
- fix(code-gen): early return if a component can't be found in the OpenAPI
  importer
  [`e52cc5`](https://github.com/compasjs/compas/commit/e52cc5fe4330335974da30db80355ca09255e565)

#### Dependency updates

- build(deps): bump cron-parser from 4.7.1 to 4.8.0
  ([#2401](https://github.com/compasjs/compas/pull/2401))
  - [Release notes](https://github.com/harrisiirak/cron-parser/releases)
- build(deps): bump eslint-config-prettier from 8.6.0 to 8.7.0
  ([#2402](https://github.com/compasjs/compas/pull/2402))
  - [Release notes](https://github.com/prettier/eslint-config-prettier/releases)

### [v0.0.231](https://github.com/compasjs/compas/releases/tag/v0.0.231)

#### Features

- feat(code-gen/experimental): add filtered 'unknownKeys' to object strict
  validation error
  [`d976f4`](https://github.com/compasjs/compas/commit/d976f417d56b3190393378dea82be15a02aa856a)
- feat(code-gen/experimental): make logger optional in `new Generator()`
  [`83ff74`](https://github.com/compasjs/compas/commit/83ff74368fb8b1622eb7905c16937ae9beabbece)

#### Bug fixes

- fix(code-gen/experimental): correct serialization of api structure
  [`bda488`](https://github.com/compasjs/compas/commit/bda488b08e9afe0753688aa407c3bb8a1d425d82)
- fix(code-gen/experimental): keep `.convert()` in crud to maintain
  compatibility with old code-gen
  [`ea367b`](https://github.com/compasjs/compas/commit/ea367b897b8d8b7407da43ae9cc9ac45e4423a57)

#### Other

- chore(benchmark): cleanup validator benchmark
  [`8baf41`](https://github.com/compasjs/compas/commit/8baf4111d950e5e5a78d2515285bd293992dfb87)
- chore: fix package.json
  [`11fcf7`](https://github.com/compasjs/compas/commit/11fcf7bb8c0a4f41a3b173cd4a3466d479376207)
- chore: install a version of lodash as dev dep
  [`bea627`](https://github.com/compasjs/compas/commit/bea627be0db546d223af523ee11fd39fe5c44e04)
- chore(docs): expand introduction
  [`e4dc66`](https://github.com/compasjs/compas/commit/e4dc66de55c4c554a85ef2ebc65be55047bf96c2)
- chore(docs): add installation to generator introduction
  [`a6ff19`](https://github.com/compasjs/compas/commit/a6ff19224a8a1d7d23858d666dfc433eb277a81f)
- chore(docs): simplify api client generator logger usage
  [`f6a01f`](https://github.com/compasjs/compas/commit/f6a01fe21b28e6ea571195ca0c2c67bdc8480cb1)
- chore(docs): start with building your own types and validators
  [`4c7972`](https://github.com/compasjs/compas/commit/4c79727fa09b4b548d99d7c37e06cfbb5b124693)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 40.0.0 to 40.0.1
  ([#2397](https://github.com/compasjs/compas/pull/2397))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.0.230](https://github.com/compasjs/compas/releases/tag/v0.0.230)

#### Features

- feat(code-gen/experimental): add uuid conversion support in the validator
  [`13e381`](https://github.com/compasjs/compas/commit/13e3816f8d3f7b1f7d93a715f8c75df730e1a802)

### [v0.0.229](https://github.com/compasjs/compas/releases/tag/v0.0.229)

#### Bug fixes

- fix(code-gen/experimental): split `wrapQueryPart` from `common/database.js`
  [`b334ce`](https://github.com/compasjs/compas/commit/b334ce78f277baa1108ac95a97507b71f2e45bcc)

### [v0.0.228](https://github.com/compasjs/compas/releases/tag/v0.0.228)

#### Bug fixes

- fix(code-gen/experimental): correct database validation of 'orderBySpec'
  [`0ef5d6`](https://github.com/compasjs/compas/commit/0ef5d6f7c48f8511a99b48a415141737d589458a)
- fix(code-gen/experimental): correct type generation of dates
  [`2966eb`](https://github.com/compasjs/compas/commit/2966eb3e431de6ae04c6aaa94753630bf3693e95)
- fix(code-gen/experimental): use form-data package in Node.js axios api client
  [`9eb8cb`](https://github.com/compasjs/compas/commit/9eb8cb43a9f453e4cdad7a1a3251eefa80974737)

### [v0.0.227](https://github.com/compasjs/compas/releases/tag/v0.0.227)

#### Features

- feat(code-gen/experimental): better handling of regenerating on the same
  structure
  [`867942`](https://github.com/compasjs/compas/commit/8679426137f63cfb5e1c2168fefbde98ff23e557)

#### Bug fixes

- fix(code-gen/experimental): various fixes
  [`8f54ac`](https://github.com/compasjs/compas/commit/8f54ac41060db7dfc8e07d24d9db2e5eb1f7ad60)
- fix(store): throw error if an empty update object is given in the generator
  helper
  [`313fd7`](https://github.com/compasjs/compas/commit/313fd7ddad65f6ba9921573b9467aedd3c633d28)
- fix(code-gen/experimental): correctly handle allowNull for 'anyOf' values in
  the validators
  [`61f5bc`](https://github.com/compasjs/compas/commit/61f5bcbe8c2435e41f04e1ae69dc49bc28e2326a)
- fix(code-gen/experimental): quote object keys in generated types
  [`707d6a`](https://github.com/compasjs/compas/commit/707d6a77d0ea9930ee9a707a636ef757d6825a65)

#### Other

- chore: regenerate type definitions
  [`5d92c8`](https://github.com/compasjs/compas/commit/5d92c8d1d430272d165fb77669758ac40d3ab630)

### [v0.0.226](https://github.com/compasjs/compas/releases/tag/v0.0.226)

#### Features

- feat(cli): improve errors when loading cli definitions
  [`997bb7`](https://github.com/compasjs/compas/commit/997bb7e8b51f8115a4b4273a477c1015829ee626)
- feat(code-gen/experimental): add router response validators
  [`9eeafd`](https://github.com/compasjs/compas/commit/9eeafd2d4b4ca4926fd079954c5d0fede392667d)
- feat(code-gen/experimental): various fixes around ts-axios. Remove response
  validation in the ts axios clients
  [`130cda`](https://github.com/compasjs/compas/commit/130cdae877c52d487ae5959e0cc2a2991c2f8512)
- feat(code-gen): add `loadApiStructureFromOpenAPI`
  [`6bacf0`](https://github.com/compasjs/compas/commit/6bacf01b7c55920739c6bab357b84cbff0ba81c4)

#### Bug fixes

- fix(code-gen/experimental): correct open-api-importer compatibility
  [`666968`](https://github.com/compasjs/compas/commit/6669684370d213d7116413678eae563d647979c7)

#### Other

- chore(docs): link example readme's to the docs
  [`171d10`](https://github.com/compasjs/compas/commit/171d10e1fefbef746b4d0b9e1116aa15d70880f0)
- chore(docs): cleanup structure, add generators pages
  [`60d115`](https://github.com/compasjs/compas/commit/60d1156ee4288da16fcc2de62759a581ee1108d2)
- chore(docs): add a new generators introduction and write about available
  targets
  [`99ebd4`](https://github.com/compasjs/compas/commit/99ebd4606b009b1b5990fa9a18793ddb34a53a67)
- chore(docs): add note about `outputDirectory` in generator targets
  [`5757ae`](https://github.com/compasjs/compas/commit/5757aee7ac46d61269f53deeb5cc29e41c677e01)
- chore(docs): add api clients document
  [`2e1cd4`](https://github.com/compasjs/compas/commit/2e1cd41e38fb2fa7abfd2937d16ee1302ced1c02)

#### Dependency updates

- build(deps): bump pino from 8.10.0 to 8.11.0
  ([#2379](https://github.com/compasjs/compas/pull/2379))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.264.0 to 3.279.0
  ([#2383](https://github.com/compasjs/compas/pull/2383),
  [#2386](https://github.com/compasjs/compas/pull/2386))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.264.0 to 3.279.0
  ([#2384](https://github.com/compasjs/compas/pull/2384))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump eslint from 8.34.0 to 8.35.0
  ([#2388](https://github.com/compasjs/compas/pull/2388))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump @babel/core from 7.20.12 to 7.21.0
  ([#2375](https://github.com/compasjs/compas/pull/2375))
  - [Release notes](https://github.com/babel/babel/releases)

### [v0.0.225](https://github.com/compasjs/compas/releases/tag/v0.0.225)

#### Bug fixes

- fix(code-gen): correctly preprocess `T.extendNamedObject().relations()`
  [`7dd510`](https://github.com/compasjs/compas/commit/7dd510400916a539a4114fc50f9231c3044bed02)

#### Dependency updates

- build(deps): bump file-type from 18.2.0 to 18.2.1
  ([#2370](https://github.com/compasjs/compas/pull/2370))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)

### [v0.0.224](https://github.com/compasjs/compas/releases/tag/v0.0.224)

The experimental code generators are ready to be tested! See the
[migration guide](https://compasjs.com/releases/code-gen-migration.html) on how
to upgrade.

#### Breaking changes

- feat(code-gen): replace `app.addRelations` with
  `T.extendNamedObject().relations()`
  [`c29965`](https://github.com/compasjs/compas/commit/c29965773b96ff7a21b5106a8e1d1226caa47ac9)
  - `App#addRelations` is removed, use
    `T.extendNamedObject(T.reference(...)).relations(...relations)`.

#### Features

- feat(code-gen): utils expand inferred array error
  ([#2357](https://github.com/compasjs/compas/pull/2357))
  [`bd94c4`](https://github.com/compasjs/compas/commit/bd94c4ce4dcbb012b77f005f22b9ed0c60ffbbfc)
- feat(code-gen/experimental): add `T.any().implementations()` support
  [`a9f010`](https://github.com/compasjs/compas/commit/a9f01026d1658f4f1ce36f7ed1996962c50dd6e2)
- feat(code-gen/experimental): add specific `T.file()` implementations
  [`62f1cb`](https://github.com/compasjs/compas/commit/62f1cb9fbf28bd3feef07cd7e3cde9d9392892cf)
- feat(code-gen/experimental): add support to force form-data body
  [`88d358`](https://github.com/compasjs/compas/commit/88d358d5e962b0f21c7c9d5effe134ab23447c9c)
- feat(code-gen/experimental): consistent internal target formatting
  [`703e6c`](https://github.com/compasjs/compas/commit/703e6c266a5ce834a497c3428388a2108c71fc38)
- feat(code-gen/experimental): accept requestConfig in react-query hooks, add
  options to skip response validation
  [`7725a6`](https://github.com/compasjs/compas/commit/7725a61dc2423d2bf6799351bc9b44981c4f036d)
- feat(code-gen/experimental): add custom validation on the allowed target
  combinations
  [`9e63d9`](https://github.com/compasjs/compas/commit/9e63d9ea24975c5b832285e45f457bb90091bbf8)
- feat(code-gen/experimental): add check for custom relation fields that are
  optional
  [`6c8dd2`](https://github.com/compasjs/compas/commit/6c8dd27013877fc3c87ef50fbd166d3a31f0bdda)
- feat(code-gen/experimental): decode uri params in the router generator
  [`f937ad`](https://github.com/compasjs/compas/commit/f937ad099171dd752fe8abfb620784234ecf4cfc)
- feat(code-gen/experimental): improve some validation errors
  [`54b670`](https://github.com/compasjs/compas/commit/54b670da955631cef55f6d2b7fdc25ea84b285c1)
- feat(cli): use @compas/code-gen/experimental
  [`783343`](https://github.com/compasjs/compas/commit/783343ed0cee7a9da9bf5af9f2ad9be42d73a65d)
- feat(code-gen/experimental): reuse type names if no target or validator
  specific changes are necessary
  [`b0ccd1`](https://github.com/compasjs/compas/commit/b0ccd1fe1986f845a0af69b0c2925753758354f3)
- feat(code-gen/experimental): always allow extra object keys
  [`86c9db`](https://github.com/compasjs/compas/commit/86c9dba4366f3781f5adf531919581a75bbd26f1)
- feat(code-gen): stabilize `T.extendNamedObject()` generated name
  [`eafd5d`](https://github.com/compasjs/compas/commit/eafd5d974236c746463f691dcee804218865e63b)
- feat(code-gen/experimental): add `apiClient.responseValidation` option to
  allow loose response validation
  [`2a671d`](https://github.com/compasjs/compas/commit/2a671d660480ec0603068d29ed8b1fc96701c8fb)

#### Bug fixes

- fix(code-gen/experimental): correct printing of `else if` in validators
  [`ec7e1a`](https://github.com/compasjs/compas/commit/ec7e1a50d1402225528fa7aef05bc0653fc81215)
- fix(code-gen/experimental): various fixes, use new `T.any().implementations`
  [`06621b`](https://github.com/compasjs/compas/commit/06621b3ef06d10ef54ed903b99c3d1ad22fbe4da)
- fix(code-gen/experimental): fix `deletedAt` optionality, better typing of
  WrappedQueryPart, escape api structure
  [`a04944`](https://github.com/compasjs/compas/commit/a04944b93e681f7a839cbef828afc2fda4b90971)
- fix(code-gen/experimental): fix postgres DDL of 'deletedAt'
  [`db42db`](https://github.com/compasjs/compas/commit/db42dbc030d528695ccc7cdac9d6bb4e31f21840)

#### Other

- chore(code-gen/experimental): extract required TODO's into a list
  [`e73411`](https://github.com/compasjs/compas/commit/e73411ed61139b57707ee8e18e95f189692d8ea0)
- build(deps-dev): bump vitepress from 1.0.0-alpha.45 to 1.0.0-alpha.46
  ([#2361](https://github.com/compasjs/compas/pull/2361))
  [`5ba981`](https://github.com/compasjs/compas/commit/5ba9814829607814866788d3fc3a8c9914086549)
  - [Release notes](https://github.com/vuejs/vitepress/releases)
- docs(releases): write code-gen/experimental migration guide
  [`4a14dc`](https://github.com/compasjs/compas/commit/4a14dc0368badc964ce1494d7a8799874031793a)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 39.7.5 to 40.0.0
  ([#2345](https://github.com/compasjs/compas/pull/2345),
  [#2360](https://github.com/compasjs/compas/pull/2360))
  - Major version bump
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump pino from 8.8.0 to 8.10.0
  ([#2347](https://github.com/compasjs/compas/pull/2347),
  [#2358](https://github.com/compasjs/compas/pull/2358))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump prettier from 2.8.3 to 2.8.4
  ([#2351](https://github.com/compasjs/compas/pull/2351))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump eslint from 8.33.0 to 8.34.0
  ([#2359](https://github.com/compasjs/compas/pull/2359))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump c8 from 7.12.0 to 7.13.0
  ([#2369](https://github.com/compasjs/compas/pull/2369))
  - [Release notes](https://github.com/bcoe/c8/releases)

### [v0.0.223](https://github.com/compasjs/compas/releases/tag/v0.0.223)

#### Breaking changes

- fix(code-gen): correct `undefined` checks for react-query `options.enabled`
  [`9e863c`](https://github.com/compasjs/compas/commit/9e863c85e7bd605b9cc098e5ee7198fe7c832ff3)
  - The generated `options.enabled` will now use `!== undefined && !== null`
    instead of auto coercing to booleans. This means that `0` or an empty string
    will not disable the generated hooks
- feat(code-gen): don't apply the default names on route inputs that are
  references already
  [`bf5ae0`](https://github.com/compasjs/compas/commit/bf5ae00e76b8f35e3491edaf24879126f2ee0725)
  - If a reference (`T.reference()` is passed to `R.query`, `R.body`, `R.files`
    or `R.response`, no intermediate type is created.
    - e.g. `R.get("/", "get").response(T.reference("foo", "bar"))` previously
      always created a `AppGetResponse` type, after this change only `FooBar` is
      created and used.
  - `R.params()` only accepts a JS object or `T.object()`. This is necessary to
    validate that all params defined in the route path have a type provided.

#### Features

- feat(code-gen/experimental): generate crud readable & writable types
  [`a061da`](https://github.com/compasjs/compas/commit/a061daf4e368b88e54cbd1c9ee3936d947b3128a)
- feat(code-gen/experimental): add a clarification message to router
  notImplemented errors
  [`c30692`](https://github.com/compasjs/compas/commit/c3069295fd8e195d500c97eb6bffcec605d4130f)
- feat(code-gen/experimental): fix types in js-koa, better typescript types for
  `T.generic()`
  [`1d7687`](https://github.com/compasjs/compas/commit/1d7687a6bfaa201639ee398002e9ebcd5bdc3765)
- feat(code-gen/experimental): generate crud list route definition
  [`796d05`](https://github.com/compasjs/compas/commit/796d05ed39c387cba3e2b50a6a2013de3f88371a)
- feat(code-gen/experimental): generate all other crud route definitions
  [`0c89c5`](https://github.com/compasjs/compas/commit/0c89c5872c4d78cfd6c836138110ec5efd99710a)
- feat(code-gen/experimental): generate crud event implementations
  [`ab0839`](https://github.com/compasjs/compas/commit/ab0839992821903fea84a4fd7e1986eff63eccde)
- feat(code-gen/experimental): generate crud controller implementations
  [`e95fa1`](https://github.com/compasjs/compas/commit/e95fa177b69de6b6035b5b5cc0d7a795f713ab21)
- feat(code-gen/experimental): add openapi generator support
  [`763bcd`](https://github.com/compasjs/compas/commit/763bcde937881033ed5c727724f8a72f1ff78e32)
- feat(code-gen/experimental): various type 'fixes' in JS validators
  [`69ebff`](https://github.com/compasjs/compas/commit/69ebff2759852fbc7d52e685998cc4bd669aeb6e)
- feat(code-gen/experimental): added Typescript target support to validators
  [`981dd4`](https://github.com/compasjs/compas/commit/981dd4b70f199639af1e7e9ecfba3495ae4525d3)
- feat(code-gen/experimental): added Typescript target support to the api client
  [`d7df45`](https://github.com/compasjs/compas/commit/d7df45fe27375be34c3e5bb69ca7711ad1d2b897)
- feat(code-gen/experimental): add react-query wrapper support
  [`e74708`](https://github.com/compasjs/compas/commit/e74708f548d693c7c19b5a1966d75639a698f37b)
- feat(code-gen/experimental): enforce crud 'options.name'
  [`2d0b6a`](https://github.com/compasjs/compas/commit/2d0b6a26f4cd81ee9f6a97b345372c71f1374776)

#### Other

- chore(code-gen/experimental): update todo list
  [`d02d83`](https://github.com/compasjs/compas/commit/d02d836bab78b145309527c42d66bb073c856077)
- chore(docs): bump VitePress to v1 alpha
  ([#2343](https://github.com/compasjs/compas/pull/2343))
  [`a0721f`](https://github.com/compasjs/compas/commit/a0721fc0afc6c343a7e4f6ee3661537ef34e2e9c)
- examples(default-experimental): init template
  [`daf6f8`](https://github.com/compasjs/compas/commit/daf6f8c1b8f4848dc536dec84c6828d9f8958763)
- chore: regenerate package-lock.json
  [`da9e27`](https://github.com/compasjs/compas/commit/da9e2717f029263c3d22ff2f282d7f7a31963001)

#### Dependency updates

- build(deps): bump eslint from 8.32.0 to 8.33.0
  ([#2328](https://github.com/compasjs/compas/pull/2328))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 39.6.8 to 39.7.5
  ([#2329](https://github.com/compasjs/compas/pull/2329),
  [#2337](https://github.com/compasjs/compas/pull/2337))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump crc from 4.3.1 to 4.3.2
  ([#2334](https://github.com/compasjs/compas/pull/2334))
  - [Release notes](https://github.com/alexgorbatchev/crc/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.254.0 to 3.264.0
  ([#2342](https://github.com/compasjs/compas/pull/2342))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.254.0 to 3.264.0
  ([#2341](https://github.com/compasjs/compas/pull/2341))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.0.222](https://github.com/compasjs/compas/releases/tag/v0.0.222)

#### Features

- feat(code-gen/experimental): support database.includeEntityDiagram
  [`f3e3c1`](https://github.com/compasjs/compas/commit/f3e3c15af10b896d929a7d6f8fc467481f6ba6dd)
- feat(code-gen/experimental): support database.target.includeDDL
  [`d004c6`](https://github.com/compasjs/compas/commit/d004c683513643c2bf802601e6340a9a1f19a3bb)
- feat(code-gen/experimental): generate axios interceptor to convert to AppEror
  in the api clients
  [`e3d920`](https://github.com/compasjs/compas/commit/e3d920c8b8571305863888c7d5789bd769c8bae6)
- feat(code-gen/experimental): add crud validation
  [`83bb81`](https://github.com/compasjs/compas/commit/83bb81de8eba7516e74684c9ab9853982a4940de)

#### Bug fixes

- fix(code-gen): import `isPlainObject` when necessary for none Node.js
  environments
  [`686d23`](https://github.com/compasjs/compas/commit/686d2385f26d8d8f2f58b460435df7dc82e8bee9)
- fix(code-gen): default to `any` on unknown `requestBody` in the open api
  importer
  [`d2a27a`](https://github.com/compasjs/compas/commit/d2a27a49329eecf3bcb1500db4badd30e6df32b3)

#### Other

- examples(with-auth-experimental): init template
  [`3739d0`](https://github.com/compasjs/compas/commit/3739d0420330d025dc6ad57c75a74eb1d8d84c19)
- chore: regenerate package-lock.json
  [`06a5a6`](https://github.com/compasjs/compas/commit/06a5a65d84d166b0dd5f601bc3c0a47242bb3f40)
- chore(changelog): add commit hash to the changelog
  [`caa69a`](https://github.com/compasjs/compas/commit/caa69a878ac757cbd0dde849a3b5baca6d2e8185)

#### Dependency updates

- build(deps): bump eslint-plugin-jsdoc from 39.6.6 to 39.6.8
  ([#2313](https://github.com/compasjs/compas/pull/2313),
  [#2316](https://github.com/compasjs/compas/pull/2316))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump @aws-sdk/client-s3 from 3.252.0 to 3.254.0
  ([#2312](https://github.com/compasjs/compas/pull/2312))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.252.0 to 3.254.0
  ([#2314](https://github.com/compasjs/compas/pull/2314))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)

### [v0.0.221](https://github.com/compasjs/compas/releases/tag/v0.0.221)

#### Breaking changes

- feat(store): migrate to @compas/code-gen/experimental
  - `storeStructure` is now exported as `storeGetStructure`
  - Removed the `storeQueries` export
  - All other functionality should work as is.

#### Features

- feat(code-gen/experimental): add number validator support
- feat(code-gen/experimental): add string validator support
- feat(code-gen/experimental): add uuid validator support
- feat(code-gen/experimental): add generic validator support
- feat(code-gen/experimental): self-host experimental validators and types,
  introduce blocks, various fixes
- feat(code-gen/experimental): correctly resolve optional references
- feat(code-gen/experimental): perf improvements, fixes, database generate
  inserts
- feat(code-gen/experimental): replace unnecessary deep merges
- feat(code-gen/experimental): database insert returning support
- feat(code-gen/experimental): validate short names
- feat(code-gen/experimental): database generate where helper
- feat(code-gen/experimental): database generate update helper, include schema
  usage
- feat(code-gen/experimental): various validator fixes for number,string,array
- feat(code-gen/experimental): fix nested any of types generator
- feat(code-gen/experimental): setup a behaviour / specification suite
- feat(code-gen/experimental): add database count and delete queries
- feat(code-gen/experimental): add database upsert on primary key support
- feat(code-gen/experimental): add database order by partial
- feat(code-gen/experimental): add database query builer support
- feat(code-gen/experimental): add route invalidation checker
- feat(code-gen/experimental): add compas structure route + route only structure
- feat(code-gen/experimental): add route trie generation
- feat(code-gen/experimental): add route matcher + specification tests
- feat(code-gen/experimental): add route controllers and entrypoint for Koa
  target
- feat(code-gen/experimental): add api client generator
  - References [#2010](https://github.com/compasjs/compas/pull/2010)
- feat(code-gen/experimental): various fixes, cleanup todo list
  - References [#2010](https://github.com/compasjs/compas/pull/2010)
- feat(code-gen/experimental): various fixes, increase compatibility with
  existing code-gen
  - References [#2010](https://github.com/compasjs/compas/pull/2010)

#### Bug fixes

- fix(eslint-plugin): ignore errors caused by using `exports` maps
- fix(cli): don't try to run `compas run $directory`
  ([#2297](https://github.com/compasjs/compas/pull/2297))
  - Closes [#2295](https://github.com/compasjs/compas/pull/2295)

#### Other

- chore(changelog): split into different categories
- chore(code-gen/experimental): update todo list
- chore(code-gen/experimental): add database model where types
- chore(code-gen/experimental): add database model returning and insert types
- chore(code-gen/experimental): add database model update type
- chore(code-gen/experimental): prevent duplicate `undefined` in `anyOf` types
- chore(code-gen/experimental): add database model orderBy support
- chore(code-gen/experimental): add database model query builder and result
  generation
- chore: regenerate after optimizations

#### Dependency updates

- build(deps): bump sharp from 0.31.2 to 0.31.3
  ([#2275](https://github.com/compasjs/compas/pull/2275))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump @babel/core from 7.20.5 to 7.20.12
  ([#2277](https://github.com/compasjs/compas/pull/2277),
  [#2288](https://github.com/compasjs/compas/pull/2288))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.231.0 to 3.252.0
  ([#2281](https://github.com/compasjs/compas/pull/2281),
  [#2308](https://github.com/compasjs/compas/pull/2308))
- build(deps): bump @aws-sdk/client-s3 from 3.231.0 to 3.252.0
  ([#2283](https://github.com/compasjs/compas/pull/2283),
  [#2306](https://github.com/compasjs/compas/pull/2306))
- build(deps): bump json5 from 1.0.1 to 1.0.2
  ([#2289](https://github.com/compasjs/compas/pull/2289))
  - [Release notes](https://github.com/json5/json5/releases)
- build(deps): bump actions/setup-node from 3.5.1 to 3.6.0
  ([#2292](https://github.com/compasjs/compas/pull/2292))
- build(deps): bump postgres from 3.3.2 to 3.3.3
  ([#2286](https://github.com/compasjs/compas/pull/2286))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump eslint from 8.30.0 to 8.32.0
  ([#2284](https://github.com/compasjs/compas/pull/2284),
  [#2303](https://github.com/compasjs/compas/pull/2303))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump luxon from 3.1.0 to 3.2.1
  ([#2296](https://github.com/compasjs/compas/pull/2296))
  - [Release notes](https://github.com/moment/luxon/releases)
- build(deps): bump cron-parser from 4.7.0 to 4.7.1
  ([#2298](https://github.com/compasjs/compas/pull/2298))
  - [Release notes](https://github.com/harrisiirak/cron-parser/releases)
- build(deps): bump prettier from 2.8.1 to 2.8.3
  ([#2294](https://github.com/compasjs/compas/pull/2294),
  [#2302](https://github.com/compasjs/compas/pull/2302))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump file-type from 18.0.0 to 18.2.0
  ([#2300](https://github.com/compasjs/compas/pull/2300),
  [#2304](https://github.com/compasjs/compas/pull/2304))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump eslint-config-prettier from 8.5.0 to 8.6.0
  ([#2285](https://github.com/compasjs/compas/pull/2285))
  - [Release notes](https://github.com/prettier/eslint-config-prettier/releases)
- build(deps): bump crc from 4.2.0 to 4.3.1
  ([#2311](https://github.com/compasjs/compas/pull/2311))
  - [Release notes](https://github.com/alexgorbatchev/crc/releases)
- build(deps): bump eslint-plugin-import from 2.26.0 to 2.27.5
  ([#2305](https://github.com/compasjs/compas/pull/2305))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump eslint-plugin-jsdoc from 39.6.4 to 39.6.6
  ([#2309](https://github.com/compasjs/compas/pull/2309))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)

### [v0.0.220](https://github.com/compasjs/compas/releases/tag/v0.0.220)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.226.0 to 3.231.0
  ([#2262](https://github.com/compasjs/compas/pull/2262))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.226.0 to 3.231.0
  ([#2260](https://github.com/compasjs/compas/pull/2260))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump crc from 4.1.1 to 4.2.0
  ([#2269](https://github.com/compasjs/compas/pull/2269))
  - [Release notes](https://github.com/alexgorbatchev/crc/releases)
- build(deps): bump eslint from 8.29.0 to 8.30.0
  ([#2266](https://github.com/compasjs/compas/pull/2266))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump pino from 8.7.0 to 8.8.0
  ([#2263](https://github.com/compasjs/compas/pull/2263))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump recast from 0.21.5 to 0.22.0
  ([#2255](https://github.com/compasjs/compas/pull/2255))
  - [Release notes](https://github.com/benjamn/recast/releases)
- feat(stdlib): completer Axios and Postgres error formatting by AppError#format
  ([#2264](https://github.com/compasjs/compas/pull/2264))
- fix(store): batch object deletes in `fileSyncDeletedWithObjectStorage`
  ([#2265](https://github.com/compasjs/compas/pull/2265))

##### Breaking changes

- **deps**: bump recast from 0.21.5 to 0.22.0
  - Major version bump
- **stdlib**: completer Axios and Postgres error formatting by AppError
  - `axios.requestPath` and `axios.requestMethod` are replaced by
    `axios.request.path` and `axios.request.method`.
  - `axios.responseStatus`and `axios.responseBody` are replaced by
    `axios.response.status` and `axios.response.body`.
  - `axios.responseHeaders` is removed from the error to prevent session tokens
    in the logs. Make sure to explicitly catch the error if you need custom
    properties from the Axios error.

### [v0.0.219](https://github.com/compasjs/compas/releases/tag/v0.0.219)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.202.0 to 3.226.0
  ([#2224](https://github.com/compasjs/compas/pull/2224),
  [#2253](https://github.com/compasjs/compas/pull/2253))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.202.0 to 3.226.0
  ([#2225](https://github.com/compasjs/compas/pull/2225),
  [#2251](https://github.com/compasjs/compas/pull/2251))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/core from 7.19.6 to 7.20.5
  ([#2199](https://github.com/compasjs/compas/pull/2199),
  [#2231](https://github.com/compasjs/compas/pull/2231))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump cron-parser from 4.6.0 to 4.7.0
  ([#2214](https://github.com/compasjs/compas/pull/2214))
  - [Release notes](https://github.com/harrisiirak/cron-parser/releases)
- build(deps): bump eslint from 8.26.0 to 8.29.0
  ([#2200](https://github.com/compasjs/compas/pull/2200),
  [#2220](https://github.com/compasjs/compas/pull/2220),
  [#2241](https://github.com/compasjs/compas/pull/2241))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 39.6.2 to 39.6.4
  ([#2228](https://github.com/compasjs/compas/pull/2228))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump formidable from 2.0.1 to 2.1.1
  ([#2237](https://github.com/compasjs/compas/pull/2237))
  - [Release notes](https://github.com/node-formidable/formidable/releases)
- build(deps): bump koa from 2.13.4 to 2.14.1
  ([#2252](https://github.com/compasjs/compas/pull/2252))
  - [Release notes](https://github.com/koajs/koa/releases)
- build(deps): bump postgres from 3.3.1 to 3.3.2
  ([#2217](https://github.com/compasjs/compas/pull/2217))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump prettier from 2.8.0 to 2.8.1
  ([#2249](https://github.com/compasjs/compas/pull/2249))
- build(deps): bump sharp from 0.31.1 to 0.31.2
  ([#2195](https://github.com/compasjs/compas/pull/2195))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump tar from 6.1.11 to 6.1.13
  ([#2186](https://github.com/compasjs/compas/pull/2186),
  [#2250](https://github.com/compasjs/compas/pull/2250))
  - [Release notes](https://github.com/npm/node-tar/releases)
- feat(cli,eslint-plugin): bump Prettier
  ([#2226](https://github.com/compasjs/compas/pull/2226))
- feat(store): enable Postgres library debug mode for test databases
  ([#2227](https://github.com/compasjs/compas/pull/2227))

This release also includes a bunch of work for `@compas/code-gen/experimental`.
This is not yet in a usable state. For progress, see
[#2010](https://github.com/compasjs/compas/pull/2010),
[`code-gen/src/experimental/README.md`](https://github.com/compasjs/compas/blob/main/packages/code-gen/src/experimental/README.md)
and
[this series of blog posts](https://dirkdevisser.com/series/refactoring-code-gen).

### [v0.0.218](https://github.com/compasjs/compas/releases/tag/v0.0.218)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.188.0 to 3.202.0
  ([#2191](https://github.com/compasjs/compas/pull/2191))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.188.0 to 3.202.0
  ([#2190](https://github.com/compasjs/compas/pull/2190))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/core from 7.19.3 to 7.19.6
  ([#2152](https://github.com/compasjs/compas/pull/2152))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint from 8.25.0 to 8.26.0
  ([#2155](https://github.com/compasjs/compas/pull/2155))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 39.3.6 to 39.6.2
  ([#2163](https://github.com/compasjs/compas/pull/2163),
  [#2177](https://github.com/compasjs/compas/pull/2177),
  [#2142](https://github.com/compasjs/compas/pull/2142),
  [#2189](https://github.com/compasjs/compas/pull/2189),
  [#2192](https://github.com/compasjs/compas/pull/2192))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump pino from 8.6.1 to 8.7.0
  ([#2151](https://github.com/compasjs/compas/pull/2151))
  - [Release notes](https://github.com/pinojs/pino/releases)
- chore(docs): add with-auth template to the docs
- feat(code-gen): throw error on missing convert statements for query and params
  ([#2193](https://github.com/compasjs/compas/pull/2193))
- feat(visuals): updated logo files to v2
  ([#2181](https://github.com/compasjs/compas/pull/2181))
- fix(server): ensure staging localhost CORS headers are present in response
  ([#2183](https://github.com/compasjs/compas/pull/2183))
  - Closes [#2182](https://github.com/compasjs/compas/pull/2182)

### [v0.0.217](https://github.com/compasjs/compas/releases/tag/v0.0.217)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.171.0 to 3.188.0
  ([#2099](https://github.com/compasjs/compas/pull/2099),
  [#2113](https://github.com/compasjs/compas/pull/2113),
  [#2125](https://github.com/compasjs/compas/pull/2125),
  [#2135](https://github.com/compasjs/compas/pull/2135))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.171.0 to 3.188.0
  ([#2101](https://github.com/compasjs/compas/pull/2101),
  [#2110](https://github.com/compasjs/compas/pull/2110),
  [#2123](https://github.com/compasjs/compas/pull/2123),
  [#2134](https://github.com/compasjs/compas/pull/2134))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/core from 7.19.1 to 7.19.3
  ([#2090](https://github.com/compasjs/compas/pull/2090))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump actions/setup-node from 3.4.1 to 3.5.1
  ([#2094](https://github.com/compasjs/compas/pull/2094),
  [#2136](https://github.com/compasjs/compas/pull/2136))
  - [Release notes](https://github.com/actions/setup-node/releases)
- build(deps): bump dotenv from 16.0.2 to 16.0.3
  ([#2097](https://github.com/compasjs/compas/pull/2097))
  - [Release notes](https://github.com/motdotla/dotenv/releases)
- build(deps): bump eslint from 8.23.1 to 8.25.0
  ([#2078](https://github.com/compasjs/compas/pull/2078),
  [#2129](https://github.com/compasjs/compas/pull/2129))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump pino from 8.5.0 to 8.6.1
  ([#2074](https://github.com/compasjs/compas/pull/2074),
  [#2095](https://github.com/compasjs/compas/pull/2095))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump postgres from 3.2.4 to 3.3.1
  ([#2103](https://github.com/compasjs/compas/pull/2103),
  [#2112](https://github.com/compasjs/compas/pull/2112))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump recast from 0.21.2 to 0.21.5
  ([#2093](https://github.com/compasjs/compas/pull/2093))
  - [Release notes](https://github.com/benjamn/recast/releases)
- build(deps): bump sharp from 0.31.0 to 0.31.1
  ([#2098](https://github.com/compasjs/compas/pull/2098))
  - [Release notes](https://github.com/lovell/sharp/releases)
- docs(file-handling): example correctness
  - Closes [#2132](https://github.com/compasjs/compas/pull/2132)
- feat(cli): `docker clean --project` tries to kill all open connections before
  cleaning ([#2121](https://github.com/compasjs/compas/pull/2121))
  - Closes [#2087](https://github.com/compasjs/compas/pull/2087)
- fix(code-gen): remove axiosInstance as param on `useFooBar.invalidate` calls
  ([#2120](https://github.com/compasjs/compas/pull/2120))
  - Closes [#2114](https://github.com/compasjs/compas/pull/2114)
- fix(create-compas): write template tar to temp directory before extracting
  ([#2144](https://github.com/compasjs/compas/pull/2144))
  - Closes [#2105](https://github.com/compasjs/compas/pull/2105)
- fix(docs): small typo fix in index docs
  ([#2127](https://github.com/compasjs/compas/pull/2127))
- fix(examples): with-auth added axios as dev package
  ([#2107](https://github.com/compasjs/compas/pull/2107))
  - Closes [#2106](https://github.com/compasjs/compas/pull/2106)

##### Breaking changes

- **code-gen**: remove axiosInstance as param on `useFooBar.invalidate` calls
  - `useFooBar.invalidate()` does not accept an `AxiosInstance` anymore.

### [v0.0.216](https://github.com/compasjs/compas/releases/tag/v0.0.216)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.168.0 to 3.171.0
  ([#2067](https://github.com/compasjs/compas/pull/2067))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.168.0 to 3.171.0
  ([#2065](https://github.com/compasjs/compas/pull/2065))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/core from 7.19.0 to 7.19.1
  ([#2068](https://github.com/compasjs/compas/pull/2068))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.18.9 to 7.19.1
  ([#2066](https://github.com/compasjs/compas/pull/2066))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint from 8.23.0 to 8.23.1
  ([#2060](https://github.com/compasjs/compas/pull/2060))
  - [Release notes](https://github.com/eslint/eslint/releases)
- feat(code-gen): accept full axios config in api client
  ([#2070](https://github.com/compasjs/compas/pull/2070))
  - Closes [#2069](https://github.com/compasjs/compas/pull/2069)
- fix(store): swallow fileVerifyAccessToken validation errors and always return
  'invalidToken'.

### [v0.0.215](https://github.com/compasjs/compas/releases/tag/v0.0.215)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.163.0 to 3.168.0
  ([#2051](https://github.com/compasjs/compas/pull/2051))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.163.0 to 3.168.0
  ([#2045](https://github.com/compasjs/compas/pull/2045) ,
  [#2053](https://github.com/compasjs/compas/pull/2053))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- examples(with-auth): create with-auth example
  ([#2050](https://github.com/compasjs/compas/pull/2050))
  - Closes [#2049](https://github.com/compasjs/compas/pull/2049)
- feat(code-gen): openAPI import fixes for file uploads and string types
  ([#2056](https://github.com/compasjs/compas/pull/2056))

### [v0.0.214](https://github.com/compasjs/compas/releases/tag/v0.0.214)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.161.0 to 3.163.0
  ([#2030](https://github.com/compasjs/compas/pull/2030),
  [#2034](https://github.com/compasjs/compas/pull/2034))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @aws-sdk/lib-storage from 3.161.0 to 3.163.0
  ([#2031](https://github.com/compasjs/compas/pull/2031),
  [#2033](https://github.com/compasjs/compas/pull/2033))
  - [Release notes](https://github.com/aws/aws-sdk-js-v3/releases)
- build(deps): bump @babel/core from 7.18.13 to 7.19.0
  ([#2043](https://github.com/compasjs/compas/pull/2043))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump pino from 8.4.2 to 8.5.0
  ([#2038](https://github.com/compasjs/compas/pull/2038))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump sharp from 0.30.7 to 0.31.0
  ([#2040](https://github.com/compasjs/compas/pull/2040))
  - [Release notes](https://github.com/lovell/sharp/releases)
- chore(release): add package-lock to commit
- feat(cli): add docker and graphviz checks to 'compas check-env'
  ([#2044](https://github.com/compasjs/compas/pull/2044))
  - References [#2042](https://github.com/compasjs/compas/pull/2042)
- feat(create-compas): check template existence, always use pretty logger
  ([#2037](https://github.com/compasjs/compas/pull/2037))
  - Closes [#2032](https://github.com/compasjs/compas/pull/2032)
- feat(create-compas): disable output of initial generate
  - Closes [#2041](https://github.com/compasjs/compas/pull/2041)
- feat(create-compas): run 'compas check-env' when creating a project
  - Closes [#2042](https://github.com/compasjs/compas/pull/2042)
- fix(store): explicit error on empty access token in `fileVerifyAccessToken`
  ([#2036](https://github.com/compasjs/compas/pull/2036))
  - Closes [#2035](https://github.com/compasjs/compas/pull/2035)

##### Breaking changes

- **deps**: bump sharp from 0.30.7 to 0.31.0
  - Major version bump

### [v0.0.213](https://github.com/compasjs/compas/releases/tag/v0.0.213)

##### Changes

- build(deps): bump @aws-sdk/client-s3 from 3.145.0 to 3.161.0
- build(deps): bump @aws-sdk/lib-storage from 3.145.0 to 3.161.0
- build(deps): bump @babel/core from 7.18.10 to 7.18.13
  ([#2003](https://github.com/compasjs/compas/pull/2003))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump dotenv from 16.0.1 to 16.0.2
  ([#2025](https://github.com/compasjs/compas/pull/2025))
  - [Release notes](https://github.com/motdotla/dotenv/releases)
- build(deps): bump eslint from 8.21.0 to 8.23.0
  ([#1991](https://github.com/compasjs/compas/pull/1991),
  [#2013](https://github.com/compasjs/compas/pull/2013))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump file-type from 17.1.6 to 18.0.0
  ([#2007](https://github.com/compasjs/compas/pull/2007))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump pino from 8.4.0 to 8.4.2
  ([#1988](https://github.com/compasjs/compas/pull/1988),
  [#2000](https://github.com/compasjs/compas/pull/2000))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump vite from 2.9.8 to 2.9.15
  ([#2022](https://github.com/compasjs/compas/pull/2022))
  - [Release notes](https://github.com/vitejs/vite/releases)
- chore: fix type issues after Typescript bump
- chore: update package-lock.json
- docs: simplify the README's of all the packages
- docs(getting-started): use create-compas
- examples(default): add code-gen setup
  ([#1982](https://github.com/compasjs/compas/pull/1982))
  - References [#1967](https://github.com/compasjs/compas/pull/1967)
- examples(default): add migrations, services, entrypoints, tests
  ([#1984](https://github.com/compasjs/compas/pull/1984))
- examples(default): update README.md
- feat(cli): add threadId to test runner logs
  ([#2029](https://github.com/compasjs/compas/pull/2029))
  - Closes [#2028](https://github.com/compasjs/compas/pull/2028)
- feat(code-gen): add response data to response validator errors
  ([#2021](https://github.com/compasjs/compas/pull/2021))
  - Closes [#2020](https://github.com/compasjs/compas/pull/2020)
- feat(code-gen): add user input to oneOf errors
  - Closes [#2019](https://github.com/compasjs/compas/pull/2019)
- feat(create-compas): generate on template init
  ([#1983](https://github.com/compasjs/compas/pull/1983))
- feat(store): disable notices by default in test database connections

##### Breaking changes

- **deps**: bump file-type from 17.1.6 to 18.0.0
  - Major version bump

### [v0.0.212](https://github.com/compasjs/compas/releases/tag/v0.0.212)

##### Changes

- build(deps): bump @babel/core from 7.18.9 to 7.18.10
  ([#1950](https://github.com/compasjs/compas/pull/1950))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump cron-parser from 4.5.0 to 4.6.0
  ([#1955](https://github.com/compasjs/compas/pull/1955))
  - [Release notes](https://github.com/harrisiirak/cron-parser/releases)
- build(deps): bump eslint from 8.20.0 to 8.21.0
  ([#1949](https://github.com/compasjs/compas/pull/1949))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 39.3.3 to 39.3.6
  ([#1947](https://github.com/compasjs/compas/pull/1947),
  [#1975](https://github.com/compasjs/compas/pull/1975))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump file-type from 17.1.4 to 17.1.6
  ([#1954](https://github.com/compasjs/compas/pull/1954))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump pino from 8.3.1 to 8.4.0
  ([#1958](https://github.com/compasjs/compas/pull/1958))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump recast from 0.21.1 to 0.21.2
  ([#1956](https://github.com/compasjs/compas/pull/1956))
  - [Release notes](https://github.com/benjamn/recast/releases)
- chore: various housekeeping tasks
  ([#1974](https://github.com/compasjs/compas/pull/1974))
- chore(tests): improve stability of SQL time-based tests
- chore(tests): remove unnecessary offset added to sql time offset
  ([#1959](https://github.com/compasjs/compas/pull/1959))
- feat(create-compas): init package
  ([#1963](https://github.com/compasjs/compas/pull/1963))
  - References [#1907](https://github.com/compasjs/compas/pull/1907)
- feat(create-compas): add args parser
  ([#1970](https://github.com/compasjs/compas/pull/1970))
  - Closes [#1965](https://github.com/compasjs/compas/pull/1965)
- feat(create-compas): determine and check the output directory
  ([#1971](https://github.com/compasjs/compas/pull/1971))
  - Closes [#1966](https://github.com/compasjs/compas/pull/1966)
- feat(create-compas): download github repo support
  ([#1973](https://github.com/compasjs/compas/pull/1973))
  - Closes [#1968](https://github.com/compasjs/compas/pull/1968)
- feat(docs): add Compas visuals
  ([#1948](https://github.com/compasjs/compas/pull/1948))
  - Closes [#1945](https://github.com/compasjs/compas/pull/1945)
- feat(docs): readme visual update
  ([#1952](https://github.com/compasjs/compas/pull/1952))
- feat(store): replace `minio` with `objectStorage` and refactor `file`
  ([#1951](https://github.com/compasjs/compas/pull/1951))
  - Closes [#1906](https://github.com/compasjs/compas/pull/1906)
- fix(code-gen): add content type headers for react native when uploading files
  ([#1944](https://github.com/compasjs/compas/pull/1944))
  - Closes [#1943](https://github.com/compasjs/compas/pull/1943)
- internal(store): simplify postgres type usage
  ([#1960](https://github.com/compasjs/compas/pull/1960))

##### Breaking changes

- **store**: replace `minio` with `objectStorage` and refactor `file`
  - The Minio SDK is switched for the AWS SDK. All deployments using S3
    compatible storage must be revalidated.
  - See the [release notes](https://compasjs.com/releases/0.0.212.html) for a
    comprehensive list of breaking changes.

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.212.html).

### [v0.0.211](https://github.com/compasjs/compas/releases/tag/v0.0.211)

##### Changes

- build(deps): bump file-type from 17.1.2 to 17.1.4
  ([#1927](https://github.com/compasjs/compas/pull/1927) ,
  [#1936](https://github.com/compasjs/compas/pull/1936))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump pino from 8.2.0 to 8.3.1
  ([#1925](https://github.com/compasjs/compas/pull/1925) ,
  [#1941](https://github.com/compasjs/compas/pull/1941))
  - [Release notes](https://github.com/pinojs/pino/releases)
- feat(cli): suppress info logs by default while running `compas test`.
  ([#1937](https://github.com/compasjs/compas/pull/1937))
  - Closes [#1930](https://github.com/compasjs/compas/pull/1930)
- feat(stdlib): cleanup logger, more transparently use pino transports and
  destination ([#1933](https://github.com/compasjs/compas/pull/1933))
  - References [#1930](https://github.com/compasjs/compas/pull/1930)
- feat(store): improve sessionStore signingKey validation error
  ([#1938](https://github.com/compasjs/compas/pull/1938))
  - Closes [#1935](https://github.com/compasjs/compas/pull/1935)
- feat(store): support Postgres native environment variables
  ([#1939](https://github.com/compasjs/compas/pull/1939))
  - Closes [#1928](https://github.com/compasjs/compas/pull/1928)

##### Breaking changes

- **cli**: suppress info logs by default.
  - When tests are executed via `compas test`, the info logs are suppressed by
    default. To enable all info logs, either use `compas test --with-logs` or
    run a specific test file with `mainTestFn` via `compas run ./file.test.js` .
- **stdlib**: cleanup logger, more transparently use pino transports and
  destination
  - `newLogger` now only accepts a `ctx`. For `stream`, `disableInfoLogger` and
    `disableErrorLogger` please use `loggerSetGlobalDestination`.
  - `printer` can't be passed to `newLogger`, either use `COMPAS_LOG_PRINTER` to
    force one of the build-in printers, or use a custom destination via
    `loggerSetGlobalDestination`.
  - `extendGlobalLoggerContext` is renamed to `loggerExtendGlobalContext`.
  - `setGlobalLoggerOptions` is replaced with `loggerSetGlobalDestination`. This
    can be called before `mainFn` to make sure that even the initial logger is
    using your custom destination. Note that before `mainFn`, the `.env` files
    are not loaded yet.
  - `mainFn` will now determine the default printer (or destination) to be used
    if none is set already. It uses `COMPAS_LOG_PRINTER`, `NODE_ENV` and
    `GITHUB_ACTIONS` environment variables to switch between `ndjson` and
    `pretty` modes.
- **store**: support Postgres native environment variables
  - `process.env.PGDATABASE` is used before `process.env.APP_NAME` as the
    database name for Postgres connections.

### [v0.0.210](https://github.com/compasjs/compas/releases/tag/v0.0.210)

##### Changes

- build(deps): bump @babel/core from 7.18.6 to 7.18.9
  ([#1916](https://github.com/compasjs/compas/pull/1916))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.18.2 to 7.18.9
  ([#1918](https://github.com/compasjs/compas/pull/1918))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump c8 from 7.11.3 to 7.12.0
  ([#1920](https://github.com/compasjs/compas/pull/1920))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump eslint from 8.19.0 to 8.20.0
  ([#1915](https://github.com/compasjs/compas/pull/1915))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump pino from 8.1.0 to 8.2.0
  ([#1917](https://github.com/compasjs/compas/pull/1917))
  - [Release notes](https://github.com/pinojs/pino/releases)
- chore(deps): update to @tanstack/react-query v4 and rename import references
  ([#1924](https://github.com/compasjs/compas/pull/1924))
- feat: add package.json exports
  ([#1922](https://github.com/compasjs/compas/pull/1922))
  - Closes [#1921](https://github.com/compasjs/compas/pull/1921)
- feat(code-gen): add `T.extendNamedObject()` to add fields to named objects
  ([#1923](https://github.com/compasjs/compas/pull/1923))
  - Closes [#1911](https://github.com/compasjs/compas/pull/1911)
- feat(compas): use sub entrypoints (`compas/cli`) instead of a single
  entrypoint ([#1909](https://github.com/compasjs/compas/pull/1909))
- feat(store): add placeholder image support & response type `StoreFileResponse`
  ([#1912](https://github.com/compasjs/compas/pull/1912))
  - Closes [#1891](https://github.com/compasjs/compas/pull/1891)
- fix(code-gen): correctly generate types and api client for file uploads via
  React Native ([#1910](https://github.com/compasjs/compas/pull/1910))
  - Closes [#1908](https://github.com/compasjs/compas/pull/1908)

##### Breaking changes

- **deps**: update to @tanstack/react-query v4 and rename import references
  - Dropped support for `react-query`, please install and update your usages
    with `@tanstack/react-query`.
- **compas**: use sub entrypoints
  - Change any direct `compas` import to `compas/pkg` or `@compas/pkg`.

### [v0.0.209](https://github.com/compasjs/compas/releases/tag/v0.0.209)

##### Changes

- build(deps): bump @types/koa from 2.13.4 to 2.13.5
  ([#1903](https://github.com/compasjs/compas/pull/1903))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump minio from 7.0.28 to 7.0.29
  ([#1900](https://github.com/compasjs/compas/pull/1900))
  - [Release notes](https://github.com/minio/minio-js/releases)
- chore(ci): expand on matrix combinations for test and coverage runs
  ([#1898](https://github.com/compasjs/compas/pull/1898))
  - Closes [#1895](https://github.com/compasjs/compas/pull/1895)
- feat(code-gen): create `fetch`, `prefetch`, etc extension on generated hooks
  ([#1901](https://github.com/compasjs/compas/pull/1901))
  - Closes [#1879](https://github.com/compasjs/compas/pull/1879)
- feat(store): add `jobFileCleanup`
  ([#1896](https://github.com/compasjs/compas/pull/1896))
  - Closes [#1892](https://github.com/compasjs/compas/pull/1892)
- feat(store): add `jobSessionStoreCleanup`
  ([#1897](https://github.com/compasjs/compas/pull/1897))
  - Closes [#1893](https://github.com/compasjs/compas/pull/1893)
- feat(store): add `jobSessionStoreProcessLeakedSession`
  ([#1899](https://github.com/compasjs/compas/pull/1899))
  - Closes [#1894](https://github.com/compasjs/compas/pull/1894)
- feat(store): support interpolating dates in `stringifyQueryPart`
  ([#1890](https://github.com/compasjs/compas/pull/1890))
  - Closes [#1888](https://github.com/compasjs/compas/pull/1888)

### [v0.0.208](https://github.com/compasjs/compas/releases/tag/v0.0.208)

##### Changes

- build(deps): bump eslint from 8.18.0 to 8.19.0
  ([#1883](https://github.com/compasjs/compas/pull/1883))
- fix(code-gen): correctly prioritze existing named items in the structure
  ([#1885](https://github.com/compasjs/compas/pull/1885))

### [v0.0.207](https://github.com/compasjs/compas/releases/tag/v0.0.207)

##### Changes

- build(deps): bump @babel/core from 7.18.5 to 7.18.6
  ([#1877](https://github.com/compasjs/compas/pull/1877))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump cron-parser from 4.4.0 to 4.5.0
  ([#1878](https://github.com/compasjs/compas/pull/1878))
  - [Release notes](https://github.com/harrisiirak/cron-parser/releases)
- chore: update README's
- chore(cli): remove bench command
  ([#1874](https://github.com/compasjs/compas/pull/1874))
- feat(bench): detect flaky bench results
  - Closes [#1616](https://github.com/compasjs/compas/pull/1616)
- feat(bench): remove support for writing bench results to a file
- feat(code-gen): add support for filters on crud list routes
  ([#1880](https://github.com/compasjs/compas/pull/1880))
  - Closes [#1843](https://github.com/compasjs/compas/pull/1843)
- feat(code-gen): only select primary key in CRUD count builder
  ([#1882](https://github.com/compasjs/compas/pull/1882))
- feat(code-gen): support selecting a set of fields in the query builder
  ([#1876](https://github.com/compasjs/compas/pull/1876))
  - Closes [#1875](https://github.com/compasjs/compas/pull/1875)
- feat(compas): initialize Compas package
- perf(cli): only import chokidar and axios when used
- perf(code-gen): improve performance of generated string and object validators
- perf(code-gen): small speedups while generating
- perf(stdlib): skip context merge for the logger
- refactor(code-gen): format error strings inline
  ([#1873](https://github.com/compasjs/compas/pull/1873))

##### Breaking changes

- **cli**: remove bench command
  - Removed `compas bench`, use `compas run ./path/to/file.bench.js` to run your
    benchmarks.
- **bench**: remove support for writing bench results to a file
  - The `benchmark_output.txt` is not created anymore when running benchmarks on
    CI.
- **stdlib**: skip context merge for the logger
  - The `ctx` provided to `newLogger` and the values passed to
    `extendGlobalLoggerContext` are now longer deeply merged, but are shallowly
    merged.

### [v0.0.206](https://github.com/compasjs/compas/releases/tag/v0.0.206)

##### Changes

- fix(server): check correct err status
  ([#1872](https://github.com/compasjs/compas/pull/1872))

### [v0.0.205](https://github.com/compasjs/compas/releases/tag/v0.0.205)

##### Changes

- build(deps): bump pino from 8.0.0 to 8.1.0
  ([#1870](https://github.com/compasjs/compas/pull/1870))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump sharp from 0.30.6 to 0.30.7
  ([#1869](https://github.com/compasjs/compas/pull/1869))
  - [Release notes](https://github.com/lovell/sharp/releases)
- fix(server): ensure log level is inherited from AppError
  ([#1868](https://github.com/compasjs/compas/pull/1868))
- fix(server): more explicit conversion to `AppError.serverError` on unknown
  errors ([#1871](https://github.com/compasjs/compas/pull/1871))

### [v0.0.204](https://github.com/compasjs/compas/releases/tag/v0.0.204)

##### Changes

- fix(code-gen): import and use correct response validator
  ([#1867](https://github.com/compasjs/compas/pull/1867))

### [v0.0.203](https://github.com/compasjs/compas/releases/tag/v0.0.203)

##### Changes

- build(deps): bump eslint from 8.17.0 to 8.18.0
  ([#1863](https://github.com/compasjs/compas/pull/1863))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 39.3.2 to 39.3.3
  ([#1864](https://github.com/compasjs/compas/pull/1864))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- chore(docs): fix small nits related to crud
- fix(code-gen): resolve out of group refs in router generator
  ([#1866](https://github.com/compasjs/compas/pull/1866))

### [v0.0.202](https://github.com/compasjs/compas/releases/tag/v0.0.202)

##### Changes

- build(deps): bump @babel/core from 7.18.2 to 7.18.5
  ([#1852](https://github.com/compasjs/compas/pull/1852))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump actions/setup-node from 3.2.0 to 3.3.0
  ([#1844](https://github.com/compasjs/compas/pull/1844))
  - [Release notes](https://github.com/actions/setup-node/releases)
- build(deps): bump eslint from 8.16.0 to 8.17.0
  ([#1841](https://github.com/compasjs/compas/pull/1841))
- build(deps): bump file-type from 17.1.1 to 17.1.2
  ([#1834](https://github.com/compasjs/compas/pull/1834))
  - [Release notes](https://github.com/sindresorhus/file-type/releases)
- build(deps): bump pino from 7.11.0 to 8.0.0
  ([#1833](https://github.com/compasjs/compas/pull/1833))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump prettier from 2.6.2 to 2.7.1
  ([#1854](https://github.com/compasjs/compas/pull/1854) ,
  [#1860](https://github.com/compasjs/compas/pull/1860))
- chore(changelog): ignore `@types/node` updates
- feat(code-gen): implement `T.crud()`
  ([#1824](https://github.com/compasjs/compas/pull/1824))
  - Closes [#1099](https://github.com/compasjs/compas/pull/1099)
- chore(code-gen): add e2e tests for basic crud generation
  ([#1846](https://github.com/compasjs/compas/pull/1846))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- chore(code-gen): test crud inline + various fixes
  ([#1847](https://github.com/compasjs/compas/pull/1847))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- chore(code-gen): test crud nested + various fixes
  ([#1848](https://github.com/compasjs/compas/pull/1848))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- feat(code-gen): add check to prevent double `oneToOne` creation in crud
  ([#1859](https://github.com/compasjs/compas/pull/1859))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- feat(code-gen): add crud order by support
  ([#1857](https://github.com/compasjs/compas/pull/1857))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- feat(code-gen): add route invalidations to crud routes in a single group
  ([#1850](https://github.com/compasjs/compas/pull/1850))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- feat(code-gen): full dynamic primary key support in the crud generator
  ([#1856](https://github.com/compasjs/compas/pull/1856))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- feat(code-gen): support crud modifiers
  ([#1862](https://github.com/compasjs/compas/pull/1862))
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- feat(docs): add CRUD docs
  - References [#1843](https://github.com/compasjs/compas/pull/1843)
- chore(types): fix type issues, let CI fail on the types
- feat(cli): improve printing of 'actual' values in `t.ok` and `t.notOk`
  ([#1837](https://github.com/compasjs/compas/pull/1837))
  - Closes [#1836](https://github.com/compasjs/compas/pull/1836)
- feat(cli): support `ignoreDirectories` in the loaded `test/config.js`
- feat(code-gen): generalize compas order by types
- feat(server): return `stack` and `cause` of errors when not in production
  ([#1838](https://github.com/compasjs/compas/pull/1838))
  - Closes [#1835](https://github.com/compasjs/compas/pull/1835)
- fix(cli): don't load `.test.js` files when resolving CLI commands
- fix(code-gen): correctly output invalidations using multiple params
  ([#1851](https://github.com/compasjs/compas/pull/1851))
- fix(code-gen): satisfy tsc

##### Breaking changes

- **deps**: bump pino from 7.11.0 to 8.0.0
  - Major version bump
- **code-gen**: generalize compas order by types
  - `CompasSqlOrderBy` and `CompasSqlOrderByOptionalField` are respectively
    named `CompasOrderBy` and `CompasOrderByOptional`

##### Documentation updates

- Added a new page describing the
  [CRUD generator features](https://compasjs.com/features/code-gen-crud.html)

### [v0.0.201](https://github.com/compasjs/compas/releases/tag/v0.0.201)

##### Changes

- build(deps): bump @babel/core from 7.17.10 to 7.18.2
  ([#1809](https://github.com/compasjs/compas/pull/1809) ,
  [#1812](https://github.com/compasjs/compas/pull/1812),
  [#1821](https://github.com/compasjs/compas/pull/1821))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.17.0 to 7.18.2
  ([#1819](https://github.com/compasjs/compas/pull/1819))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 17.0.33 to 17.0.36
  ([#1808](https://github.com/compasjs/compas/pull/1808) ,
  [#1813](https://github.com/compasjs/compas/pull/1813),
  [#1823](https://github.com/compasjs/compas/pull/1823))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 8.15.0 to 8.16.0
  ([#1814](https://github.com/compasjs/compas/pull/1814))
- build(deps): bump eslint-plugin-jsdoc from 39.2.9 to 39.3.2
  ([#1811](https://github.com/compasjs/compas/pull/1811) ,
  [#1817](https://github.com/compasjs/compas/pull/1817))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump postgres from 3.2.2 to 3.2.4
  ([#1816](https://github.com/compasjs/compas/pull/1816) ,
  [#1820](https://github.com/compasjs/compas/pull/1820))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump sharp from 0.30.4 to 0.30.6
  ([#1815](https://github.com/compasjs/compas/pull/1815) ,
  [#1826](https://github.com/compasjs/compas/pull/1826))
  - [Release notes](https://github.com/lovell/sharp/releases)
- feat(code-gen): remove `validator.anyOf` errors
  ([#1829](https://github.com/compasjs/compas/pull/1829))
  - Closes [#1827](https://github.com/compasjs/compas/pull/1827)
- feat(code-gen): return `foundKeys` and `expectedKeys` in ` validator.o…
  ([#1830](https://github.com/compasjs/compas/pull/1830))
  - Closes [#1828](https://github.com/compasjs/compas/pull/1828)

##### Breaking changes

- **code-gen**: remove `validator.anyOf` errors
  - `validator.anyOf` is not an error key anymore. See
    [#1827](https://github.com/compasjs/compas/pull/1827) for more information.
- **code-gen**: return `foundKeys` and `expectedKeys` in `validator.o…
  - `info.extraKey` is replaced by `info.expectedKeys` and `info.foundKeys` in
    `validator.object.strict` errors. See
    [#1828](https://github.com/compasjs/compas/pull/1828) for more information.

### [v0.0.200](https://github.com/compasjs/compas/releases/tag/v0.0.200)

##### Changes

- build(deps): bump @types/node from 17.0.31 to 17.0.33
  ([#1798](https://github.com/compasjs/compas/pull/1798) ,
  [#1802](https://github.com/compasjs/compas/pull/1802))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump c8 from 7.11.2 to 7.11.3
  ([#1807](https://github.com/compasjs/compas/pull/1807))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump dotenv from 16.0.0 to 16.0.1
  ([#1799](https://github.com/compasjs/compas/pull/1799))
  - [Release notes](https://github.com/motdotla/dotenv/releases)
- build(deps): bump postgres from 3.1.0 to 3.2.2
  ([#1806](https://github.com/compasjs/compas/pull/1806))
  - [Release notes](https://github.com/porsager/postgres/releases)
- chore(changelog): support keywords with and without trailing `S`
  ([#1805](https://github.com/compasjs/compas/pull/1805))
- feat(store,code-gen): support image/avif in `sendTransformedImage`
  ([#1804](https://github.com/compasjs/compas/pull/1804))
  - Closes [#1801](https://github.com/compasjs/compas/pull/1801)
- fix(code-gen): support numbers in group names like before
  ([#1803](https://github.com/compasjs/compas/pull/1803))
  - Closes [#1800](https://github.com/compasjs/compas/pull/1800)

### [v0.0.199](https://github.com/compasjs/compas/releases/tag/v0.0.199)

##### Changes

- fix(cli): correctly use new code-gen structure helpers

### [v0.0.198](https://github.com/compasjs/compas/releases/tag/v0.0.198)

##### Changes

- feat(code-gen): remove `type` as a reserved group name

### [v0.0.197](https://github.com/compasjs/compas/releases/tag/v0.0.197)

##### Changes

- build(deps): bump @babel/core from 7.17.9 to 7.17.10
  ([#1780](https://github.com/compasjs/compas/pull/1780))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/formidable from 2.0.4 to 2.0.5
  ([#1784](https://github.com/compasjs/compas/pull/1784))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump @types/node from 17.0.25 to 17.0.31
  ([#1754](https://github.com/compasjs/compas/pull/1754) ,
  [#1762](https://github.com/compasjs/compas/pull/1762),
  [#1768](https://github.com/compasjs/compas/pull/1768) ,
  [#1774](https://github.com/compasjs/compas/pull/1774),
  [#1782](https://github.com/compasjs/compas/pull/1782))
- build(deps): bump cron-parser from 4.3.0 to 4.4.0
  ([#1781](https://github.com/compasjs/compas/pull/1781))
- build(deps): bump eslint from 8.13.0 to 8.15.0
  ([#1753](https://github.com/compasjs/compas/pull/1753) ,
  [#1794](https://github.com/compasjs/compas/pull/1794))
- build(deps): bump eslint-plugin-jsdoc from 39.2.7 to 39.2.9
  ([#1751](https://github.com/compasjs/compas/pull/1751) ,
  [#1759](https://github.com/compasjs/compas/pull/1759))
- build(deps): bump github/codeql-action from 1 to 2
  ([#1763](https://github.com/compasjs/compas/pull/1763))
- build(deps): bump minio from 7.0.26 to 7.0.28
  ([#1760](https://github.com/compasjs/compas/pull/1760))
- build(deps): bump pino from 7.10.0 to 7.11.0
  ([#1766](https://github.com/compasjs/compas/pull/1766))
- build(deps): bump postgres from 2.0.0-beta.11 to 3.1.0
  ([#1750](https://github.com/compasjs/compas/pull/1750))
  - [Release notes](https://github.com/porsager/postgres/releases)
- build(deps): bump recast from 0.20.5 to 0.21.1
  ([#1772](https://github.com/compasjs/compas/pull/1772))
- chore: migrate from Yarn to NPM workspaces
  ([#1779](https://github.com/compasjs/compas/pull/1779))
- chore: support Node.js 18
  ([#1778](https://github.com/compasjs/compas/pull/1778))
- chore: update author + contributor fields
- chore(code-gen): refactor internal structure helpers
  ([#1789](https://github.com/compasjs/compas/pull/1789)
  ,[#1790](https://github.com/compasjs/compas/pull/1790),[#1791](https://github.com/compasjs/compas/pull/1791))
- chore(code-gen): skip generating empty type for defined routes
- feat(code-gen): add explicit error for empty `T.string().oneOf()` values
  ([#1773](https://github.com/compasjs/compas/pull/1773))
  - Closes [#1755](https://github.com/compasjs/compas/pull/1755)
- feat(code-gen): explicit error on invalid group and type names
  ([#1787](https://github.com/compasjs/compas/pull/1787))
- feat(code-gen): hard error on duplicate route param
  ([#1796](https://github.com/compasjs/compas/pull/1796))
  - Closes [#1792](https://github.com/compasjs/compas/pull/1792)
- feat(code-gen): only report first error in 'anyOf' validators
  ([#1770](https://github.com/compasjs/compas/pull/1770))
  - Closes [#1756](https://github.com/compasjs/compas/pull/1756)
- feat(code-gen): support references in `T.pick` and `T.omit`
  ([#1788](https://github.com/compasjs/compas/pull/1788))
- feat(server): remove `leakError` support
  ([#1769](https://github.com/compasjs/compas/pull/1769))
  - Closes [#1757](https://github.com/compasjs/compas/pull/1757)
- feat(stdlib): support `COMPAS_LOG_PRINTER` env variable to select a log
  printer ([#1785](https://github.com/compasjs/compas/pull/1785))
- feat(store): refactor job queue worker
  ([#1776](https://github.com/compasjs/compas/pull/1776))
  - Closes [#1095](https://github.com/compasjs/compas/pull/1095)
  - Closes [#1704](https://github.com/compasjs/compas/pull/1704)
- fix(docs): fix syntax error in initial migration

##### Breaking changes

- **deps**: bump postgres from 2.0.0-beta.11 to 3.1.0
  - Major version bump
  - [Release notes](https://github.com/porsager/postgres/releases)
- **all**: support Node.js 18
  - `POSTGRES_HOST` and `MINIO_URI` should use `127.0.0.1` instead of
    `localhost` when using Node.js 18+
  - Axios will use the global `FormData`, resulting in a one time process
    warning which is automatically logged as an error. Since Axios also includes
    its own `form-data` package for older Node.js versions, you can remove the
    explicit the dependency on it.
- **code-gen**: move comment formatter and internal field remove to structure
  helpers
  - `type` is now a reserved group name
- **code-gen**: support references in `T.pick` and `T.omit`
  - `T.omit()` and `T.pick()` now only copy or remove object keys and further
    use their own options for things like `.optional()`, `.default()` and
    `.loose()`
- **server**: remove `leakError` support
  - The `stack` and `cause` properties are never sent to the client.
  - Error responses should have a `requestId` property, referencing to the logs
    for the `stack` and `cause` properties.
- **store**: refactor job queue worker
  - All of `addJobToQueue`, `addEventToQueue` and
    `addJobWithCustomTimeoutToQueue` are replaced with
    [queueWorkerAddJob](https://compasjs.com/features/background-jobs.html#queueWorkerAddJob)
  - `new JobQueueWorker()` including the `start` & `stop` methods are replaced
    by
    [queueWorkerCreate](https://compasjs.com/features/background-jobs.html#queueWorkerCreate)
  - `JobQueueWorker#clean` no longer exists, see
    [jobQueueCleanup](https://compasjs.com/features/background-jobs.html#jobqueuecleanup)
    for a replacement
  - `JobQueueWorker#pendingQueueSize` no longer exists, see
    [jobQueueInsights](https://compasjs.com/features/background-jobs.html#jobqueueinsights)
  - `addRecurringJobToQueue` is removed, and replaced with cron based scheduler,
    see
    [queueWorkerRegisterCronJobs](https://compasjs.com/features/background-jobs.html#queueworkerregistercronjobs)
  - Remove all existing recurring jobs and their created jobs with the following
    migration:

```sql
WITH
  recurring_jobs AS (
    SELECT DISTINCT data ->> 'name' AS "recurringName" FROM "job" WHERE "name" = 'compas.job.recurring'
  ),
  removed_recurring_jobs AS (DELETE FROM "job" WHERE "name" = 'compas.job.recurring'
  )
DELETE
FROM "job"
WHERE
    "name" IN (
    SELECT "recurringName"
    FROM recurring_jobs
  );
```

### [v0.0.196](https://github.com/compasjs/compas/releases/tag/v0.0.196)

##### Changes

- build(deps): bump @babel/core from 7.17.8 to 7.17.9
  ([#1709](https://github.com/compasjs/compas/pull/1709))
- build(deps): bump @types/minio from 7.0.12 to 7.0.13
  ([#1724](https://github.com/compasjs/compas/pull/1724))
- build(deps): bump @types/node from 17.0.22 to 17.0.25
  ([#1670](https://github.com/compasjs/compas/pull/1670),
  [#1730](https://github.com/compasjs/compas/pull/1730),
  [#1737](https://github.com/compasjs/compas/pull/1737))
- build(deps): bump actions/setup-node from 3.0.0 to 3.1.1
  ([#1698](https://github.com/compasjs/compas/pull/1698),
  [#1723](https://github.com/compasjs/compas/pull/1723))
- build(deps): bump c8 from 7.11.0 to 7.11.2
  ([#1742](https://github.com/compasjs/compas/pull/1742))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump codecov/codecov-action from 2.1.0 to 3
  ([#1703](https://github.com/compasjs/compas/pull/1703))
  - [Release notes](https://github.com/codecov/codecov-action/releases)
- build(deps): bump crc from 4.1.0 to 4.1.1
  ([#1718](https://github.com/compasjs/compas/pull/1718))
- build(deps): bump eslint from 8.11.0 to 8.13.0
  ([#1679](https://github.com/compasjs/compas/pull/1679),
  [#1720](https://github.com/compasjs/compas/pull/1720))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-import from 2.25.4 to 2.26.0
  ([#1701](https://github.com/compasjs/compas/pull/1701))
- build(deps): bump eslint-plugin-jsdoc from 38.0.6 to 39.2.7
  ([#1681](https://github.com/compasjs/compas/pull/1681),
  [#1682](https://github.com/compasjs/compas/pull/1682),
  [#1683](https://github.com/compasjs/compas/pull/1683),
  [#1697](https://github.com/compasjs/compas/pull/1697),
  [#1710](https://github.com/compasjs/compas/pull/1710),
  [#1717](https://github.com/compasjs/compas/pull/1717),
  [#1722](https://github.com/compasjs/compas/pull/1722),
  [#1726](https://github.com/compasjs/compas/pull/1726),
  [#1727](https://github.com/compasjs/compas/pull/1727),
  [#1732](https://github.com/compasjs/compas/pull/1732),
  [#1738](https://github.com/compasjs/compas/pull/1738),
  [#1740](https://github.com/compasjs/compas/pull/1740),
  [#1741](https://github.com/compasjs/compas/pull/1741),
  [#1745](https://github.com/compasjs/compas/pull/1745))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump minimist from 1.2.5 to 1.2.6
  ([#1672](https://github.com/compasjs/compas/pull/1672))
  - [Release notes](https://github.com/substack/minimist/releases)
- build(deps): bump pino from 7.9.2 to 7.10.0
  ([#1716](https://github.com/compasjs/compas/pull/1716))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump prettier from 2.6.0 to 2.6.2
  ([#1677](https://github.com/compasjs/compas/pull/1677),
  [#1696](https://github.com/compasjs/compas/pull/1696))
  - [Release notes](https://github.com/prettier/prettier/releases)
- build(deps): bump sharp from 0.30.3 to 0.30.4
  ([#1736](https://github.com/compasjs/compas/pull/1736))
  - [Release notes](https://github.com/lovell/sharp/releases)
- chore(eslint-plugin): better suggestion message for check-event-name
- chore(store): drop `fileGroup` support
  ([#1714](https://github.com/compasjs/compas/pull/1714))
  - Closes [#1705](https://github.com/compasjs/compas/pull/1705)
- feat(cli): remove `enforceSingleAssertion` option from test config
  ([#1690](https://github.com/compasjs/compas/pull/1690))
- feat(code-gen): cleanup soft delete support
  ([#1691](https://github.com/compasjs/compas/pull/1691))
  - Closes [#1091](https://github.com/compasjs/compas/pull/1091)
- feat(eslint-plugin): add check-event-name rule
  ([#1734](https://github.com/compasjs/compas/pull/1734))
  - Closes [#1713](https://github.com/compasjs/compas/pull/1713)
- feat(server): handle file upload size limit errors
  ([#1748](https://github.com/compasjs/compas/pull/1748))
  - Closes [#1743](https://github.com/compasjs/compas/pull/1743)
- feat(stdlib): supported already formatted error in AppError#format
  ([#1749](https://github.com/compasjs/compas/pull/1749))
  - Closes [#1747](https://github.com/compasjs/compas/pull/1747)
- feat(store): drop soft deletes on file and file group
  ([#1693](https://github.com/compasjs/compas/pull/1693))
- fix(cli): include failing assertions of subtests in failing test
  ([#1689](https://github.com/compasjs/compas/pull/1689))
  - Closes [#1685](https://github.com/compasjs/compas/pull/1685)
- fix(code-gen): import structure without cache in `generateTypes` and
  `generateOpenAPI` ([#1715](https://github.com/compasjs/compas/pull/1715))
  - Closes [#1699](https://github.com/compasjs/compas/pull/1699)
- fix(eslint-plugin): only error enforce-event-stop if `eventStart` is called
  ([#1729](https://github.com/compasjs/compas/pull/1729))
  - Closes [#1706](https://github.com/compasjs/compas/pull/1706)
- fix(eslint-plugin): register `enforce-event-stop` as the correct rule type
- fix(store): correct type partial for `newMinioClient`
  - Closes [#1712](https://github.com/compasjs/compas/pull/1712)

##### Breaking changes

- **deps**: bump eslint-plugin-jsdoc from 38.0.6 to 39.2.7
  - Major version bump
- **store**: drop soft deletes on file and file group
  - File and fileGroup are no longer soft deletable. If you need this, you
    should reference them via a custom entity that is soft deletable.
  - To drop the columns, create the following migration:
  ```sql
  ALTER TABLE "file" DROP COLUMN "deletedAt" CASCADE;
  ALTER TABLE "fileGroup" DROP COLUMN "deletedAt" CASCADE;
  ```
- **store**: drop `fileGroup` support
  - Any reference to `fileGroup` should be removed. If you need the exact
    behaviour that it had, please check the removed code via its pull request
    link above. Most notably: `gen/store.js` and
    `packages/store/src/file-group.js`.
  - Run the following SQL in a migration:
  ```sql
  DROP TABLE "fileGroup" CASCADE;
  ```
- **cli**: remove `enforceSingleAssertion` option from test config
  - All tests now require at least a single assertion or registration of a
    subtest
- **code-gen**: cleanup soft delete support
  - Entities that use soft delete should use
    `queries.entityUpdate(sql, { update: { deletedAt: new Date() }, where, })`
    instead of `queries.entityDelete`
  - The generated `queries.entityDeletePermanent` is removed, and instead
    `queries.entityDelete` will always permanently delete a record, even if it
    was soft deleted.
- **eslint-plugin**: add check-event-name rule
  - Enabled the `@compas/check-event-name` rule in `@compas/full` ESLint config.
    It validates that the second argument passed to `eventStart` can be derived
    from the function name.

### [v0.0.195](https://github.com/compasjs/compas/releases/tag/v0.0.195)

##### Changes

- build(deps): bump @types/node from 17.0.21 to 17.0.22
  ([#1667](https://github.com/compasjs/compas/pull/1667))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump pino from 7.9.1 to 7.9.2
  ([#1668](https://github.com/compasjs/compas/pull/1668))
  - [Release notes](https://github.com/pinojs/pino/releases)
- feat(code-gen): ensure route path trailing slash is correctly taken over from
  OpenAPI import ([#1669](https://github.com/compasjs/compas/pull/1669))

### [v0.0.194](https://github.com/compasjs/compas/releases/tag/v0.0.194)

##### Changes

- build(deps): bump @babel/core from 7.17.7 to 7.17.8
  ([#1665](https://github.com/compasjs/compas/pull/1665))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump eslint-plugin-jsdoc from 38.0.4 to 38.0.6
  ([#1664](https://github.com/compasjs/compas/pull/1664))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- fix(eslint-plugin): skip blocks outside functions in enforce-event-stop

### [v0.0.193](https://github.com/compasjs/compas/releases/tag/v0.0.193)

##### Changes

- fix(eslint-plugin): don't suggest enforce-event-stop after code paths that can
  leave a function ([#1663](https://github.com/compasjs/compas/pull/1663))
  - Closes [#1662](https://github.com/compasjs/compas/pull/1662)

### [v0.0.192](https://github.com/compasjs/compas/releases/tag/v0.0.192)

##### Changes

- build(deps): bump @babel/core from 7.17.5 to 7.17.7
  ([#1655](https://github.com/compasjs/compas/pull/1655))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump actions/checkout from 2 to 3
  ([#1639](https://github.com/compasjs/compas/pull/1639))
- build(deps): bump EndBug/add-and-commit from 8 to 9
  ([#1651](https://github.com/compasjs/compas/pull/1651))
  - [Release notes](https://github.com/EndBug/add-and-commit/releases)
- build(deps): bump eslint from 8.10.0 to 8.11.0
  ([#1649](https://github.com/compasjs/compas/pull/1649))
- build(deps): bump eslint-config-prettier from 8.4.0 to 8.5.0
  ([#1642](https://github.com/compasjs/compas/pull/1642))
- build(deps): bump eslint-plugin-jsdoc from 37.9.4 to 38.0.4
  ([#1637](https://github.com/compasjs/compas/pull/1637),
  [#1638](https://github.com/compasjs/compas/pull/1638),
  [#1643](https://github.com/compasjs/compas/pull/1643),
  [#1647](https://github.com/compasjs/compas/pull/1647),
  [#1650](https://github.com/compasjs/compas/pull/1650),
  [#1653](https://github.com/compasjs/compas/pull/1653))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump mime-types from 2.1.34 to 2.1.35
  ([#1648](https://github.com/compasjs/compas/pull/1648))
- build(deps): bump pino from 7.8.0 to 7.9.1
  ([#1645](https://github.com/compasjs/compas/pull/1645),
  [#1658](https://github.com/compasjs/compas/pull/1658))
  - [Release notes](https://github.com/pinojs/pino/releases)
- build(deps): bump prettier from 2.5.1 to 2.6.0
  ([#1657](https://github.com/compasjs/compas/pull/1657))
- build(deps): bump sharp from 0.30.1 to 0.30.3
  ([#1641](https://github.com/compasjs/compas/pull/1641),
  [#1654](https://github.com/compasjs/compas/pull/1654))
- chore: add LICENSE to packages
  ([#1656](https://github.com/compasjs/compas/pull/1656))
  - Closes [#1640](https://github.com/compasjs/compas/pull/1640)
- example(session-handling-frontend): minor fixes from real project usage
- feat(cli): add lint-config-to-eslint-plugin code-mod
  ([#1660](https://github.com/compasjs/compas/pull/1660))
- feat(eslint-plugin): turn lint-config into working eslint-plugin
  ([#1659](https://github.com/compasjs/compas/pull/1659))
  - Closes [#1308](https://github.com/compasjs/compas/pull/1308)
- fix(cli): export correct command definition type
- fix(code-gen): correctly shake out unused types in dumped api structure
  ([#1652](https://github.com/compasjs/compas/pull/1652))

##### Breaking changes

- **deps**: bump eslint-plugin-jsdoc from 37.9.4 to 38.0.4
  - Major version bump
- **eslint-plugin**: turn lint-config into working eslint-plugin
  - Removed the @compas/lint-config package. Use
    `compas code-mod exec --name lint-config-to-eslint-plugin` to fix your
    configurations.
  - Added a default rule to enforce calling `eventStop` in async functions that
    accept `event` as their first parameter. This can be disabled via
    `rules: { "@compas/enforce-event-stop": "off" }` in your eslint
    configuration.

### [v0.0.191](https://github.com/compasjs/compas/releases/tag/v0.0.191)

##### Changes

- build(deps): bump eslint from 8.9.0 to 8.10.0
  ([#1635](https://github.com/compasjs/compas/pull/1635))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump prismjs from 1.25.0 to 1.27.0
  ([#1629](https://github.com/compasjs/compas/pull/1629))
  - [Release notes](https://github.com/PrismJS/prism/releases)
- chore: add initial example and sync job for docs
  ([#1630](https://github.com/compasjs/compas/pull/1630))
- example(session-handling-frontend): cleanup function signatures
- feat(cli,stdlib,store): remove cookie and proxy support
  ([#1634](https://github.com/compasjs/compas/pull/1634))
- feat(example): add session handling example
  ([#1632](https://github.com/compasjs/compas/pull/1632))
- feat(example): add session handling frontend example
  ([#1633](https://github.com/compasjs/compas/pull/1633))
- feat(store): add support for file access tokens
  ([#1631](https://github.com/compasjs/compas/pull/1631))
  - References [#1307](https://github.com/compasjs/compas/pull/1307)

##### Breaking changes

- **cli,stdlib,store**: remove cookie and proxy support
  - Remove the `compas proxy` command
  - Remove `calculateCorsUrlFromAppUrl` and `calculateCookieUrlFromAppUrl` from
    @compas/stdlib
  - Remove cookie support from `sessionTransport*` functions. Including the
    options on `sessionTransportOptions` and
    `sessionTransportAddAsCookiesToContext`

##### Documentation updates

- Improved
  [file-handling](https://compasjs.com/features/file-handling.html#securing-file-downloads)
  docs, and added information about singed file urls.
- Add an [examples](https://compasjs.com/examples.html) page, auto updated with
  examples that are added to the Compas repo.

### [v0.0.190](https://github.com/compasjs/compas/releases/tag/v0.0.190)

##### Changes

- fix(store): localhost cookies should work now

### [v0.0.189](https://github.com/compasjs/compas/releases/tag/v0.0.189)

##### Changes

- build(deps): bump @types/node from 17.0.19 to 17.0.21
  ([#1627](https://github.com/compasjs/compas/pull/1627))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump actions/setup-node from 2 to 3.0.0
  ([#1628](https://github.com/compasjs/compas/pull/1628))
  - [Release notes](https://github.com/actions/setup-node/releases)
- fix(store): set cookie on origin 'host' instead of 'hostname' in the
  session-transport

### [v0.0.188](https://github.com/compasjs/compas/releases/tag/v0.0.188)

##### Changes

- fix(store): correctly handle generated array columns in update helper

### [v0.0.187](https://github.com/compasjs/compas/releases/tag/v0.0.187)

##### Changes

- build(deps): bump @types/node from 17.0.18 to 17.0.19
  ([#1624](https://github.com/compasjs/compas/pull/1624))
- build(deps): bump eslint-config-prettier from 8.3.0 to 8.4.0
  ([#1622](https://github.com/compasjs/compas/pull/1622))
- chore(ci): add permissions to CodeQL job
- chore(docs): remove last updated from pages
  ([#1620](https://github.com/compasjs/compas/pull/1620))
- docs(migrate): move docs to the migrate command and reference it
  ([#1621](https://github.com/compasjs/compas/pull/1621))
- fix(code-gen): handle 'undefined' keys and update objects coming from the
  validators correctly ([#1626](https://github.com/compasjs/compas/pull/1626))

### [v0.0.186](https://github.com/compasjs/compas/releases/tag/v0.0.186)

##### Changes

- build(deps): bump @babel/core from 7.17.2 to 7.17.5
  ([#1612](https://github.com/compasjs/compas/pull/1612),
  [#1615](https://github.com/compasjs/compas/pull/1615))
- build(deps): bump @types/node from 17.0.16 to 17.0.18
  ([#1598](https://github.com/compasjs/compas/pull/1598),
  [#1609](https://github.com/compasjs/compas/pull/1609))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 8.8.0 to 8.9.0
  ([#1605](https://github.com/compasjs/compas/pull/1605))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 37.8.0 to 37.9.4
  ([#1596](https://github.com/compasjs/compas/pull/1596),
  [#1607](https://github.com/compasjs/compas/pull/1607),
  [#1613](https://github.com/compasjs/compas/pull/1613),
  [#1614](https://github.com/compasjs/compas/pull/1614),
  [#1617](https://github.com/compasjs/compas/pull/1617))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump follow-redirects from 1.14.7 to 1.14.8
  ([#1603](https://github.com/compasjs/compas/pull/1603))
  - [Release notes](https://github.com/follow-redirects/follow-redirects/releases)
- build(deps): bump pino from 7.6.5 to 7.8.0
  ([#1611](https://github.com/compasjs/compas/pull/1611))
- build(deps): bump sharp from 0.30.0 to 0.30.1
  ([#1597](https://github.com/compasjs/compas/pull/1597))
  - [Release notes](https://github.com/lovell/sharp/releases)
- chore(types): remove a bunch of file global type imports
  ([#1618](https://github.com/compasjs/compas/pull/1618))
- feat(code-gen): support atomic updates and dynamic return types in generated
  update queries ([#1601](https://github.com/compasjs/compas/pull/1601))
  - Closes [#383](https://github.com/compasjs/compas/pull/383)
- fix(cli): make sure that `--serial` runs tests without worker threads
  ([#1599](https://github.com/compasjs/compas/pull/1599))
  - Closes [#1586](https://github.com/compasjs/compas/pull/1586)
- test(code-gen): jsonb null insert behavior
  ([#1602](https://github.com/compasjs/compas/pull/1602))
  - Closes [#1600](https://github.com/compasjs/compas/pull/1600)

##### Breaking changes

- **code-gen**: support atomic updates and dynamic return types in generated
  update queries
  - Various keys starting with `$` are recursively reserved in `T.object()`
    types with `.enableQueries()`.
  - Updated signature for `queries.entityUpdate`. Providing better intent and
    less prone to bugs by naming the keys. See `compas code-mod list` for the
    `update-queries-signature-change` code-mod which can automatically fix most
    cases. Note that it may add some extra whitespace, this needs to be cleaned
    up manually.
  - `queries.entityUpdate` by default does not return any values anymore. See
    the [docs](https://compasjs.com/features/code-gen-sql.html#crud) for more
    information.
  - Removed `xxxUpdateSet` functions from the generator output.
  - Stricter checks on update queries if both `where` and `update` are specified

##### Documentation updates

- Added more docs to
  [Code generator SQL](https://compasjs.com/features/code-gen-sql.html) with
  examples for where-clauses, atomic updates and docs about relations.

### [v0.0.185](https://github.com/compasjs/compas/releases/tag/v0.0.185)

##### Changes

- build(deps): bump @babel/core from 7.17.0 to 7.17.2
  ([#1592](https://github.com/compasjs/compas/pull/1592))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 17.0.14 to 17.0.16
  ([#1582](https://github.com/compasjs/compas/pull/1582) ,
  [#1589](https://github.com/compasjs/compas/pull/1589))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint-plugin-jsdoc from 37.7.1 to 37.8.0
  ([#1590](https://github.com/compasjs/compas/pull/1590))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- chore(dependabot): add default reviewer
  ([#1583](https://github.com/compasjs/compas/pull/1583))
- feat(cli): add `compas watch [..sub-commands]` and `--watch`
  ([#1587](https://github.com/compasjs/compas/pull/1587))
  - Closes [#1509](https://github.com/compasjs/compas/pull/1509)
- feat(code-gen): support for reference types in query and params in openApi
  exporter ([#1580](https://github.com/compasjs/compas/pull/1580))
- feat(lint-config): disable labels and optional function parameters should be
  last ([#1584](https://github.com/compasjs/compas/pull/1584))
- fix(cli): add completions for all commands under 'help'
  ([#1585](https://github.com/compasjs/compas/pull/1585))
- fix(cli): remove error log if command directory is not found
  ([#1593](https://github.com/compasjs/compas/pull/1593))
  - Closes [#1591](https://github.com/compasjs/compas/pull/1591)
- fix(test): catch errors from global setup and teardown
  ([#1594](https://github.com/compasjs/compas/pull/1594))

##### Breaking changes

- **lint-config**: disable labels and optional functionn parameters last
- **store**: disable labels and optional functionn parameters last
  - Changed parameter order of `createTestPostgresDatabase`, and nested
    `verboseSql` in to an object.

##### Documentation updates

- New reference documentation for
  [Compas configuration](https://compasjs.com/references/compas-config.html).
- [`compas watch`](https://compasjs.com/references/cli.html#compas-watch) is
  added to the CLI reference.

### [v0.0.184](https://github.com/compasjs/compas/releases/tag/v0.0.184)

##### Changes

- build(deps): bump @babel/core from 7.16.10 to 7.17.0
  ([#1550](https://github.com/compasjs/compas/pull/1550),
  [#1569](https://github.com/compasjs/compas/pull/1569))
- build(deps): bump @babel/eslint-parser from 7.16.5 to 7.17.0
  ([#1571](https://github.com/compasjs/compas/pull/1571))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/formidable from 2.0.3 to 2.0.4
  ([#1560](https://github.com/compasjs/compas/pull/1560))
- build(deps): bump @types/minio from 7.0.11 to 7.0.12
  ([#1558](https://github.com/compasjs/compas/pull/1558))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump @types/node from 17.0.10 to 17.0.14
  ([#1554](https://github.com/compasjs/compas/pull/1554),
  [#1559](https://github.com/compasjs/compas/pull/1559),
  [#1567](https://github.com/compasjs/compas/pull/1567))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump dotenv from 14.2.0 to 16.0.0
  ([#1552](https://github.com/compasjs/compas/pull/1552),
  [#1556](https://github.com/compasjs/compas/pull/1556),
  [#1566](https://github.com/compasjs/compas/pull/1566),
  [#1570](https://github.com/compasjs/compas/pull/1570))
  - [Release notes](https://github.com/motdotla/dotenv/releases)
- build(deps): bump eslint from 8.7.0 to 8.8.0
  ([#1564](https://github.com/compasjs/compas/pull/1564))
- build(deps): bump eslint-plugin-jsdoc from 37.6.3 to 37.7.1
  ([#1557](https://github.com/compasjs/compas/pull/1557),
  [#1576](https://github.com/compasjs/compas/pull/1576))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump pino from 7.6.4 to 7.6.5
  ([#1565](https://github.com/compasjs/compas/pull/1565))
- build(deps): bump sharp from 0.29.3 to 0.30.0
  ([#1568](https://github.com/compasjs/compas/pull/1568))
  - [Release notes](https://github.com/lovell/sharp/releases)
- build(deps): bump simple-get from 4.0.0 to 4.0.1
  ([#1561](https://github.com/compasjs/compas/pull/1561))
  - [Release notes](https://github.com/feross/simple-get/releases)
- feat(cli): improve lint performance
  ([#1579](https://github.com/compasjs/compas/pull/1579))
  - Closes [#1578](https://github.com/compasjs/compas/pull/1578)
- feat(code-gen): print docs consistently
  ([#1563](https://github.com/compasjs/compas/pull/1563))
  - References [#1562](https://github.com/compasjs/compas/pull/1562)
- fix(cli): add '--lint-config' to '--all'
- fix(cli): migrate keep-alive should use connection-settings
  ([#1574](https://github.com/compasjs/compas/pull/1574))
  - Closes [#1572](https://github.com/compasjs/compas/pull/1572)
- fix(server): update docs on 'disableHeaders'
  - Closes [#1555](https://github.com/compasjs/compas/pull/1555)
- test(store): fix flaky session-store tests
  ([#1573](https://github.com/compasjs/compas/pull/1573))

##### Breaking changes

- **deps**: bump dotenv from 14.2.0 to 16.0.0
  - Major version bump
- **deps**: bump sharp from 0.29.3 to 0.30.0
  - Major version bump
- **cli**: improve lint performance
  - `node_modules` are not automatically ignored by ESLint, but should be added
    to your `.eslintignore`
  - The default `.eslintignore` has been changed to ignore files in `generated`
    directories. Run `compas init --lint-config` to update the file.

### [v0.0.183](https://github.com/compasjs/compas/releases/tag/v0.0.183)

##### Changes

- build(deps): bump @babel/core from 7.16.7 to 7.16.10
  ([#1538](https://github.com/compasjs/compas/pull/1538))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/node from 17.0.9 to 17.0.10
  ([#1537](https://github.com/compasjs/compas/pull/1537))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint-plugin-jsdoc from 37.6.1 to 37.6.3
  ([#1542](https://github.com/compasjs/compas/pull/1542),
  [#1546](https://github.com/compasjs/compas/pull/1546))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump nanoid from 3.1.30 to 3.2.0
  ([#1544](https://github.com/compasjs/compas/pull/1544))
  - [Release notes](https://github.com/ai/nanoid/releases)
- build(deps): bump pino from 7.6.3 to 7.6.4
  ([#1541](https://github.com/compasjs/compas/pull/1541))
  - [Release notes](https://github.com/pinojs/pino/releases)
- feat(cli): add `compas completions`
  ([#1526](https://github.com/compasjs/compas/pull/1526))
  - Closes [#1508](https://github.com/compasjs/compas/pull/1508)
- feat(code-gen): generate errors on too much inserts
  ([#1547](https://github.com/compasjs/compas/pull/1547))
  - Closes [#1543](https://github.com/compasjs/compas/pull/1543)
- feat(lint-config): add preferredTypes for primitives, objects and records
  ([#1548](https://github.com/compasjs/compas/pull/1548))
- feat(stdlib): add `setGlobalLoggerOptions` and `extendGlobalLoggerContext`
  ([#1549](https://github.com/compasjs/compas/pull/1549))
  - Closes [#1539](https://github.com/compasjs/compas/pull/1539)

##### Breaking changes

- **lint-config**: add preferredTypes for primitives, objects and records
  - Linter prefers `object` over `Object`, `boolean` over `Boolean`,
    `Record<string,number>[]` over `Array<Object<string, number>>` etc. The
    linter will try to autofix this, but may require multiple runs.
- **stdlib**: add `setGlobalLoggerOptions` and 'extendGlobalLoggerContext'
  - Removed support for `pinoOption` via `newLogger`. Pass these to
    `setGlobalLoggerOptions` as `pinoTransport` and `pinoDestination`.

### [v0.0.182](https://github.com/compasjs/compas/releases/tag/v0.0.182)

##### Changes

- build(deps): bump @types/node from 17.0.8 to 17.0.9
  ([#1532](https://github.com/compasjs/compas/pull/1532))
- build(deps): bump dotenv from 10.0.0 to 14.2.0
  ([#1514](https://github.com/compasjs/compas/pull/1514),
  [#1527](https://github.com/compasjs/compas/pull/1527),
  [#1533](https://github.com/compasjs/compas/pull/1533))
  - [Release notes](https://github.com/motdotla/dotenv/releases)
- build(deps): bump eslint from 8.6.0 to 8.7.0
  ([#1529](https://github.com/compasjs/compas/pull/1529))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump follow-redirects from 1.14.6 to 1.14.7
  ([#1521](https://github.com/compasjs/compas/pull/1521))
  - [Release notes](https://github.com/follow-redirects/follow-redirects/releases)
- build(deps): bump is-animated from 2.0.1 to 2.0.2
  ([#1522](https://github.com/compasjs/compas/pull/1522))
  - [Release notes](https://github.com/qzb/is-animated/releases)
- build(deps): bump minio from 7.0.25 to 7.0.26
  ([#1519](https://github.com/compasjs/compas/pull/1519))
  - [Release notes](https://github.com/minio/minio-js/releases)
- build(deps): bump pino from 7.6.2 to 7.6.3
  ([#1513](https://github.com/compasjs/compas/pull/1513))
  - [Release notes](https://github.com/pinojs/pino/releases)
- docs(route-invalidation): add route-invalidation documentation
  ([#1531](https://github.com/compasjs/compas/pull/1531))
- feat(cli): add `--gitignore` and `--all` support to `compas init`
  ([#1530](https://github.com/compasjs/compas/pull/1530))
  - Closes [#1525](https://github.com/compasjs/compas/pull/1525)
- feat(cli): add informational logs to lint output
  ([#1524](https://github.com/compasjs/compas/pull/1524))
  - Closes [#1516](https://github.com/compasjs/compas/pull/1516)
- feat(code-gen): openApi generator more strict and extend
  ([#1523](https://github.com/compasjs/compas/pull/1523))
  - Closes [#1520](https://github.com/compasjs/compas/pull/1520)
- feat(code-gen): support route invalidations
  ([#1515](https://github.com/compasjs/compas/pull/1515),
  [#1534](https://github.com/compasjs/compas/pull/1534))

##### Breaking changes

- **deps**: bump dotenv from 10.0.0 to 14.2.0
  - Major version bump
- **code-gen**: openApi generator more strict and extend
  - `app.generateOpenApi` accepts `openApiExtensions` and `routeExtensions`
    instead of `openApiOptions`

### [v0.0.181](https://github.com/compasjs/compas/releases/tag/v0.0.181)

##### Changes

- build(deps): bump eslint-plugin-jsdoc from 37.5.1 to 37.6.1
  ([#1511](https://github.com/compasjs/compas/pull/1511))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- chore(create-release): fix cliDefinition
- feat(cli): use ESLint cache, default enable JSDoc rules for `compas lint`
  ([#1510](https://github.com/compasjs/compas/pull/1510))
  - Closes [#1429](https://github.com/compasjs/compas/pull/1429)
- fix(cli): catch import errors when loading project level commands
  ([#1512](https://github.com/compasjs/compas/pull/1512))

##### Breaking changes

- **cli**: use ESLint cache, default enable JSDoc rules for `compas lint`
  - JSDoc related ESLint rules are enabled by default locally now, they were
    already enabled on `CI=true` (which is set by most CI platforms).
  - Add `.cache` to your `.gitignore`. Or specify another ESLint cache directory
    via `--eslint-cache-location`.

### [v0.0.180](https://github.com/compasjs/compas/releases/tag/v0.0.180)

##### Changes

- build(deps): bump @babel/core from 7.16.0 to 7.16.7
  ([#1418](https://github.com/compasjs/compas/pull/1418) ,
  [#1482](https://github.com/compasjs/compas/pull/1482))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @babel/eslint-parser from 7.16.3 to 7.16.5
  ([#1417](https://github.com/compasjs/compas/pull/1417))
  - [Release notes](https://github.com/babel/babel/releases)
- build(deps): bump @types/formidable from 2.0.0 to 2.0.3
  ([#1455](https://github.com/compasjs/compas/pull/1455) ,
  [#1475](https://github.com/compasjs/compas/pull/1475),
  [#1494](https://github.com/compasjs/compas/pull/1494))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump @types/node from 16.11.12 to 17.0.8
  ([#1427](https://github.com/compasjs/compas/pull/1427) ,
  [#1430](https://github.com/compasjs/compas/pull/1430),
  [#1445](https://github.com/compasjs/compas/pull/1445) ,
  [#1447](https://github.com/compasjs/compas/pull/1447),
  [#1450](https://github.com/compasjs/compas/pull/1450) ,
  [#1454](https://github.com/compasjs/compas/pull/1454),
  [#1458](https://github.com/compasjs/compas/pull/1458) ,
  [#1495](https://github.com/compasjs/compas/pull/1495),
  [#1496](https://github.com/compasjs/compas/pull/1496) ,
  [#1498](https://github.com/compasjs/compas/pull/1498))
- build(deps): bump c8 from 7.10.0 to 7.11.0
  ([#1481](https://github.com/compasjs/compas/pull/1481))
  - [Release notes](https://github.com/bcoe/c8/releases)
- build(deps): bump crc from 3.8.0 to 4.1.0
  ([#1449](https://github.com/compasjs/compas/pull/1449) ,
  [#1491](https://github.com/compasjs/compas/pull/1491))
  - [Release notes](https://github.com/alexgorbatchev/node-crc/releases)
- build(deps): bump eslint from 8.4.1 to 8.6.0
  ([#1439](https://github.com/compasjs/compas/pull/1439) ,
  [#1492](https://github.com/compasjs/compas/pull/1492))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-import from 2.25.3 to 2.25.4
  ([#1493](https://github.com/compasjs/compas/pull/1493))
  - [Release notes](https://github.com/import-js/eslint-plugin-import/releases)
- build(deps): bump eslint-plugin-jsdoc from 37.2.0 to 37.5.1
  ([#1423](https://github.com/compasjs/compas/pull/1423) ,
  [#1431](https://github.com/compasjs/compas/pull/1431),
  [#1440](https://github.com/compasjs/compas/pull/1440) ,
  [#1444](https://github.com/compasjs/compas/pull/1444),
  [#1446](https://github.com/compasjs/compas/pull/1446) ,
  [#1487](https://github.com/compasjs/compas/pull/1487),
  [#1497](https://github.com/compasjs/compas/pull/1497))
- build(deps): bump file-type from 17.0.0 to 17.1.1
  ([#1425](https://github.com/compasjs/compas/pull/1425) ,
  [#1436](https://github.com/compasjs/compas/pull/1436),
  [#1471](https://github.com/compasjs/compas/pull/1471))
- build(deps): bump pino from 7.5.1 to 7.6.2
  ([#1448](https://github.com/compasjs/compas/pull/1448) ,
  [#1452](https://github.com/compasjs/compas/pull/1452),
  [#1470](https://github.com/compasjs/compas/pull/1470))
- chore(code-gen,store): let sql generator tests use e2e infra
  ([#1505](https://github.com/compasjs/compas/pull/1505))
- chore(code-gen): let benchmarks use e2e infra for code-gen
  ([#1502](https://github.com/compasjs/compas/pull/1502))
- chore(code-gen): let server, client and open api generator tests use e2e infra
  for code-gen ([#1504](https://github.com/compasjs/compas/pull/1504))
- chore(code-gen): move validator tests to e2e tests
  ([#1501](https://github.com/compasjs/compas/pull/1501))
- chore(docs): remove api reference generator
  ([#1480](https://github.com/compasjs/compas/pull/1480))
- docs(features): add extending the cli docs
- docs(releases): start with 0.0.180 release notes
- feat(cli): refactor CLI
  ([#1456](https://github.com/compasjs/compas/pull/1456),
  [#1459](https://github.com/compasjs/compas/pull/1459),
  [#1460](https://github.com/compasjs/compas/pull/1460),
  [#1467](https://github.com/compasjs/compas/pull/1467),
  [#1468](https://github.com/compasjs/compas/pull/1468),
  [#1469](https://github.com/compasjs/compas/pull/1469),
  [#1474](https://github.com/compasjs/compas/pull/1474),
  [#1476](https://github.com/compasjs/compas/pull/1476),
  [#1477](https://github.com/compasjs/compas/pull/1477),
  [#1479](https://github.com/compasjs/compas/pull/1479),
  [#1484](https://github.com/compasjs/compas/pull/1484))
  [#1485](https://github.com/compasjs/compas/pull/1485))
  [#1486](https://github.com/compasjs/compas/pull/1486))
  - Closes [#1306](https://github.com/compasjs/compas/pull/1306)
- feat(cli): add '--lint-config' to compas init
  ([#1490](https://github.com/compasjs/compas/pull/1490))
  - Closes [#1478](https://github.com/compasjs/compas/pull/1478)
- feat(cli): add 'compas check-env' command
  ([#1483](https://github.com/compasjs/compas/pull/1483))
- feat(code-gen,store): migrate query builder to generator helper
  ([#1499](https://github.com/compasjs/compas/pull/1499))
  - Closes [#1465](https://github.com/compasjs/compas/pull/1465)
- feat(code-gen): add check to unique relation references
  ([#1442](https://github.com/compasjs/compas/pull/1442))
  - Closes [#1437](https://github.com/compasjs/compas/pull/1437)
- feat(code-gen): make reactQuery generator compatible with react-query@v4
  ([#1435](https://github.com/compasjs/compas/pull/1435))
  - Closes [#1422](https://github.com/compasjs/compas/pull/1422)
- feat(code-gen): support date / time only types
  ([#1500](https://github.com/compasjs/compas/pull/1500))
  - Closes [#1421](https://github.com/compasjs/compas/pull/1421)
- feat(code-gen): use primary key type in query-result union types
  ([#1506](https://github.com/compasjs/compas/pull/1506))
- feat(docs): add CLI reference to the docs
  ([#1489](https://github.com/compasjs/compas/pull/1489))
  - Closes [#1462](https://github.com/compasjs/compas/pull/1462)
- feat(server): add options to log middleware to log event name, query and param
  objects ([#1488](https://github.com/compasjs/compas/pull/1488))
  - Closes [#1463](https://github.com/compasjs/compas/pull/1463)
- fix(store): sendTransformedImage requires width higher than zero
  ([#1434](https://github.com/compasjs/compas/pull/1434))
  - Closes [#1428](https://github.com/compasjs/compas/pull/1428)
- fix(store): short circuit image transformer on empty files
  ([#1420](https://github.com/compasjs/compas/pull/1420))

##### Breaking changes

- **deps**: bump @types/node from 16.11.12 to 17.0.8
  - Major version bump
- **deps**: bump crc from 3.8.0 to 4.1.0
  - Major version bump
- **cli**: promote new cli to be used
  - See the release notes for more information
- **code-gen,store**: migrate query builder to generator helper
  - `queryXxx().execRaw` has some output differences, verify your usages.
- **code-gen**: make reactQuery generator compatible with react-query@v4
  - The `useFooBar.baseKey()` functions now returns an array, and is spread when
    used in `useFooBar.queryKey()`

For a detailed description and more details about this release, please read the
[release notes](https://compasjs.com/releases/0.0.180.html).

### [v0.0.179](https://github.com/compasjs/compas/releases/tag/v0.0.179)

##### Changes

- build(deps): bump @types/node from 16.11.11 to 16.11.12
  ([#1407](https://github.com/compasjs/compas/pull/1407))
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- build(deps): bump eslint from 8.3.0 to 8.4.1
  ([#1400](https://github.com/compasjs/compas/pull/1400),
  [#1403](https://github.com/compasjs/compas/pull/1403))
  - [Release notes](https://github.com/eslint/eslint/releases)
- build(deps): bump eslint-plugin-jsdoc from 37.1.0 to 37.2.0
  ([#1410](https://github.com/compasjs/compas/pull/1410))
  - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
- build(deps): bump minio from 7.0.18 to 7.0.25
  ([#1406](https://github.com/compasjs/compas/pull/1406))
  - [Release notes](https://github.com/minio/minio-js/releases)
- build(deps): bump prettier from 2.5.0 to 2.5.1
  ([#1399](https://github.com/compasjs/compas/pull/1399))
  - [Release notes](https://github.com/prettier/prettier/releases)
- chore(server): remove koa-session as dependency
  - Closes [#1398](https://github.com/compasjs/compas/pull/1398)
- feat(stdlib): add config loader
  ([#1415](https://github.com/compasjs/compas/pull/1415))
  - Closes [#1414](https://github.com/compasjs/compas/pull/1414)
- feat(store): skip `eventStop` on Compas internal handled jobs
  ([#1411](https://github.com/compasjs/compas/pull/1411))
- fix(store): fix spacing of 'where' generator helper when working with 'via'.
  ([#1416](https://github.com/compasjs/compas/pull/1416))

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

- store: support POSTGRES\_\{HOST,USER,PASSWORD,DATABASE\}

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
