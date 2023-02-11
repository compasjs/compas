# Code generator API client

::: tip

Requires `@compas/cli`, `@compas/stdlib`, `@compas/code-gen`, `Axios` and
(optionally) `react-query` to be installed. Also requires the project to be
using TypeScript.

:::

Compas can generate api clients from different sources & for different
consumers. We can read the OpenAPI specification, or get the Compas structure
from a remote Compas based api. We can generate only wrappers around Axios
calls, or provide full-fledged react-query hooks.

## API functions

Generating api functions from a remote structure consists of creating a
'generate' script, which reads either a remote api structure or an OpenAPI
definition and writes a bunch of TypeScript files to disk. It has the following
contents:

```javascript
// scripts/generate.mjs
import { mainFn } from "@compas/stdlib";
import { App, loadFromRemote } from "@compas/store";
import axios from "axios";

mainFn(import.meta, main);

async function main() {
  const app = new App();

  // Either:
  // Load the OpenAPI 3.0 based definiotion somehow in to an object
  const openApiDefinition = {};
  // 'serviceName' is used as the function name prefix if the used api definition is not using tags.
  app.extendWithOpenApi("serviceName", openApiDefinition);

  // OR:
  app.extend(
    await loadFromRemote(
      "https://api.example.com", // Base url of the Compas based api
      axios.create({
        /* ... */
      }),
    ),
  );

  // And finally
  await app.generate({
    outputDirectory: "./src/generated",
    isBrowser: true,
    enabledGenerators: ["type", "apiClient"],
  });
}
```

After calling `node ./scripts/generate.mjs`, you should see some files in
`src/generated`.

::: tip

If the output of `node ./scripts/generate.mjs` consists of only lines with json,
add `NODE_ENV=development` to your `.env` or `.env.local` file.

:::

## Generated output

There are a few cool files to look at;

- `src/generated/common/types.ts`: this file contains all input and output types
  used in the project.
- `src/generated/xxx/apiClient.ts`: these files contain the generated typed api
  functions. As you can see it wraps the an `axios.request` call and returns the
  response data.

By using your IDE and requesting for autocomplete on `apiGroupName` you can see
all generated api functions.

## Introducing react-query

For projects with React, we also support automatically wrapping the generated
api calls in to react-query hooks, using `useQuery` and `useMutations`. To
enable the `react-query` generator add `"reactQuery"` to the `enabledGenerators`
array in `scripts/generate.mjs` and generate again via
`node ./scripts/generate.mjs`.

This needs some setup to let the generated hooks know which Axios instance to
use. You can do that via the exported `ApiProvider` component, which should be
wrapped around the React component tree that uses generated hooks.

Any api `GET` api call uses `useQuery` under the hood, and
`POST, PATCH, PUT & DELETE` calls use `useMutation` which are reflected in the
hooks arguments and return types. All hooks also have two special functions:

- `useTodoSingle.baseKey()`: which returns the root query key without combining
  any input parameters
- `useTodoSingle.queryKey({ /* expects all input params */ })`: for a specific
  query key

With these two you can do custom prefetching, invalidating and optimistic
updates. Invalidations can also be defined from the backend router. That is the
place where the designers should know which data are mutated and, in turn, which
routes should be invalidated. If added, mutation hooks will accept an extra
'hookOptions' object with the option to 'invalidateQueries'. This is off by
default. To check which queries are invalidated, look at the source of the
generated hook.

`GET` requests have another speciality generated. An automatic
`options.enabled`. All required `param`, `query` and `body` parameters are used
to check if `options.enabled` should be set to true or false. This way we don't
do unnecessary network calls that we know will not succeed.

As with the api functions, use autocomplete on `useGroupName` to discover the
generated functions.
