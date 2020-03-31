# Getting started

_Some fancy intro text_

For both API creators and API users there is a separate 'Getting started'. This
will explain step-by-step from minimal project setup till running your first
code generator. After that, concepts and docs will be shared between and quotes
in the docs can be used to add specific notes for either API creators or users

### Prerequisites both API creator & API consumer

Since LBU uses experimental ES Modules, at least Node.js 13 is required. Further
more when you are using Typescript in your project, make sure you `allowJs` is
set to `true` in your `tsconfig.json`.

### Getting started as an API consumer

As the API consumer we set up infrastructure to fetch the API specification &
then generate our API client. Let's build a simple Todo app.

We start with installing the main dependencies:

- @lbu/code-gen: The main component for code generating
- @lbu/insight: Logger
- @lbu/stdlib: For providing our main function
- axios: Is required to inject in the api client
- chance: You'll see ;)

```shell script
yarn add -D @lbu/code-gen @lbu/insight @lbu/stdlib
yarn add axios chance
```

Now we are ready to setup our code generator script. In general this is a one
time setup. And then whenever the API changes you can just run this again. So it
is advised to keep this script under version control.

Create a new script called `generate.js`.

> Note: When package.json#type !== "module" you should use the .mjs extension

Let's start with the imports:

```ecmascript 6
import {
  loadFromRemote,
  runCodeGen,
  getTypesPlugin,
  getApiClientPlugin,
} from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
```

From `code-gen` we import the following:

- `loadFromRemote`: Allows fetching the LBU schema from an LBU based API
  instance.
- `runCodeGen`: Main entrypoint in for the code-gen package.
- `getTypesPlugin`: Constructs a new code generator plugin to build JsDoc or
  Typescript types
- `getApiClientPlugin`: Constructs a new code generator plugin to build the api
  client

Then the imports from `insight` & `stdlib` enable us to have a dedicated logger
and the ability to only run a function when that the file is the main entrypoint
of a program.

Let's tie all imported functions together in to a single main function:

```ecmascript 6
async function main(logger) {
  await runCodeGen(logger, () => loadFromRemote("https://lbu-e2e.herokuapp.com")).build({
    plugins: [getTypesPlugin({ emitTypescriptTypes: false }), getApiClientPlugin()],
    outputDir: "./src/generated",
  });
  logger.info("Done generating.");
}
```

The second argument to `runCodGen` is instructing the generator to fetch the
structure from the live api. If you are using Typescript you can toggle the
`emitTypescriptTypes` to `true`. If not, you can safely delete this argument.

```ecmascript 6
mainFn(import.meta, log, main);
```

The last part of this file instructs that the `main`-function should only run
when this file is the entrypoint of the program.

It's time to do the generation! Run this newly created file:
`node ./generate.js` (or the `.mjs` variant). You may check the files in
`./src/generated`. Note that it's not pretty, so run whatever formatter you want
on the files.

- types.{js,ts}: This file contains all 'Models'. The JsDoc in the different
  JavaScript files can reference this for easier typechecked arguments
- apiClient.js: The fully generated api client.

Currently the apiClient expects you to provide your own axios instance. You can
provide it like so:

```typescript
import axios from "axios";
import * as api from "../generated/apiClient.js";
api.createApiClient(
  axios.create({
    baseURL: "https://lbu-e2e.herokuapp.com",
  }),
);
```

> Note: Your import may be different depending on where you create this file and
> the outputDir in generate.js

Now it should be pretty straight forward to use the api.

For example, to get your own todo lists:

```
await api.todo.all();
```

To get one todo list by name:

```typescript
await api.todo.one({ name: "Default List" });
```

If you have a decent editor you noticed the first argument to `api.todo.one` is
called `params` which expects an object. These arguments are generated when
necessary by lbu, and always in the following order:

- `params`: Route params, often used for ids like `/user/:id`
- `query`: Query parameters, often used for sorting, filtering or paginating
  like `&search=foo`
- `body`: Body payload, since lbu, at the moment, supports only json, this will
  be the json body of your post & put requests

Another feature supported by the code generator and api client is to
automatically mock routes that are not implemented.

Change the `@lbu/code-gen` import in `./generate.js` to the following:

```ecmascript 6
import {
  loadFromRemote,
  runCodeGen,
  getTypesPlugin,
  getApiClientPlugin,
  getMocksPlugin,
} from "@lbu/code-gen";
```

Also add the following to the `plugins` array in `./generate.js`:

```ecmascript 6
await runCodeGen(logger, () => loadFromRemote("https://lbu-e2e.herokuapp.com")).build({
  plugins: [getTypesPlugin({ emitTypescriptTypes: false }), getApiClientPlugin(), getMocksPlugin()],
  outputDir: "./src/generated",
});
```

> Again, change emitTypescriptTypes to true if you are using Typescript

Let's run the generator again: `node ./generate.js`. If you want to see the
changes in `[outputDir]/apiClient.js` make sure to format the file, with for
example Prettier.

The example api contains several unimplemented routes and are conveniently
grouped under `api.unimplemented`. Run for example the following snippet a few
times, and notice that you get a different result each time:

```ecmascript 6
console.log(await api.unimplemented.user())
```

This executes a GET request to `/unimplemented/user` and the server will respond
with a `405 Not implemented`. The api client catches that specific error, and
will automatically call the appropriate mock for the expected response. All
other errors will be throw again.

For fun there is also `api.unimplemented.settings()`, which shows randomly
generated enums, arrays and union types

### Footnotes

**Optional:**

All types in lbu are generated twice:

- Once with respect to default values
- Once without default values

This allows the api client to use the correct type for optional values, and with
the 'same' type, allows the validator to return the default value instead of
`undefined`

**Validator:**

There is also a validator plugin, this plugin generates validator functions for
the provided models. Currently uses only specific registered models. But if
there is interest, it should be pretty straight forward, to generate validators
for all models.

**Models:**

All communication in Lbu is driven by Models, these models are turned in to
either JsDoc or Typescript types and referenced in whatever way you want.

Say we want to build a Websocket plugin:

- We define the message structure
- Provide these to lbu
- Lbu will call our plugin
  - This plugin contains some boilerplate
  - This plugin generates specific functions for the provided message structures
    and references types from `types.{js,ts}`

**Server side testing:**

The server has various options to make testing easier:

- Use the api client on the backend as well for E2E tests
- Use the generated mocks & directly inject into the route functions
