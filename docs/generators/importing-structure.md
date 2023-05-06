# Importing a (remote) Compas structure or OpenAPI specification

Starting with the code generators requires a structure. Compas supports both
loading a (remote) Compas structure as well as converting and using an OpenAPI
specification.

## Importing an OpenAPI specification

To import an OpenAPI specification, make sure it is in JSON OpenAPI 3.x format
instead of YAML. Then it can be converted to a Compas structure and added to the
generator.

```js {7-8}
import { readFileSync } from "fs";
import { Generator, loadApiStructureFromOpenAPI } from "@compas/code-gen";

const generator = new Generator();

const spec = JSON.parse(readFileSync("./specs/openapi.json", "utf-8"));
generator.addStructure(loadApiStructureFromOpenAPI("pet", spec));
```

## Compas (remote) structure

Loading a Compas structure works almost the same as loading an OpenAPI
specification.

```js {7-12}
import { readFileSync } from "fs";
import { Generator, loadApiStructureFromRemote } from "@compas/code-gen";

const generator = new Generator();

const structure = JSON.parse(
  readFileSync("./src/generated/common/structure.json", "utf-8"),
);
// Or loading from remote. This will call `/_compas/structure.json`.
// const structure = await loadApiStructureFromRemote(Axios, "https://compasjs.com/");
generator.addStructure(structure);
```

## Generating

After adding a structure to the generator it is time to generate.

::: code-group

```js {5,9-13} [React]
const generator = new Generator();
// ...
generator.addStructure(/* ... */);
generator.generate({
  targetLanguage: "ts",
  outputDirectory: "./src/generated",
  generators: {
    apiClient: {
      target: {
        library: "axios",
        targetRuntime: "browser",
        globalClient: true,
      },
    },
  },
});
```

```js {5,9-14} [React-Query wrapper]
const generator = new Generator();
// ...
generator.addStructure(/* ... */);
generator.generate({
  targetLanguage: "ts",
  outputDirectory: "./src/generated",
  generators: {
    apiClient: {
      target: {
        library: "axios",
        targetRuntime: "browser",
        includeWrapper: "react-query",
        globalClient: true,
      },
    },
  },
});
```

```js {5,9-13} [Node.js]
const generator = new Generator();
// ...
generator.addStructure(/* ... */);
generator.generate({
  targetLanguage: "js",
  outputDirectory: "./src/generated",
  generators: {
    apiClient: {
      target: {
        library: "axios",
        targetRuntime: "node.js",
        globalClient: true,
      },
    },
  },
});
```

:::

Executing the script should give you a bunch of files in `./src/generated`.
Using the newly created API client is now only a quest for calling the correct
function to use.

::: code-group

```tsx [React]
import { useQuery } from "@tanstack/react-query";
import { apiUserList } from "src/generated/user/apiClient";

function MyComponent() {
  const { data } = useQuery({
    queryFn: () =>
      apiUserList({
        offset: 0,
        limit: 10,
      }),
  });
}
```

```tsx [React-Query wrapper]
import { useUserList } from "src/generated/user/reactQueries";

function MyComponent() {
  const { data } = useUserList({
    query: {
      offset: 0,
      limit: 10,
    },
  });
}
```

```js [Node.js]
import { apiUserList } from "../generated/user/apiClient.js";

async function getFilteredUsers() {
  return await apiUserList(
    { offset: 0, limit: 10 },
    {
      filters: {
        emailStartsWith: "foo",
      },
    },
  );
}
```

:::
