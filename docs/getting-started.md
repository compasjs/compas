# Getting started

_Some fancy intro text_

For both API creators and API users there is a separate 'Getting started'. This
will explain step-by-step from minimal project setup till running your first
code generator. After that, concepts and docs will be shared between and quotes
in the docs can be used to add specific notes for either API creators or users

### Prerequisites both API creator & API consumer

Since LBU uses experimental ES Modules, at least Node.js 14 is required. Further
more when you are using Typescript in your project, make sure you set `allowJs`
to `true` in your `tsconfig.json`.

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
import { App, coreTypes, generators, loadFromRemote } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
```

From `code-gen` we import the following:

- `App`: The main abstraction that manages generators and types
- `coreTypes`: Every type, be it string, number or array, has its own type
  plugin. For now, we only need the types provided in `coreTypes`.
- `generators`: A collection of generator plugins provided in code-gen.
- `loadFromRemote`: Allows fetching the LBU schema from an LBU based API
  instance.

Then the imports from `insight` & `stdlib` enable us to have a dedicated logger
and the ability to only run a function when that the file is the main entrypoint
of a program. e.g. `node ./generate.js`.

Let's tie all imported functions together in to a single main function:

```ecmascript 6
async function main() {
  const app = new App({
    generators: [generators.apiClient, generators.model],
    types: [...coreTypes],
    outputDir: "./src/generated",
    useTypescript: false,
    verbose: true,
  });

  await app.init();

  app.extend(await loadFromRemote("https://lbu-e2e.herokuapp.com"));

  await app.generate();
}

mainFn(import.meta, log, main);
```

First we instantiate an App. To do that, we provide the generators we want to
use, apiClient and model. The apiClient plugin generates an api client based on
Axios. The model generator will generate JsDoc or Typescript types for all
defined types, i.e input & outputs to our api. To use the Typescript types
variant, change `useTypescript` to `true`.

Next we specify that we want to use all our core types. These types provide the
generator plugins with the required knowledge to generate for example the
correct JsDoc and Typescript types.

The last notable argument is the `outputDir`. The result of our generators will
be put in this directory.

The last part of this file instructs that the `main`-function should only run
when this file is the entrypoint of the program.

> This abstraction is useful for when you have files that can operate alone, but
> also can be imported. With CommonJs it was as easy as
> `if (module === require.main) {` but with ES modules it becomes a bit harder
> to do.

It's time to do the generation! Run this newly created file:
`node ./generate.js` (or the `.mjs` variant). You may check the files in
`./src/generated`. Note that it's not pretty, so run whatever formatter you want
on the files.

- types.{js,ts}: This file contains all 'Models'. The JsDoc in the different
  JavaScript files can reference this for better auto complete and specification
  of arguments
- apiClient.js: The fully generated api client.

Next we are going to use the generated files

Currently the apiClient expects you to provide your own axios instance. You can
provide it like so:

```typescript
import axios from "axios";
import { createApiClient, todoApi } from "../generated/apiClient.js";

createApiClient(
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
await todoApi.all();
```

To get one todo list by name:

```
await todoApi.one({ name: "Default List" });
```

If you have a decent editor you noticed the first argument to `todoApi.one` is
called `params` which expects an object. These arguments are generated when
necessary by lbu, and always in the following order:

- `params`: Route params, often used for ids like `/user/:id`
- `query`: Query parameters, often used for sorting, filtering or paginating
  like `&search=foo`
- `body`: Body payload, since lbu, at the moment, supports only json, this will
  be the json body of your post & put requests

Another feature supported by the code generator and api client is to
automatically mock routes that are not implemented.

Add the `generators.mock` to the generator array `./generate.js`, so it will
look something like:

```ecmascript 6
const app = new App({
  generators: [generators.apiClient, generators.model, generators.mock],
  types: [...coreTypes],
  outputDir: "./src/generated",
  useTypescript: false,
  verbose: true,
});
```

Let's run the generator again: `node ./generate.js`. If you want to see the
changes in `[outputDir]/apiClient.js` make sure to format the file, with for
example Prettier.

The example api contains several unimplemented routes and are conveniently
grouped under `unimplementedApi`. Run for example the following snippet a few
times, and notice that you get a different result each time:

```ecmascript 6
console.log(await unimplementedApi.getUser())
```

This executes a GET request to `/unimplemented/user` and the server will respond
with a `405 Not implemented`. The api client catches that specific error, and
will automatically call the appropriate mock for the expected response. All
other errors will be throw again.

For fun there is also `unimplementedApi.settings()`, which shows randomly
generated enums, arrays and union types

### Getting started as an API consumer

Simply init a new project with `npx @lbu/cli init [name]`. If name is provided,
the init will create a new subdirectory, else it will use the current directory
for the name.

> Note: On 0.0.10 template is broken :S

There are a few commands available out of the box:

- `yarn lbu generate`: Run the code generators, this has all core provided
  generators enabled by default.
- `yarn lbu api`: Run the api, for example `http :3000/_health` should return a
  `200 OK`.

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
