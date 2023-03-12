# Code-gen Experimental

Experimental redesign and reimplementation of the code-generators. See
https://github.com/compasjs/compas/issues/2010 for the created issue.

## TODO

- [x] Implement new docs structure
- [x] Add tests for importing OpenAPI specs for experimental code-gen
- [x] Routes docs
  - get, post, put, delete
  - params, query params, body, response
  - files
  - idempotent
  - invalidations
- [ ] Entity docs
  - default primary key, custom primary key
  - `withDates`
  - `.searchable()`
  - relations: 1-1, M-1, 1-M
  - sql default
  - `withSoftDeletes`
- [ ] CRUD docs
  - What is supported
  - What is the equivalent manual declarations
  - Limitations; eg no file support
- [ ] Clean up `features/` based on information that is already in the
      `generators/` docs.
- [ ] Add `Ky` support in the api client generator

### Feature ideas

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
- Do the deprecations in `AnyType`

#### Refs

**TSConfig**

At some point, we should migrate our jsconfig / tsconfig to the TS ES module
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
