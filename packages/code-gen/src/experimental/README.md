# Code-gen Experimental

Experimental redesign and reimplementation of the code-generators. See
https://github.com/compasjs/compas/issues/2010 for the created issue.

## TODO

- [ ] Implement new docs structure

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
      - Link to OpenAPI import, Structure import and building your own structure
        to get started
    - OpenAPI import -> different api clients
    - Structure import -> different api clients
    - Building your own structure
      - Introduction
        - Groups and naming; group by flow + (types, database) groups
      - Types
      - Routes
      - Entities
      - Crud
    - Advanced patterns
      - Route specifics (invalidations, idemptotent)
      - Custom entity primary key, sql default, dates, soft deletes
      - Different entity relation types
      - ESLInt ignores
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
