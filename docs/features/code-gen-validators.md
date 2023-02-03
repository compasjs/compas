# Code generators

::: tip

Requires `@compas/cli`, `@compas/stdlib` and `@compas/code-gen` to be installed

:::

Compas provides various code generators solving two main things:

- Provide a contract between backend and frontends
- Generate typed backend basics like routers, validators and CRUD queries

This document contains the setup and looks at the different types and generated
validators while the next documents are diving in for example the router and api
clients.

## Setup

Let's start by creating a new script in `scripts/generate.js` with the following
contents:

```js
import { mainFn } from "@compas/stdlib";
import { App } from "@compas/code-gen";

mainFn(import.meta, main);

async function main() {
  const app = new App();

  await app.generate({
    outputDirectory: "./src/generated",
    isNodeServer: true,
    enabledGenerators: ["type"],
    dumpStructure: true,
  });
}
```

It creates a new `App` instance which is the code generator entrypoint. After
that we directly call `app.generate`, this is where the magic happens, and the
output files are written. If you execute `compas generate` a few files should
have been created in `src/generated`:

- `common/structure.js`: All information known to the code generators
  serialized. This way you can for example regenerate without knowing the
  original input. This file is controlled by the `dumpStructure` and
  `dumpApiStructure` options.
- `common/types.d.ts`: This file will contain the generated types that we need,
  is controlled by `enabledGenerators: ["type"]`.

## Adding types

Since our setup works now, we can add some types. For this we need to import the
`TypeCreator` from `@compas/code-gen` and create an instance:
`const T = new TypeCreator("todo")`. We pass in `"todo"` as an argument to the
`TypeCreator` to name our collection of types. Each item or type in the code
generators has a 'group', in this case `"todo"` and a name, which we will come
by shortly. The default 'group' name, if not specified, is `"app"`. We also use
`T` as the variable name as a short abbreviation, and would be recommended to
keep as a convention in your projects.

Know that we have a `TypeCreator` we can create some types.

```js
import { mainFn } from "@compas/stdlib";
import { App, TypeCreator } from "@compas/code-gen";

mainFn(import.meta, main);

async function main() {
  const app = new App();
  const T = new TypeCreator("todo");

  app.add(
    // `"item"` is the type 'name', all types added to `app` should have a name.
    T.object("item").keys({
      id: T.uuid(),
      title: T.string(),
      createdAt: T.date(),
      isFinished: T.bool().optional(),
    }),
  );

  await app.generate({
    outputDirectory: "./src/generated",
    isNodeServer: true,
    enabledGenerators: ["type"],
    dumpStructure: true,
  });
}
```

On the `T` (`TypeCreator`) we have a bunch of 'type' methods. These mostly
correspond to the equivalent JavaScript and TypeScript types. Let's check that
out, but first regenerate with `compas generate`.

Our `common/types.d.ts` now contains some relevant types for us, a `TodoItem`
(consisting of the group name (`todo`) and the type name (`item`) as the unique
name `TodoItem`):

```typescript
type TodoItem = {
  id: string;
  title: string;
  createdAt: Date;
  isFinished?: undefined | boolean;
};
```

## Validators

Well you say: 'This ain't fancy, I need to learn a specific DSL just to generate
some TypeScript types that I can write by hand.'. And you would be right if
types where the only things Compas could generate for you. So let's do something
more useful and add validators in to the mix. We can enable validators by adding
`validator` to our `enabledGenerators` option like so:

```js
await app.generate({
  outputDirectory: "./src/generated",
  isNodeServer: true,
  enabledGenerators: ["type", "validator"],
  dumpStructure: true,
});
```

And let's generate again with `compas generate`. This added a few more files:

- `common/anonymous-validators.js`: pure JavaScript validator code internally
  used for all validators in you project, this file can get huge if your project
  grows.
- `todo/validators.js`: The generated `validateTodoItem` function. It used the
  anonymous validators from `common/anonymous-validators.js` to check the input.

Let's do a quick check if our validators are up to something:

```js
// scripts/validator-test.js
import { validateTodoItem } from "../src/generated/todo/validators.js";
import { mainFn, uuid } from "@compas/stdlib";

mainFn(import.meta, main);

function main(logger) {
  // A success result
  logger.info(
    validateTodoItem({
      id: uuid(),
      title: "Finish reading Compas documentation",
      createdAt: new Date(), // We can leave out 'isFinished' since it is `.optional()`
    }),
  );

  // And a validation error
  logger.info(
    validateTodoItem({
      title: "Finish reading Compas documentation",
      createdAt: new Date(),
      isFinished: "true",
    }),
  );
}
```

And check if the validators are doing what they should with
`compas validator-test`. Which should output something like:

```txt
/* ... */ {
  value: [Object: null prototype] {
    id: '114531fb-810d-45cf-819a-856892972acd',
    title: 'Finish reading Compas documentation',
    createdAt: 2021-09-19T09:32:11.359Z,
    isFinished: undefined
  }
}
/* ... */ {
  error: {
    key: 'validator.error',
    status: 400,
    info: {
      '$.id': {
        propertyPath: '$.id',
        key: 'validator.uuid.undefined',
        info: {}
      },
      '$.isFinished': {
        propertyPath: '$.isFinished',
        key: 'validator.boolean.type',
        info: {}
      }
    },
    stack: [
      /** ... */
    ],
  }
}
```

As you can see, the validators either return a `{ value: ... }` or
`{ error: ... }` object. The first being a `{ value: ... }` since the input
object complied with our structure. The second result is more interesting, as it
is an `{ error: ... }` result. It tells us that something is wrong in the
validators (`key: "validator.error"`) and tells us the two places where our
input is incorrect:

- `$.id`: From the input root (`$`), pick the `id` property. We expect an uuid
  (the first part of our key `validator.uuid`), but it is undefined.
- `$.isFinished`: From the input root, pick the `isFinished` property. We expect
  a boolean (`validator.boolean`), but we got the incorrect type (in this case a
  string).

::: tip

Make sure to have a `.env` file with `NODE_ENV=development` in it for local
development so log lines are readable.

:::

We can also add some type specific validators in to the mix, for example our
'TodoItem' title should be at least 10 characters, and the `isFinished` property
should also accept `"true","false"` strings as well as `true` and `false`
booleans.

```js
// In scripts/generate.js
app.add(
  // `"item"` is the type 'name', all types added to `app` should have a name.
  T.object("item").keys({
    id: T.uuid(),
    title: T.string().min(10),
    createdAt: T.date(),
    isFinished: T.bool().optional().convert(),
  }),
);
```

And to check our outputs replace `scripts/validator-test.js` with the following:

```js
// scripts/validator-test.js
import { validateTodoItem } from "../src/generated/todo/validators.js";
import { mainFn, uuid } from "@compas/stdlib";

mainFn(import.meta, main);

function main(logger) {
  // A success result
  logger.info(
    validateTodoItem({
      id: uuid(),
      title: "Finish reading Compas documentation",
      createdAt: new Date(),
      isFinished: "false",
    }),
  );

  // And a validation error
  logger.info(
    validateTodoItem({
      id: uuid(),
      title: "Too short", // 9 characters
      createdAt: new Date(),
    }),
  );
}
```

Regenerate with `compas generate` and run the validators with
`compas validator-test`, which yields the following:

```txt
/* ... */ {
  value: [Object: null prototype] {
    id: '5f1d04c9-2e20-4b76-9720-b699b543978e',
    title: 'Finish reading Compas documentation',
    createdAt: 2021-09-19T09:55:37.073Z,
    isFinished: false
  }
}
/* ... */ {
  error: {
    key: 'validator.error',
    status: 400,
    info: {
      '$.title': {
        propertyPath: '$.title',
        key: 'validator.string.min',
        info: { min: 10 }
      }
    },
    stack: [
      /* ... */
    ],
  }
}
```

As you can see, the `isFinshed` property of the first validator call is accepted
and converted to the `false` value. And the error from the second validate call
now contains our new validator:

- `$.title`: The title property does not confirm the `validator.string.min`
  validator. And it also returns what the minimum length is via `info->min`.

## More types and validators

Compas code generators include a bunch more types and type specific validators.
The following list is not completely exhaustive but should give a general idea
about what to expect. Note that all validators can be combined, eg
`T.number().convert().optional().min(3).max(10)`, which optionally accepts an
integer between 3 and 10 as either a number literal or a string that can be
converted to an integer between 3 and 10`

**boolean**:

| Type                 | Input          | Output               |
| -------------------- | -------------- | -------------------- |
| T.bool()             | true/false     | true/false           |
| T.bool().oneOf(true) | true           | true                 |
| T.bool().oneOf(true) | false          | validator.bool.oneOf |
| T.bool().convert()   | "true"/0/false | true/false/false     |

**number**:

| Type                          | Input | Output                   |
| ----------------------------- | ----- | ------------------------ |
| T.number()                    | 34    | 34                       |
| T.number()                    | 34.15 | validator.number.integer |
| T.number().float()            | 34.15 | 34.15                    |
| T.number().convert()          | "15"  | 15                       |
| T.number().min(5)             | 2     | validator.number.min     |
| T.number().oneOf(30, 50, 100) | 30    | 30                       |
| T.number().oneOf(30, 50, 100) | 60    | validator.number.oneOf   |

**string**:

| Type                               | Input     | Output                     |
| ---------------------------------- | --------- | -------------------------- |
| T.string()                         | "foo"     | "foo"                      |
| T.string()                         | undefined | validator.string.undefined |
| T.string()                         | null      | validator.string.undefined |
| T.string().optional()              | undefined | undefined                  |
| T.string().optional()              | null      | undefined                  |
| T.string().allowNull()             | undefined | undefined                  |
| T.string().allowNull()             | null      | null                       |
| T.string().max(3)                  | "Yess!"   | validator.string.max       |
| T.string().upperCase()             | "Ja"      | "JA"                       |
| T.string().oneOf("NORTH", "SOUTH") | "NORTH"   | "NORTH"                    |
| T.string().oneOf("NORTH", "SOUTH") | "WEST"    | validator.string.oneOf     |
| T.string().pattern(/\d+/g)         | "foo"     | validator.string.pattern   |

**date**:

| Type                | Input                              | Output                   |
| ------------------- | ---------------------------------- | ------------------------ |
| T.date()            | Any input accepted by `new Date()` | Date                     |
| T.date().dateOnly() | "2020-01-01"                       | "2020-01-01"             |
| T.date().dateOnly() | "2020-01"                          | validator.string.min     |
| T.date().dateOnly() | "2020-01001"                       | validator.string.pattern |
| T.date().timeOnly() | "20:59"                            | "20:59"                  |
| T.date().timeOnly() | "24:59"                            | validator.string.pattern |
| T.date().timeOnly() | "10:10:10"                         | "10:10:10"               |
| T.date().timeOnly() | "10:10:10.123"                     | "10:10:10.123"           |
