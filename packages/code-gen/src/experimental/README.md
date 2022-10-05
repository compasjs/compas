# Code-gen Experimental

Experimental redesign and reimplementation of the code-generators. See
https://github.com/compasjs/compas/issues/2010 for the created issue.

## TODO

- [ ] Add all type definitions to experimental
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
  - [ ] Add various mutations in `experimental/testing.js`
  - [ ] Update `00-type-definition.js` and `00-type-definition.test.js`
    - Add `T.file()`
    - Add `T.generic()`
    - Add `T.route()`
    - Add `T.relation()`
    - Add `T.routeInvalidation()`
    - Add `T.extend()`
    - Add `T.pick()`
    - Add `T.omit()`
    - Add `T.crud()`
- [ ] Group name checks
  - See `checkIfEnabledGroupsHaveTypes`
- [ ] `extend`, `omit` and `pick` expansion
  - See `preprocessorsExecute`
- [ ] `enableQueries` and `relations` expansion
  - See `addFieldsOfRelations`
- [ ] SQL related checks
  - See `doSqlChecks`
- [ ] `crud` checks
  - See `crudPreprocess`
- [ ] Create sql types to the structure
  - See `createWhereTypes`, `createUpdateTypes`, `createOrderByTypes`,
    `createPartialTypes` and `createQueryBuilderTypes`
- [ ] `crud` route expansion
  - See `crudCreateRoutes`
- [ ] Validate route invalidations
  - See `processRouteInvalidations`
- [ ] Support extracting a few types;
  - Like `Generator#selectGroups`

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
  // This should include the options used for generating somehow. This way we can support consolidating types in to a single output
  addStructure(structureOrDirectory: string | Structure): this {}

  // Create a new generator with a subselection of groups, which have their references resolved.
  selectGroups(groups: string[]): Generator {}

  generate(options: {
    targetLanguage?: "js" | "ts";
    targetRuntime?: "node.js" | "browser" | "react-native";
    outputDirectory?: string;
    generators: {
      structure?: {
        // Enable a structure dump
      };
      openApi?: {
        openApiExtensions?: OpenApiExtensions | undefined;
        openApiRouteExtensions?: Record<string, any> | undefined;
      };
      router?: {
        targetLibrary: "koa";
        dumpApiStructure?: boolean;
      };
      database?: {
        targetDialect: "postgres";
        dumpDDL?: boolean;
      };
      validators?: {
        // Enable generating validators for the base types, some generators will include validators automatically
      };
      types?: {
        useGlobalTypes?: boolean; // Only applicable when using "js" or "ts"
        importPath?: string; // Import types from deduped types
      };
      dedupedTypes?: {
        useGlobalTypes?: boolean;
      };
      apiClient?: {
        targetLibrary?: "axios";
        validateResponses?: boolean;
        globalClients?: boolean;
        withReactHooks?: "react-query";
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
