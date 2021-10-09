# Code generator HTTP api

The next code generators all resolve around creating and consuming structured
HTTP api's. If you are only interested in consuming Compas backed api's in
frontend projects, see
[code gen api client](/features/code-gen-api-client.html).

::: tip

Requires `@compas/cli`, `@compas/stdlib`, `@compas/server` and
`@compas/code-gen` to be installed.

:::

## Getting started

In the [validator & type generator](/code-gen-validators.html) we have seen how
to utilize the Compas type system to generate types and validators. Here we are
going to get some good use out of them. We are going to create API route
definitions complete with integrated validators.

The `TypeCreator (T)` also contains the entry point for the route system, with
`T.router(path)`. Let's define our first route:

```js
const app = new App();
const T = new TypeCreator("app");
const R = T.router("/");

app.add(R.get("/hello", "hello").response(T.string()));
```

And add `"router"` to the `enabledGenerators` in our `app.generate()` call like
so:

```js
await app.generate({
  outputDirectory: "./src/generated",
  isNodeServer: true,
  enabledGenerators: ["type", "validator", "router"],
  dumpStructure: true,
});
```

And execute the 'magic', `yarn compas generate`. This created a bunch of new
files, so let's explain a few of them:

- `src/generated/common/router.js`: this contains the full JavaScript route
  matcher, and the router entrypoint `router(ctx, next)` so you can add it to
  your Koa app.
- `src/generated/app/controller`: the file that contains the called controller
  functions, like our `hello` route.

[//]: #
[//]: # "## TODO:"
[//]: #
[//]: # "- Implement controller"
[//]: # "- Add to Koa app, reference http-server.html"
[//]: # "- Do a call"
[//]: # "- A query & params, with body parser"
[//]: # "- Show validation"
[//]: # "- Show other http methods & idempotent"
[//]: # "- Show tags"
[//]: # "- Show files upload & serving"
[//]: #
