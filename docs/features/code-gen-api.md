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

In the [validator & type generator](/features/code-gen-validators.html) we have
seen how to utilize the Compas type system to generate types and validators.
Here we are going to get some good use out of them. We are going to create API
route definitions complete with integrated validators.

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

And execute the 'magic', `compas generate`. This created a bunch of new files,
so let's explain a few of them:

- `src/generated/common/router.js`: this contains the full JavaScript route
  matcher, and the router entrypoint `router(ctx, next)` so you can add it to
  your Koa app.
- `src/generated/app/controller`: the file that contains the called controller
  functions, like our `hello` route.

Since all generated files will be overwritten, we need to implement the
controller in a new file. Create the follwing in `src/app/controller.js`:

```js
import { appHandlers } from "../generated/app/controller.js";

appHandlers.hello = (ctx) => {
  ctx.body = "Hello world!";
};
```

And finally we need to mount the generated router on our Koa instance in
`scripts/api.js`:

```js
import { mainFn } from "@compas/stdlib";
import { getApp } from "@compas/server";
import { router } from "../src/generated/common/router.js";

async function main() {
  const app = getApp();
  app.use(router);

  // Since we don't import our controllers any where, we need import them here to load our implementation.
  // Else we would get '405 Not implemented' which is the default generated implementation.
  await import("../src/app/controller.js");

  app.listen(3000);
}
```

::: tip

See [Http server](/features/http-server.html) for more details on `getApp`.

:::

Let's run the server and execute a request:

```shell
compas api
curl http://localhost:3000/hello
```

## Query and path parameters

Routes also support query and path parameters. Let's upgrade our `appHello`
route (group 'app', route 'hello') to accept a thing to say greet, and if the
greeting should be in uppercase.

```js
app.add(
  R.get("/hello/:thing", "helloToThing")
    .params({
      things: T.string(),
    })
    .query({
      // Note the convert. Query parameters are always strings,
      // so to get and validate other primitives we need to enable conversion in the validators.
      upperCase: T.bool().convert().default(false),
    })
    .response(T.string()),
);
```

Let's regenerate first, so we get our validators and typings and then add the
controller implementation for `appHelloToThing` in `src/app/controller.js`:

```js
appHandlers.helloToThing = (ctx) => {
  let greeting = `Hello ${ctx.validatedParams.thing}!`;

  if (ctx.validatedQuery.upperCase) {
    greeting = greeting.toUpperCase();
  }

  ctx.body = greeting;
};
```

The last thing we need to do is add a parser so the query string is parsed and
thus can be validated. Change `srcipts/api.js` to:

```js
import { mainFn } from "@compas/stdlib";
import { getApp, createBodyParsers } from "@compas/server";
import { router, setBodyParsers } from "../src/generated/common/router.js";

async function main() {
  const app = getApp();

  setBodyParsers(createBodyParsers());

  app.use(router);

  // Since we don't import our controllers any where, we need import them here to load our implementation.
  // Else we would get '405 Not implemented' which is the default generated implementation.
  await import("../src/app/controller.js");

  app.listen(3000);
}
```

Lets startup the api again and execute some requests:

```shell
compas api
```

- `curl http://localhost:3000/hello/world`: As expected, results in a
  `Hello world!`
- `curl http://localhost:3000/hello/world?upperCase=true`: Results in
  `HELLO WORLD!`. Quite the greeting.
- `curl http://localhost:3000/hello/world?upperCase=5`: Oops a validator error.
  The query parameters are automatically validated based on the provided
  structure.
- `curl http://localhost:3000/hello/world/foo`: Path params match till the next
  `/` or the end of route. So appending `/foo` results in a 404.
- `curl http://localhost:3000/hello/world/`: However trailing slashes are
  allowed and ignored.

## Advanced usages

- [Route invalidations](/features/route-invalidations.html)

[//]: #
[//]: # "## TODO:"
[//]: #
[//]: # "- Show other http methods & idempotent"
[//]: # "- Show tags"
[//]: # "- Show files upload & serving"
[//]: #
