# Generating API clients

Compas supports generating API clients for all previously mentioned
[targets](/generators/targets.html#api-clients). There are two main ways to get
started with API client generation

- Based on an OpenAPI specification
- Based on a (remote) Compas structure

## Importing an OpenAPI specification

To import an OpenAPI specification, make sure it is in JSON instead of YAML.
Then it can be converted to a Compas structure and added to the generator.

```js {11-12}
import { readFileSync } from "fs";
import { loadApiStructureFromOpenAPI } from "@compas/code-gen";
import { Generator } from "@compas/code-gen/experimental";
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main(logger) {
  const generator = new Generator(logger);

  const spec = JSON.parse(readFileSync("./specs/openapi.json", "utf-8"));
  generator.addStructure(loadApiStructureFromOpenAPI("pet", spec));
}
```

## Compas (remote) structure

Loading a Compas structure works almost the same as loading an OpenAPI
specification.

```js {11-16}
import { readFileSync } from "fs";
import { loadApiStructureFromRemote } from "@compas/code-gen";
import { Generator } from "@compas/code-gen/experimental";
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

function main(logger) {
  const generator = new Generator(logger);

  const structure = JSON.parse(
    readFileSync("./src/generated/common/structure.json", "utf-8"),
  );
  // Or loading from remote. This will call `/_compas/structure.json`.
  // const structure = await loadApiStructureFromRemote(Axios, "https://compasjs.com/");
  generator.addStructure(structure);
}
```

## Generating

After adding a structure to the generator it is time to generate.

::: code-group

```js [React]
function main(logger) {
  const generator = new Generator(logger);
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
}
```

```js [React-Query wrapper]
function main(logger) {
  const generator = new Generator(logger);
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
}
```

```js [Node.js]
function main(logger) {
  const generator = new Generator(logger);
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
}
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
