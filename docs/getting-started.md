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
then generate our API client.

We start with installing the main dependencies:

- @lbu/code-gen: The main component for code generating
- @lbu/insight: Logger
- @lbu/stdlib: For providing our main function
- axios: Is required to inject in the api client

```shell script
yarn add -D @lbu/code-gen @lbu/insight @lbu/stdlib
yarn add axios
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
const main = async (logger) => {
  await runCodeGen(logger, () => loadFromRemote("http://localhost:3000")).build({
    plugins: [getTypesPlugin({ emitTypescriptTypes: false }), getApiClientPlugin()],
    outputDir: "./src/generated",
  });
  logger.info("Done generating.");
};
```

The second argument to `runCodGen` is instructing the generator to fetch the
structure from the live api. If you are using Typescript you can toggle the
`emitTypescriptTypes` to `true`. If not, you can safely delete this argument.

```ecmascript 6
mainFn(import.meta, log, main);
```

The last part of this file instructs that the `main`-function should only run
when this file is the entrypoint of the program.

- Create api
- Point out various things like type && type_Optional
- Add mocks to the mix

