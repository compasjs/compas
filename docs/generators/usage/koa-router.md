# Koa compatible router

As mentioned in [the targets](/generators/targets.html), Compas supports
generating a [Koa](https://koajs.com/) compatible router.

```js
import { Generator } from "@compas/code-gen/experimental";

const generator = new Generator();

// Build your own structure or import an existing one

generator.generate({
  targetLanguage: "js",
  outputDirectory: "./src/generated",
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

## Setup

```js
import Koa from "koa";
import { router } from "./src/generated/common/router.js";

const app = new Koa();

// Add your own middleware and custom route handlers
app.use((ctx, next) => {
  console.log(ctx.method, ctx.path);
  return next();
});

// And finally use the generated router middleware
app.use(router());

app.listen(3000);
```

All your routes are now be accessible but return a `405 Not Implemented` HTTP
status. Let's see how to add route implementations.

## Implementing controllers

Implementing the controllers is done by overwriting their generated
implementations.

```js
// Note how we import the handlers or controller from the generated files
import { userHandlers } from "./src/generated/user/controller.js";

userHandlers.single = async (ctx) => {
  // ctx is a Koa context.
  // Set the response, like you'd normally do in Koa.
  ctx.body = {
    email: "my@email.com",
  };
};

import { imaginaryHandlers } from "./src/generated/imaginary/controller.js";

// Validators are integrated in to the generated router.
imaginaryHandlers.route = async (ctx) => {
  // `R.get("/:userId", "route").params({ userId: T.uuid() })`
  // `GET /e4dbc7dd-adfb-4fce-83f6-f5dcaf68c30c`
  // results in `ctx.validatedParams`. The router will automatically return a `400 Bad Request` if the `userId` is not a valid uuid.
  ctx.validatedParams.userId; // -> uuid

  // `R.get("/", "route").query({ offset: T.number().default(0) })`
  // `GET /?offset=30
  ctx.validatedQuery.offset; // -> number (30)

  // `R.post("/", "route").body({ tags: [T.string()] })`
  // Request body is validated as well
  ctx.validatedBody.tags; // -> string[]

  // `R.get("/", "route").response({ foo: "bar" })`
  // Responses are validated as well. This ensures that you as the API creator adhere to the structure (or contract).
  ctx.body = {}; // throws a `500 Internal Server Error`, response did not pass validators
  ctx.body = { foo: "bar" }; // returns a `200 OK`.
};
```

## Integrate with other Compas features

Compas provides a few features to make working with Koa and Compas a more
integrated experience.

::: details

Under construction

- `getApp` from `@compas/server`
- `createBodyParsers` from `@compas/server`

:::
