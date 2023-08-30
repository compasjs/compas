---
editLink: false
---

# Changelog

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
