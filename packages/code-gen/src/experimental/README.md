# Code-gen Experimental

Experimental redesign and reimplementation of the code-generators. See
https://github.com/compasjs/compas/issues/2010 for the created issue.

## TODO

- [x] Add all type definitions to experimental
  - Add definition to `gen/code-gen-experimental.js`
  - Remove `.default` from these definitions and add where necessary to the
    `builder#baseData`
  - Add various mutations for this type in `experimental/testing.js`
  - Implement the neccessary methods in
    `experimental/processors/00-type-definition.js`
  - Test the `00-type-definition.js` changes in
    `experimental/processors/00-type-definition.test.js`
  - [x] Update `T.reference()`
  - [x] Add `T.uuid()`
  - [x] Add `T.date()`
  - [x] Add `T.array()`
  - [x] Add `T.any()`
  - [x] Add `T.anyOf()`
  - [x] Sync `gen/code-gen-experimental.js`
  - [x] Update `builds/`
  - [x] Add various mutations in `experimental/testing.js`
  - [x] Update `00-type-definition.js` and `00-type-definition.test.js`
    - Add `T.extend()`
    - Add `T.file()`
    - Add `T.generic()`
    - Add `T.relation()`
    - Add `T.route()`
    - Add `T.routeInvalidation()`
    - Add `T.pick()`
    - Add `T.omit()`
    - Add `T.crud()`
- [x] Structure name checks
  - See `checkIfEnabledGroupsHaveTypes`
- [x] Fix all current docs + add tests
  - It's a mess (A), no it isn't but not tested lol
- [x] `extend`, `omit` and `pick` expansion
  - See `preprocessorsExecute`
- [x] Add primary and date fields to query enabled objects
  - See `addFieldsOfRelations`
- [x] Add relations fields of query enabled objects
  - See `addFieldsOfRelations`
- [x] SQL related checks
  - See `doSqlChecks`
- [x] Sort keys of query enabled objects
  - We do this for the same reason as resorting the structure, we need a stable
    output and don't want to sort too often.
  - Also sort relations so we resolve them in the same way each time, we already
    have this, but sorting them may give a better output.
- [x] Setup writers
- [x] Setup target switchers
- [x] Write typescript types
- [x] Cleanup doc blocks
- [x] Setup validator generators
- [x] Generate base validators
- [x] Setup import system in the generate files
- [x] Support extracting a few types;
  - Like `Generator#selectGroups`
- [x] Finish up validators
  - [x] number
  - [x] string
  - [x] uuid
  - [x] generic
- [x] Self-host code-gen/experimental
- [ ] Database generator
  - [ ] SQL types
    - [ ] `xxxWhere`
    - [ ] `xxxUpdate`
    - [ ] `xxxOrderBy`
    - [ ] `xxxInsert`
    - [ ] `QueryBuilder`
  - [ ] Base queries
    - `update`
    - `insert`
    - `delete`
    - `upsertOnId`
  - [ ] Query builder
  - [ ] Helpers
    - [ ] `query`
    - [ ] `whereHelper`
    - [ ] `queryBuilderHelper`
  - [ ] Run all query results through validators
- [ ] Router generator
  - [ ] Check conflicting routes
  - [ ] Build sorted route trie
  - [ ] Generate generic route selecter
  - [ ] Generate Koa target
- [ ] API client generator
  - [ ] Check route invalidations
  - [ ] Generate Axios target
  - [ ] Generate react-query wrapper
  - [ ] Validate responses
- [ ] CRUD generator
  - [ ] Static checks
  - [ ] Generate specific types
  - [ ] Generate routes
  - [ ] Generate implementation
- [ ] `T.file()` specific types and validations
- [ ] Update `T.any()` to be more inline with the new target system.
- [ ] Update `T.string().pattern()` with `patternExplanation`
- [ ] Self-host store package

## Issue

As started with the recent #1908 we should redo some generating based on the
provided or inferred environment.

Current supported environments

- Router: Koa
- Sql: Postgres
- Validators: JS only
- Types: TS / JSDoc
- API client: Node.js, Browser and RN via Axios

See below for the current accepted options:
https://github.com/compasjs/compas/issues/2010#issuecomment-1242922965

Things to solve:

- Get rid of current `isBrowser`, `isNode` & `isNodeServer` options
- Make it easier to target different languages, runtimes and libraries
  - Support Typescript for on the backend or even different languages like Go
  - Support Deno / Bun
  - Like using Fetch instead of Axios
- Consolidate the 'generate-triple' (`App#generate`, `App#generateTypes` and
  `App#generateOpenApi`) in to a single / double cohesive api.

API proposal;

```ts
export class Generator {
  // Like the existing `App#add` accept named types
  add(...types: TypeBuilderLike[]): this {}

  // Add a way to add an existing structure, so it can be generated with different options.
  // This should include the options used for generating somehow. This way we can support
  // consolidating types in to a single output
  addStructure(structureOrDirectory: string | Structure): this {}

  // Create a new generator with a subselection of groups, which have their references
  // resolved.
  selectGroups(groups: string[]): Generator {}

  generate(options: {
    targetLanguage: "js" | "ts";
    outputDirectory?: undefined | string;
    generators: {
      structure?: undefined | {};
      openApi?:
        | undefined
        | {
            openApiExtensions?: undefined | any;
            openApiRouteExtensions?: undefined | any;
          };
      router?:
        | undefined
        | { target: { library: "koa" }; exposeApiStructure: boolean };
      database?: undefined | { target: { dialect: "postgres" } };
      validators?: undefined | { includeBaseTypes: boolean };
      apiClient?:
        | undefined
        | {
            target: {
              library: "axios";
              targetRuntime: "node.js" | "browser" | "react-native";
              includeWrapper?: undefined | "react-query";
            };
            validateResponses: boolean;
            globalClient: boolean;
          };
      types?:
        | undefined
        | {
            useGlobalTypes: boolean;
            useGlobalCompasTypes: boolean;
            generateDeduplicatedTypes: boolean;
            useDeduplicatedTypesPath?: undefined | string;
          };
    };
  }): OutputFile[] {}
}
```

Usage:

```js
const app = new Generator();

app.add(/* ... */);

const publicApi = generator.selectGroups(["public", "other"]);

app.generate({
  targetLanguage: "js",
  targetRuntime: "node.js",
  outputDirectory: "./src/generated/application",
  generators: {
    router: {
      targetLibrary: "koa",
      dumpApiStructure: true,
    },
    database: {
      targetDialect: "postgres",
    },
  },
});

publicApi.generate({
  outputDirectory: "./src/generated/public-api",
  generators: {
    openApi: {
      /* ... */
    },
  },
});

const types = new Generator();

await types.addCompasStructureFile("./src/generated/application");

types.generate({
  targetLanguage: "js",
  targetRuntime: "node.js",
  outputDirectory: "./types/generated",
  generators: {
    types: {
      useGlobalTypes: true,
    },
  },
});
```

This probably won't land in a single Compas release, so we may want to use
`@compas/code-gen/experimental` for the new exports.

## Terminologie

- Flow; a collection of routes in a single group
- Model; `T.object().enableQueries()` / query enabled objects. Has keys and not
  fields.
- Relation; relation between structureModels with an owning and inverse side

## Design

- Public API is designed exactly as proposed
- String concatenation;
  - String concatenation that happens multiple times in the generators, like
    unique names are put in 'string-format.js'.
- Errors:
  - As done in the current code-gen, error strings should be formatted when they
    are created. If it is possible to combine errors, they should be thrown via
    `errorThrowCombinedError`. See its docs for other supported properties in
    the info object.
  - Low level filesystem errors are thrown as is.
- Context;
  - The full generator path is called unconditionally. This means that we may do
    extra function calls when not necessary. Each called function should check
    if it should do something.
  - The context is used to provide the structure, options and collected
    outputFiles to each function.
- Options;
  - If an output directory is provided, files are written. They are always
    returned to the caller.

### Structure traversal

- Exec function on each type
  - ie. finding all query enabled objects or finding all routes
  - Keeping state for structureValidateReferences
- Exec function on each type, replacing the value
  - ie when extracting references or expanding omit & pick

Traversing the structure is a complicated choice with various trade-offs. We
want to optimize for the following cases;

- Speed
  - Less function calls -> more faster
- Places to edit
  - It should be easy to add a new nested type and shouldn't require knowledge
    of the whole codebase
- Semantics
  - The semantics of the provided traversal helpers should be easy to understand

See implementation of `typeDefinitionTraverse`

## Templating and code-gen

See
https://github.com/awslabs/smithy/blob/main/smithy-utils/src/main/java/software/amazon/smithy/utils/AbstractCodeWriter.java

- Probably want to go with 'OOP' here; or decide how we can minimize params
  passed to the writers in such a way to have decent convenient internal API.
  - Base writer
    - Manages files
    - Internally strings
    - Newlines
    - Scopes
    - Indentation
  - Language specific writers
    - Documentation blocks
    - Functions
    - control flow
    - imports
  - Generator-specific writer extending language writers
    - Generator-specific constructs
    - Each language-specific implementation of a generator should have the same
      API
- Outputfiles in the generate context may become something like:
  - `Map<path, { contents: string[] }>`
  - This results in not having to a generate each file in one pass, but instead
    provide some API's to `getAndCreate`, `checkIfExists`, etc.
- Support strict language implementation. We want to pass strict compile / lint
  checks for each target language / runtime / library.
  - Determine, document and test the strict Typescript & typescript-eslint
    settings that are supported
  - Determine, document and test the strict ESLint settings that are supported

### Types & validators

- The legacy code-gen generates a lot of types that are unused. When only the
  api client is used only the validator input types are needed, but the
  validated variant is always included as well. In cases where the router is
  used as well, we need both input & output types. As a result we should apply
  the following steps:
  - Always run the `router` generator before the `apiClient` generator. This
    generator should first register the validated type and then the validator
    input types
  - We don't generate types and validators for unused types. To enable this
    `type.includeBaseTypes` and `validator.includeBaseTypes` should be used. In
    most cases this is not necessary, except when you use the generators without
    `databaase`, `router` or `apiClient` settings.
- Generating a type should expect at least the following options:
  - `scenario: "validatorInput" | "validatorOutput"`
  - `typeOverrides: { file: "ReadableStream" }|{ file: "Blob" }|{ file: "FormData" }"`
  - `suffix: string`
- Validators always convert `boolean`,`number`, `date` fields to their native
  type if a string or number is passed.
- Validators are always included for `database` and `apiClient`. They can be
  disabled via `$generator.skipValidatorGeneration`.
  - The current query builder is already generating correct structures to just
    pass through.
  - The performance of an object with array({ length: 1000 }) takes `1/6` of a
    millisecond. Which shouldn't be a major concern.
  - API client response validation ensures a more expected result. And is
    stricter when the api is not tested. We may want to soft fail here instead,
    not sure yet.
- The validator generator is always(!) enabled and can be used on demand.
- Global deduped types are only a hack used for the TS in the JSDoc case where
  types can be used globally. Importing the types gives a better IDE experience,
  but a worse end user experience. I think we can get away by not deduping
  anything. Currently, if types are needed in different variants but with the
  same name, the deduper isn't always able to solve that. So just generating
  moore `declare global` types and using a correct jsconfig/tsconfig, should be
  a better experience.

Necessary API's:

- `$langCreateInlineType(typeDefinition, { scenario, typeOverrides }): string`
- `$langCreateRegisteredType(context, typeDefinition, { scenario, typeOverrides, nameSuffix, usedInRelativePath }): string`
  - Should return import path?
  - Should return named type.
- `$langRegisterValidator(context, typeDefinition, { typeOverrides })`

#### Refs

**TSConfig**

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
