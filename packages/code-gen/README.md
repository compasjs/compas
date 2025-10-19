# @compas/code-gen

<p>
  <a href="https://packagephobia.com/result?p=@compas/code-gen" target="_blank">
    <img src="https://packagephobia.com/badge?p=@compas/code-gen" alt="Install size">
  </a>

  <a href="https://github.com/compasjs/compas/actions/workflows/checks.yml" target="_blank">
    <img src="https://github.com/compasjs/compas/actions/workflows/checks.yml/badge.svg" alt="CI status badge">
  </a>
  <a href="https://codecov.io/gh/compasjs/compas" target="_blank">
    <img src="https://codecov.io/gh/compasjs/compas/branch/main/graph/badge.svg?token=81D84CV04U" alt="Codecov status">
  </a>
</p>

---

Code generators for routers, validators, SQL queries, API clients and more. Take
a look at the [documentation](https://compasjs.com/getting-started.html).

## Maintenance mode

Compas is in maintenance mode. The packages will be maintained for the
foreseeable future. New features might be added, but some will also be dropped
in favor of other ecosystem-available libraries. Please don't start new projects
using Compas.

## As a server

```js
mainFn(import.meta, main);

async function main() {
  const app = new App();

  const T = new TypeCreator("post");
  const R = T.router("/post");

  app.add(
    new TypeCreator("database")
      .object("post")
      .keys({
        title: T.string().searchable(),
        body: T.string(),
      })
      .enableQueries({ withDates: true }),

    T.crud("/post").entity(T.reference("database", "post")).routes({
      listRoute: true,
      singleRoute: true,
      createRoute: true,
      updateRoute: true,
      deleteRoute: true,
    }),
  );

  await app.generate({
    outputDirectory: "./src/generated/application",
    dumpStructure: true,
    dumpApiStructure: true,
    dumpPostgres: true,
    enabledGenerators: ["validator", "router", "sql", "apiClient"],
  });
}
```

## As a client

```js
mainFn(import.meta, main);

async function main() {
  const app = new App({ verbose: true });

  const fromRemote = await loadApiStructureFromRemote(
    Axios,
    "https://some.compas.powered.backend",
  );

  app.extend(fromRemote);

  await app.generate({
    outputDirectory: "./src/generated",
    isBrowser: true,
    enabledGenerators: ["type", "apiClient", "reactQuery"],
  });

  await spawn("yarn", ["format"]);
}
```
