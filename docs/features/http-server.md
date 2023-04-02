# HTTP server

::: tip

Requires `@compas/stdlib` and `@compas/server` to be installed

:::

Compas also provides some utilities for constructing an HTTP server. This is
based on [Koa](https://koajs.com/). The server consist of built-in error
handling, a logger and security headers.

## Default server

Create a file at `scripts/api.js` with the following contents:

```js
import { getApp } from "@compas/server";
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

async function main() {
  const app = getApp({});

  app.listen(3000);
}
```

When we run this file we can already check out some default features.

```shell
compas run api
# Or
node ./scripts/api.js
```

We are going to do some GET requests, you can use your browser or another HTTP
client, like [httpie](https://httpie.io/) .

1. Check if the server is running

```shell
http GET http://localhost:3000/_health
```

2. 404 handling

```shell
http GET http://localhost:3000/oops
```

3. Logging

Check the logs of the running server. You should see quite a bit of output
there. Notice that the `/_health` request is missing. In order, you should see
the following:

- Formatted 404 error with stack trace. This is an 'info' log for any non 500
  response status error.
- The request log to `/oops`, containing some request and response information.
- Event callstack, this can be used for timings, analytics or other diagnostic
  purposes.

Notes that all logs also contain a `requestId`. This is automatically added when
you use the logger provided by `ctx.log`. The context also contains `ctx.event`.
These two together are explained in
[logger and events](/features/logger-and-events.html)

## Other middleware

- `createBodyParsers` can be used to create a json body parser, and a separate
  multipart body parser.
- `compose` can be used to manually compose multiple middleware in to a single
  callable middleware
- `sendFile` is a utility to easily send out files. Supports partial responses,
  when for example sending a video.
