# Code generation

## The basics

The code generators is build using a few different items:

- TypeBuilder: The base for all types. Contains various utilities like
  `optional` and `docs`.
- TypeCreator: Creates instances of classes that extends TypeBuilder. Often
  abbreviated to `T`.
- App: Entry point of code generation. Stores all 'added' types and makes sure
  to pass them to the generators.

All constructed types are put in to groups and can be named or unnamed. Types
directly registered to the app should all have a name. The group is managed when
constructing a TypeCreator, while the names are passed to the different methods
of the TypeCreator, while instantiating a TypeBuilder.

A small example:

```javascript
const T = new TypeBuilder("todo");
app.add(T.bool("completed")); // Fully qualified name of `TodoCompleted`
app.add(T.bool()); // Error: no name provided
```

## The App

The app is constructed with `await App.new()` and after that ready to generate
any number of times. It provides a few methods for adding types and doing
generation. Normal types can be added with `app.add()`. This accepts any number
of parameters. Another way is calling `app.extend()` with a full structure. This
structure is not yet stable between releases and thus not documented. However a
structure created by a specific lbu version, can always be consumed by the same
version. The use case for `app.extend` is two fold:

- Used by frontend/app teams with the fetched structure
- Useable for backend/frontend/app teams for adding external api's converted via
  the OpenAPI importer (`convertOpenAPISpec`)

When all needed types are added, multiple calls can be done to `app.generate`. A
call to `app.generate` looks something like the following:

```javascript
app.generate({
  dumpStructure: false, // Enable when developing the backend
  enabledGenerators: ["types", "validator", "router"], // or "apiClient", "reactQuery", "sql"
  // When groups are not provided they are all enabled.
  // The code-generator is smart enough to resolve references across groups
  enabledGroups: ["one", "orMore", "groups"],
  useTypescript: true, // generates typescript types
  outputDirectory: "./relative/path/from/root",
});
```

## The generators

There are various generators provided by the base code-gen package. Some do
generate for all available types, others have specific calls that need to be
done. See further in this file for a more extensive information.

- **Types**: generates a `types.js` or `types.ts` file where all 'added' types
  are put. It also generates an `_Input` variant, which basically represents the
  value before it passes through a validator.

- **Validator**: generate validator functions for all types. This does all the
  conversions, and places default values.

- **Router**: generate a router with appropriate validator calls. See below for
  more information.

- **ApiClient** and **ReactQuery**: Create api clients for the generated router

- **Sql**: Generate Postgres queries for `Select`, `Insert`,`Update`,`Upsert`
  and `Delete` statements.

## The Types

The code-gen package comes with a number of default types. Below a list of them
with a short description, some extra functionality provided by a generator, and
how you can create it via the TypeCreator (`T`).

**Basic**:

- **Boolean**: created with `T.bool()` it represents either true or false.
  However by using the `.oneOf` function it can represent a single state. The
  validator adds support for converting incoming strings like `"true"` via the
  `.convert()` method.

- **Number**: created with `T.number()` it represents an integer. Via `.float()`
  enforceable to also accept floating point numbers. It is also possible to
  parse from string with the validators (`.convert()`) and providing minimum and
  maximum values via `.min()` and `.max()`.

- **String**: created with `T.string()`. The validator has various utilities
  build in for this type as well.

  - `.min()` and `.max()` to enforce a length. The default length is one (1).
  - `.trim()`, `.lowercase()` and `.uppercase()` for sanitizing some data
  - `.pattern()` to check with a regular expression
  - `.oneOf()` to enforce specific values. This is also the way to create an
    'enum'-like.
  - `.isOptional()` allow empty and undefined values. Empty strings are
    automatically converted to undefined values.

- **Object**: created with `T.object()` supports string keys and other
  TypeBuilders as values.

- **Array**: created by `T.array()` represents a 'single' type array. The value
  type can be specified with `.values()`

- **AnyOf**: created with `T.anyOf` represents any of the provided types added
  by `.values()`. Note that when validating, they are evaluated from left to
  right.

- **Generic**: created with `T.generic()` a generic object, where both `.keys()`
  and `.values()` should be specified.

- **Any**: created with `T.any`, represents any type.

- **Date**: created with `T.date()`, accepts ISO8601 strings while validating
  and returns a JS Date object

- **Uuid**: created with `T.uuid()` is a type based on `T.string()` using a
  regular expression.

- **Reference**: created with `T.reference()`, is a reference to a 'named' type.
  This type can be used in all cases where a TypeBuilder is accepted.

- **Relation**: created with `T.relation()`, is only acceptable in `app.add`
  calls. Denotes a relation between different Object types.

- **File**: created with `T.file()` has its use with the router generator for
  file uploads.

**Advanced**:

- **Optional**: created with `T.optional()` can make an optional copy of the
  passed in type

- **Omit**: created with `T.omit()` allows to remove a subset of keys from a
  passed in object

- **Pick**: created with `T.pick()` allows pick a subset of keys from the passed
  in obejct

## Inferred types

Some types can be inferred and don't need the full method chain like
`T.object().keys()`. Inferred types can only be used with 'non-named' types.

Some examples and their `T.xx` counter parts

Booleans:

```javascript
app.add(true); // T.bool().oneOf(true)
app.add(false); // T.bool().oneOf(false)
```

Numbers:

```javascript
app.add(5); // T.number().oneOf(5)
```

Strings:

```javascript
app.add("various"); // T.string().oneOf("various")
```

Objects:

```javascript
// The following won't work, as top level calls should be named
app.add({ foo: T.bool() }); // Error
app.add(
  T.object("nested").keys({
    // inferring works recursive and almost everywhere a TypeBuilder should be provided
    myString: "various",
    nestedObject: {
      qualified: T.bool(),
      staticAmount: 5,
    },
  }),
);
```

Arrays:

```javascript
app.add([T.string()]); // Error, top level types should be named
app.add(
  T.object("name").keys({
    numberArray: [T.number()], // T.array().values(T.number().integer())
    objectArray: [
      {
        type: "bar",
        value: T.bool(),
      },
    ],
  }),
);
```

### Generator integrations

Some generators work stand alone, some always require another generator to be
enabled. The following is a complete integration list:

- The `type` generator is required by all other generators. In case of JSDoc
  types, they just use them. When `useTypescript` is provided, they are used so
  that Typescript understands it.
- The `router` generator expects the `validator` generator to be enabled. The
  validators are automatically inserted to validate route and query parameters,
  but also the body if needed.
- The `reactQuery` generator expects the `apiClient` to be enabled. The
  generated hooks will internally call the functions provided by the
  `apiClient`.
- The `apiClient` assumes validators are enabled when `isNodeServer` is provided
  to `App#generate`. This automatically enables response validation and
  conversion of errors to `AppError`. External api's used by the current
  application should be generated with separate `App#generate` calls.
