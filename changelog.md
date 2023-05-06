---
editLink: false
---

# Changelog

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
