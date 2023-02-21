# Migration guide for the code-gen rewrite

::: warning

`@compas/code-gen/experimental` is still experimental!

:::

The new code generators are here! With built-in support for different target
combinations, a more consistent output and a better safety-net with validators
sprinkled in, in more parts of your application. We've tried to keep the amount
of breaking changes to a minimum. The biggest ones are:

- [A new code generator entrypoint](#replaced-wild-grown-app-with-generator)
  with [different accepted options](#app-generate-generator-generate)
- [Consistent type names](#refactored-how-the-type-names-are-generated)
- More validators in the [router](#validating-router-responses),
  [api clients](#always-validating-api-client-responses) and
  [database queries](#validating-database-inputs-and-outputs)
- And a few other bits and bobs.

## Replaced wild grown `App` with `Generator`

The `App` from `@compas/code-gen` has grown quite a bit over time. Introducing
things like `App#generateTypes` or `App#generateOpenApi` has not made it easier
to use. The accepted options on `App#generate` where also quite a pain to use.

### `App#generate` -> `Generator#generate`

The accepted options are changed drastically. The options are more verbose
making them easily extendable with more targets later on. The `types: {}` and
`validator: {}` generators are implied when necessary by other enabled
generators, so don't need to be added explicitly. See the examples for a
Typescript api client and Javascript backend below. Please use the type
definition of `Generator#generate` to view all the options.

**Typescript API client**

```js
mainFn(import.meta, main);

async function main(logger) {
  const generator = new Generator(logger);
  generator.addStructure(await loadApiStructureFromRemote(/* ... */));

  generator.generate({
    targetLanguage: "ts",
    outputDirectory: "./src/generated",
    generators: {
      apiClient: {
        target: {
          library: "axios",
          targetRuntime: "browser", // or "react-native"
          includeWrapper: "react-query",
          globalClient: false, // This is the default, can be set to `true`
        },
      },
    },
  });
}
```

**Javascript backend**

```js
mainFn(import.meta, main);

async function main(logger) {
  const generator = new Generator(logger);

  // use generator.add(...) or generator.addStructure(storeGetStructure());

  generator.generate({
    targetLanguage: "js",
    outputDirectory: "./src/generated/application",
    generators: {
      database: {
        target: {
          dialect: "postgres",
          includeDDL: true,
        },
        includeEntityDiagram: true,
      },
      router: {
        target: {
          library: "koa",
        },
        exposeApiStructure: true,
      },
      structure: {},
      apiClient: {
        target: {
          library: "axios",
          targetRuntime: "node.js",
        },
        responseValidation: {
          looseObjectValidation: false,
        },
      },
      types: {
        declareGlobalTypes: true,
      },
    },
  });
}
```

### Other generator changes

- `App#extend` is replaced by `App#addStructure`.
- `App#generateTypes` is removed; this was pretty hacky and not really necessary
  for deduplication or type extension. Use the
  `generators.types.declareGlobalTypes` option for global types. Keep manually
  track of your used Compas types or use the full imported names in your JSDoc
  blocks like `import("@compas/stdlib").InsightEvent")` instead of the
  previously available `dumpCompasTypes` option.
- `App#generateOpenAPI` is replaced with the `generators.openApi` option. See
  the available type definition for the supported options.
- `enabledGroups` is removed in favor of `generator#selectGroups` and
  `generator#selectTypes`. These will both return a new generator with the
  selected types and their necessary referenced types.
- `dumpStructure` is replaced by the `generators.structure` option. It creates
  `common/structure.json` instead of a `common/structure.js` file.

## Refactored how the type names are generated

The new code generators use their knowledge of the types and targets to
determine if the base name (`AuthMeResponse`) can be used or if a suffix
(`AuthMeResponseInput`) is necessary. This is done in such a way that the base
name can be used as much as possible in your code. For example, the types
generated for `params` or `body` in the api client will try to use the base name
for the input type. But the route generator will try to use the base names on
`ctx.validatedParams` which is the validated type.

## Auto converting validators

The `.convert()` option is implied now for `T.number()` and `T.array()`. This
means that number inputs used in query params like
`R.get().query({ offset: T.number() })` now work as expected.

Other changes around the validators are:

- Validator functions accept a single argument, the input value, instead of the
  input value and error path.
- The validator results are a plain object instead of already being wrapped with
  an `AppError.validationError()`.
- The error keys are simplified. For example `validator.string.min` and
  `validator.array.max` are now unified in to `validator.length`. You can search
  for existing usages of the old keys with something like
  `/validator\.(\w+)\.(\w+)/`.

## Always validating API client responses

The generated response types in the api client are nice on paper, but could be
far from reality. This could be due to a bug on the api side, or when the API
documentation is not updated. To catch these issues and proof type-correctness,
the generated api client will now always validate the response before returning
it to the caller. There is an extra option added to the api client functions to
skip this behaviour on specific calls.

Other changes around the api clients are:

- The Node.js compatible api clients now need an explicit interceptor to turn
  any error thrown in a `AppError`. You can add this interceptor via
  `axiosInterceptErrorAndWrapWithAppError`

## Validating router responses

The router will now run the response through a validator as well. This ensures
that API clients for Compas backed API's will never get an unexpected response
validation error. It instead will return an internal server error
(`AppError.serverError`), which will automatically be logged as `level: "error"`
since the server doesn't uphold its part of the contract.

Other changes around the router generator are:

- `next` is removed from the controller signatures. This proved unnecessary in
  all cases. If custom Koa middleware is necessary, wrap it up in a custom
  Promise that only resolves once. Search for `return next()` in your codebase
  to find any 'offending' code.
- The exported `router` function from `common/router.js` now accepts the body
  parsers instead of via `setBodyParsers`.

## Validating database inputs and outputs

All queries will now run their inputs and outputs through generated validators.
This could catch issues on inserts and updates. Or even prevent your application
from undefined behaviour when manual inserts are done that don't satisfy the
validator constraints.

Other changes around the generator database queries are:

- `queries` is exported from `common/database.js` instead of `database/index.js`
- `withPrimaryKey` support is removed from `queries.fooInsert`. This is now
  automatically done when a value is given for the primary key in the input.
- Unified the arguments of `fooWhere` and `fooOrderBy`, combining
  `shortName, { skipValidator }` in to `{ shortName, skipValidator }`.
- `queryFoo().execRaw` is now mandatory when a `select`-array is passed. This is
  necessary to skip the database output validators.

## `T.any()` implementations

`T.any().raw()` and friends are deprecated in favor of
`T.any().implementations()`. This allows you to generate specific behaviour
based on which target is currently generated for. The most specific target
combination is tried before taking a more general target (e.g. `tsAxiosBrowser`
is tried before `ts`). See the docs for more information.
