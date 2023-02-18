# Code-gen Experimental

Experimental redesign and reimplementation of the code-generators. See
https://github.com/compasjs/compas/issues/2010 for the created issue.

## TODO

- [x] Migrate @compas/store
  - This is tested via for example the migrations and all existing tests, so we
    should be fine (A)
- [x] Support both versions (common/structure.js / common/structure.json) in
      @compas/cli (visualise command)
  - We could change this to an option on code-gen. For example switching to
    mermaid to visualise it.
- [x] Supporting dumping Postgres DDL
- [x] Duplicate `with-auth` example to code-gen experimental
- [x] CRUD generator
  - [x] Static checks
  - [x] Static checks on `fromParent.options.name`, normalize `.basePath`
  - [x] Generate readable & writable types
  - [x] Generate route types
  - [x] Generate event implementations
  - [x] Generate route implementations
- [x] Duplicate `default` example to code-gen experimental
- [x] Typescript validators
- [x] TS Axios API client
  - [x] Generate react-query wrapper
- [x] OpenAPI generator
- [x] Update `T.any()` to be more inline with the new target system.
  - `T.any().targets()`
  - `rawValue`, `rawValueImport`, `rawValidator`, `rawValidatorImport`,
    `rawValueDocs`
  - `{ js: {}, ts: {}, jsAxios: {}, tsAxios: {}, jsKoa: {} }`
  - Defaults to `any` in any supported language
  - Warn in the output when a case is missing?
- [x] `T.file()` specific types and validations
  - Should this hook in to the `T.any()` system?
  - Supported variants
    - `{ name?: string, data: Blob }` - Browser -> api client input
    - `(string|{ name?: string, type?: string, uri: string }` - RN -> api client
      input
    - `Blob` - Browser | RN -> api client output
    - `FormidableFile` - router input
    - `{ name?: string, data: ReadableStream|Buffer }` -> node.js api client
      input
    - `ReadableStream` -> node.js api client input
    - `unknown` -> any other scenario
  - Use constants for all places where `GenerateTypeOptions` are used
  - Generate specific validators for `Blob`, `ReadableStream` and
    `FormidableFile`. The other variants are unvalidated inputs (/ validated
    when they hit the api).
- [x] Support overrides for specific properties currently residing in
      `internalSettings`
  - Most likely custom methods on specific builders.
  - `requestBodyType`
- [x] Add support for `T.addRelations()` / `T.extend().addRelations()`
- [x] API client generator, add specific config option to skip the validators on
      specific calls
  - Also expose this in the react-query wrapper
- [x] Add validation on the allowed target combinations
- [x] nit: Normalize `xxxFormatTarget` return types
- [x] Model-relation check if an existing key has the same optionality as the
      relation.
- [x] Use `decodeUriComponent` in the route matcher
- [x] Improve the thrown errors in the validators, adding more information where
      possible.
- [x] Check if `WrappedQueryPart` resolves correctly, or if we need an advanced
      type for that somewhere.
- [x] Database DDL `createdAt`/ `updatedAt` default to `now()`
  - Dubbel check all `withDates` & `withSoftDeletes`
- [x] Update type names
  - Types always get a suffix, only used when necessary
  - Checken of isOptional / default value gebruikt wordt tijdens generaten
  - -> dat opslaan in cache-key
  - -> Als new variant w/ same validator state, same targets used
  - -> Reuse name
- [ ] Write migration docs + breaking changes

### Docs

- Need separate introductions for code-gen and the rest of the tooling
  - Code-gen should be tailored towards the supported targets
    - e.g React, Node.js backend (koa), react-query
  - Backends, about generic tooling and all it's related features
- Generators should link to specific feature pages for implementations & usage
- Structure
  - Generators
    - Introduction
    - Explain different targets
      - Link to OpenAPI import, Structure import, building your own structure.
        To get started
    - OpenAPI import -> different api clients
    - Structure import -> different api clients
    - Building your own structure
      - Introduction
        - Group by flow + (types, database) groups
      - Types
      - Entities
      - Crud
      - Custom routes
    - Advanced patterns
      - Route specifics (invalidations, idemptotent)
      - Custom entity primary key, sql default, dates, soft deletes
      - Different entity relation types
  - Node.js backends
    - Introduction
    - ...exiting pages -> filter out code-gen pages
  - Examples
    - Link up the README's
  - References
    - Compas configuration
    - CLI reference
    - Base migration @compas/store
- Home page CTA's
  - Explore code-gen
  - Explore backend tooling
- Features
  - All in one specification; Build up a specification based on types, routes
    and entities with flexible builders, or import an existing OpenAPI schema.
  - Multi target generators; Reuse a specification and generate types,
    validators, routers, api clients and database queries in different languages
    and with different base libraries.
  - Unified utilities; Session handling, file storage, test runner and more all
    in a few packages.
- Top bar nav;
  - Docs; Generators -> introduction
  - Release notes -> release notes (keep existing sidebar)
  - Changelog -> Changelog (reuse docs sidebar)

### Feature ideas

- Add response validation to the router
- CRUD generator support non-global types
- Remove `skipTrailingSlash` from `internalSettings` since it is not used
  anymore.
- Update `T.string().pattern()` with `patternExplanation`
  - This will improve error readability
- Include `query` + where & builder helpers in the output instead of requiring
  @compas/store. We could probably generate them at `common/database.js`
- Better validation on flat objects for `R.query()` & `R.params()`
- Combine `R.files()` and `R.body()`; auto switch to form-data and enforce flat
  properties when a `T.file()` is present.
- Remove `compas visualise` it is replaced by `includeEntityDiagram`
- Slowly deprecate the compat wrappers of `queriex.xxYY`
- Improve `{@reference UniqueName}` behaviour in docs
- Check if there is a need for option presets in `Generator#generate`.

## Breaking changes

- code-gen:
  - `import { App } from "@compas/code-gen"` -> `Generator`
    - `app.generate` -> `generator.generate`
      - Lots of changed options, document the common changes and point to new
        documentation about targets.
  - Removed `app.generateTypes`
  - Removed `app.generateOpenApi`
  - Removed `app.extend`, ...
  - See diff between `with-auth` and `with-auth-experimental`
- Validators:
  - `T.array()`, `T.bool()` and `T.number()` auto convert always
  - Validator result `error` is a plain object
  - Validator error keys are simplified
  - Validators don't accept a base error property path as the second argument
- Database
  - `queries` is exported from `common/database.js` instead of
    `database/index.js`
  - `queries.xxxInsert(sql, insert, { withPrimaryKey })` -> removed
    `withPrimaryKey`, validating inputs & outputs
  - `queries.xxxAny` -> validating inputs & outputs
  - `xxxWhere(where, shortName, { skipValidator})` ->
    `xxxWhere(where, { shortName, skipValidator })`
  - `xxxOrderBy(orderBy, orderBySpec, shortName, { skipValidator}` ->
    `xxxOrderBy(orderBy, orderBySpec, { shortName, skipValidator })`
  - `.execRaw` is mandatory when a custom `select` or `returning` is used.
  - Watch out for comparisons of `number` primary keys like `StoreJob`. The new
    code-gen handles those better (string vs number) for big serial. In general,
    the output is now run through the validators if no field selectors are used.
  - Use `includeEntityDiagram` instead of `compas visualise`
- API client
  - All responses are automatically validated
  - Use `axiosInterceptErrorAndWrapWithAppError` on your API clients (also in
    testing) to automatically intercept errors and rethrow an AppError.
- Router:
  - Router entrypoint accepts bodyParsers
- Types;
  - Type names are generated without suffix where possible
  - No support for dumping Compas types, file can be maintained manually

#### Refs

**TSConfig**

At some point we should migrate our jsconfig / tsconfig to the TS ES module
support. But that probably triggers a bunch of edge cases.

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["esnext"],
    "module": "NodeNext",
    "checkJs": true,
    "allowJs": true,
    "noEmit": false,
    "maxNodeModuleJsDepth": 0,
    "baseUrl": "./",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noImplicitAny": false,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "extendedDiagnostics": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "typeAcquisition": {
    "enable": true
  },
  "include": ["packages/**/*.js", "packages/**/*.d.ts", "types/**/*.d.ts"],
  "exclude": ["packages/eslint-plugin/**/*", "**/*.test.js", "**/*.bench.js"]
}
```
