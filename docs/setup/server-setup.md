# Server setup

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
yarn compas api
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
you use the logger provided by `ctx.log`. To read more about the event
callstack, check the [event docs](./#todo).

## Other middleware

- `createBodyParsers` can be used to create a json body parser, and a separate
  multipart body parser.
- `compose` can be used to manually compose multiple middleware in to a single
  callable middleware
- `sendFile` is a utility to easily send out files. Supports partial responses,
  when for example sending a video.
- `session` is a cookie based session handling, ties together with the
  `SessionStore` provided by [@compas/store](./#todo)

## Testing

Testing an api is of coure also necessary. The @compas/server package exports
some utilities for that as well:

`createTestAppAndClient` can be used in combination with an App and Axios
instance to listen to a random port and set the correct `baseURL` in Axios. The
listening app can than be stopped by passing it to `closeTestApp`.

## Setup as a service

As we have seen previously in the [services setup](/setup/services-setup), we
can set variables 'globally' while still being testable. Since you may need to
add various middleware or maybe to construct some middleware like `session`. It
may be a good idea to create a service out of it.

A good pattern to use, is to create a `src/services/core.js` file which contains
services not altered by specific business logic, that only need a one time
setup, like our Koa app.

```js
export let logger = undefined;
export let app = undefined;

export function setLogger(newLogger) {
  newLogger.info("setting services->logger");
  logger = newLogger;
}

export function setApp(newApp) {
  if (logger) {
    logger.info("setting services->app");
  }
  app = newApp;
}
```

And changing your `scripts/api.js` to the following:

```js
import { getApp } from "@compas/server";
import { mainFn } from "@compas/stdlib";
import { app, setLogger, setApp } from "../src/services/core.js";

mainFn(import.meta, main);

async function main(logger) {
  // Making sure we have a logger setup
  setLogger(logger);
  setApp(getApp({}));

  app.listen(3000);
}
```
