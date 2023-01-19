# Code-gen Experimental

Experimental redesign and reimplementation of the code-generators. See
https://github.com/compasjs/compas/issues/2010 for the created issue.

## TODO

- [x] Migrate @compas/store
  - This is tested via for example the migrations and all existing tests, so we
    should be fine (A)
- [ ] Support both versions in @compas/cli (visualise command)
- [ ] Duplicate `with-auth` example to code-gen experimental
- [ ] CRUD generator
  - [ ] Static checks
  - [ ] Generate specific types
  - [ ] Generate routes
  - [ ] Generate implementation
- [ ] Duplicate `default` example to code-gen experimental
- [ ] Typescript validators
- [ ] TS Axios API client
  - [ ] Generate react-query wrapper
- [ ] `T.file()` specific types and validations
- [ ] Update `T.any()` to be more inline with the new target system.
- [ ] Update `T.string().pattern()` with `patternExplanation`
- [ ] Self-host store package
- Future ideas;
  - Include `query` + where & builder helpers in the output instead of requiring
    @compas/store. We could probably generate them at `common/database.js`

## Breaking changes

- code-gen:
  - `import { App } from "@compas/code-gen"` -> `Generator`
    - `app.generate` -> `generator.generate`
      - Bunch of changed options, document the common changes and point to new
        documentation about targets.
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
    code-gen handles those better (string vs number) for big serial

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
