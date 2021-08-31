# Session handling

::: tip

Requires `@compas/store` and `@compas/server` to be installed

:::

Compas comes with cookie based session handling based on @compas/server &
@compas/store. Note that you need to use @compas/store based migrations to use
the Postgres backed store.

## Session setup

After enabling the migrations, enabling persistent sessions is just a few
function calls away. Start by creating a session store:

```js
import { newSessionStore } from "@compas/store";

// Pass in a sql connection
const sessionsStore = newSessionStore(sql);
```

The session handler has a number of defaults which we handle later in this
document, for now let's create a Koa middleware to handle the sessions:

```js
import { session, getApp } from "@compas/server";

const app = getApp();
const sessionMiddlewre = session(app, {
  store: sessionStore,
});
```

And now where ever we need sessions we can add the `sessionMiddleware` in to our
chain.

```js
counterHandlers.init = [
  sessionMiddleware,
  async (ctx, next) => {
    ctx.session = {
      counter: 0,
    };

    ctx.body = {
      value: ctx.session.counter,
    };

    return next();
  },
];

counterHandlers.increment = [
  sessionMiddleware,
  async (ctx, next) => {
    // Check if a session is new
    if (ctx.session.isNew) {
      throw AppError.validationError("error.sessionNotInitialized", {
        message: "Please call counterHandlers.init first",
      });
    }

    // Session is our object, so increment the value
    ctx.session.counter++;

    ctx.body = {
      value: ctx.session.counter,
    };

    return next();
  },
];

counterHandlers.destroy = [
  sessionMiddleware,
  async (ctx, next) => {
    // Destroy the session
    ctx.session = null;

    ctx.body = { success: true };

    return next();
  },
];
```

The above code implements a counter per user. The session is persisted in to the
database and if the user comes back 5 days later, they still have the same
counter.

Under the hood the session middleware set's some cookies. To do this a few
things are needed:

- CORS handling, automatically done by [`getApp`](/api/server.html#getapp) if
  not disabled.
- The default options in `session`, overridable by the object passed as the
  second argument
  - The cookie `key` is based on the `APP_NAME` environment variable.
  - The `maxAge` value for the cookie in milliseconds. Defaults to 6 days.
  - Automatically `renew` the cookie if the cookie expires. Defaults to `true`.
  - Use a `secure` cookie when running in production, based on
    [`isProduction`](/api/stdlib.html#isproduction)
  - Set the `domain` based on the `COOKIE_URL` environment variable.
  - Set a `sameSite` value to 'lax' so we can host the api on `api.compasjs.com`
    and the frontend on `compasjs.com`.
  - Enable `overwrite` to just force a cookie on every request, this way the
    `maxAge` resets on every request. Defaults to `true`.
  - Making the 'real' session cookie `httpOnly`, defaults to true. So the
    JavaScript in the browser can't tempter with it. Defaults to `true`.
  - Making sure the cookie is `signed`, by using the `APP_KEYS` environment
    variables.
  - By enabling `autoCommit` to automatically persist the `ctx.session` object
    to the database. Should probably be disabled for high traffic api's.

## `keepPublicCookie`

Another option not mentioned above is the `keepPublicCookie` option, defaulting
to `false`. This can only be enabled when a `store` is present like the
[session store](/api/store.html#newsessionstore). This option keeps another
cookie in sync with the session cookies that is readable by the JavaScript
running in the browser. It does not contain any information and to be really
sure that a valid session exists you still need to ask your api.
