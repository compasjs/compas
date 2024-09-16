# Code generation targets

Compas code generators are based on a combination of targets. The most important target is
which programming language you want to use: the `targetLanguage`.

```js {6}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "ts",
});
```

The supported target languages are:

- `js`: Generate plain JavaScript. This utilizes
  [ES Modules](https://nodejs.org/api/esm.html#introduction).
- `ts`: Generates TypeScript files

Each of the below generators has support for one or more of these target languages. They
could combine this with supported target libraries, runtimes or dialects depending on the
generator.

To automatically write the generated files to disk, you can use an `outputDirectory`. If
it is not specified all generated files will be returned.

```js {7}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "ts",
	outputDirectory: "./src/generated",
});
```

## Structure

The structure generator dumps the input Compas structure to disk. This is useful for
libraries to expose some types to the user or can be used for post processing. It ignores
all targets.

```js {8}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "ts",
	generators: {
		structure: {},
	},
});
```

## Types

The type generator is enabled for all supported target languages. Other generators will
utilize it to write their specific types. There are few options you can optionally specify

```js {8-11}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "ts",
	generators: {
		types: {
			declareGlobalTypes: true,
			includeBaseTypes: true,
		},
	},
});
```

- `declareGlobalTypes`: This wraps all generated types in a `declare global` block,
  skipping the need to import specific types on usage.
- `includeBaseTypes`: By default, only the used types by the other generators will be
  generated. By enabling this option, all known types in the specification will be
  generated. This can be usefull when you utilize Compas in libraries.

::: tip

If the `targetLanguage` is set to `js`, TypeScript types will still be generated. You can
use these generated types in combination with the TypeScript language server to improve
auto completion. See [Types in JS](https://github.com/voxpelli/types-in-js) for tips and
tricks.

:::

## Validators

Like the type generator, the validator generator also always enabled for all supported
target languages. Compas generators will inject validators in critical parts of the
generated output to ensure that only structurally correct values can pass. Preventing
wrong data or even over sharing information.

```js {8-10}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "ts",
	generators: {
		validators: {
			includeBaseTypes: true,
		},
	},
});
```

- `includeBaseTypes`: By default, only the used types by the other generators will get a
  validator. By enabling this option, all known types in the specification will get a
  generated validator. This can be usefull when you utilize Compas in libraries. This
  value will imply `types.includeBaseTypes`, since the validator generator will
  automatically call the type generator to generate the corresponding input and output
  types.

## API clients

The API client generator provides support to choose your own target library. For some
supported libraries, there is even a need to specify the language runtime.

Supported libraries:

- [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API): This standard is
  supported in combination with the `js` or `ts` target languages.
- [Axios](https://axios-http.com/docs/intro): This library is supported in combination
  with the `js` or `ts` target languages.
- ...we are currently thinking about the next target to support. Feel free to open an
  [issue](https://github.com/compasjs/compas/issues/)!

The Axios and Fetch based API clients also need to differentiate between the supported
runtimes. This is necessary to determine if response validation should be enabled, and to
work around compatibilities of different `FormData` implementations.

```js {8-15}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "ts",
	generators: {
		apiClient: {
			target: {
				library: "fetch",
				targetRuntime: "browser",
				globalClient: true,
				includeWrapper: "react-query",
			},
		},
	},
});
```

- `target.library`: Determine which API library will be used. See above for the supported
  libraries
- `target.targetRuntime`: Specify the runtime which will be used. Accepted values are:
  `node.js`, `browser` and `react-native`. This is only necessary for the `axios` and
  `fetch` targets.
- `target.includeWrapper`: Also generate an API client wrapper to ease integration with
  your UI framework. Supports
  [`react-query`](https://tanstack.com/query/latest/docs/react/overview) to generate React
  hooks, including auto query invalidations if the structure includes them.
- `target.globalClient`: Used by the `axios` and `fetch` targets to generate a global
  `AxiosInstance` or `Fetch`-function. This removes the need to pass the client to each
  generated function. Also supports a global `QueryClient` if the `react-query` wrapper is
  used.
- `responseValidation.looseObjectValidation`: When the `target.targetRuntime` is set to
  `node.js`, the API client responses are automatically validated. This defaults to a
  loose object validation, allowing the response to contain more keys than the type
  suggests. If you use the generated API client for E2E testing, you may want to set this
  option to `false`. This ensures that you don't overshare any data, as the validator will
  error on extra properties in your response.

::: warning

Make sure that you don't share state on the global clients in server contexts. Like when
you use the API client in
[Next.js `getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props).

:::

## Router

Compas also supports generating an optimized router for the available routes in the
structure. This is supported with the `js` target language. The router will automatically
generate the necessary types and validators for route parameters, query parameters,
request bodies and responses.

It has support for the following target libraries:

- [Koa](https://koajs.com/): Generates a Koa compatible router, passing the
  [Koa Context](https://koajs.com/#context) to your controllers.
- ...we are currently thinking about the next target to support. Feel free to open an
  [issue](https://github.com/compasjs/compas/issues/)!

```js {8-13}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "js",
	generators: {
		router: {
			target: {
				library: "koa",
			},
			exposeApiStructure: true,
		},
	},
});
```

- `target.library`: the library to generate a router for.
- `exposeApiStructure`: adds `/_compas/structure.json` which exposes all the available
  routes and necessary types. This can be used by clients to generate a compatible API
  client.

## OpenAPI

Compas is able to convert its structure to an OpenAPI 3 specification compatible format.
This loses some information like [invalidations](/#todo). It can be used to generate API
clients for targets not supported by Compas.

```js {8-11}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "js",
	generators: {
		openApi: {
			openApiExtensions: {},
			openApiRouteExtensions: {},
		},
	},
});
```

- `openApiExtenstions`: An object to override some root properties in the generated
  OpenAPI specification
- `openApiRouteExtensions`: Add metadata to specific routes. This can be used with for
  example OpenAPI's security schemes, to add specific authentication methods to a route.

## Database

The Compas generator can also generate queries for different databases. This is based on
dialects instead of libraries. We are not planning to support different target libraries
for a single dialect per target language.

Supported dialects

- `postgres`: This is supported with the `js` target language via
  [porsager/postgres](https://www.npmjs.com/package/postgres) package.

```js {8-11}
import { Generator } from "@compas/code-gen";

const generator = new Generator();

generator.generate({
	targetLanguage: "js",
	generators: {
		database: {
			target: {
				dialect: "postgres",
				includeDDL: true,
			},
			includeEntityDiagram: true,
		},
	},
});
```

- `target.dialect`: the dialect that will be used
- `target.includeDDL`: include example DDL output to facilitate writing migration files.
- `includeEntityDiagram`: Generate an entity diagram. This is done via
  [Mermaid](https://mermaid.js.org/) and written in a markdown file in to the `common`
  directory.
