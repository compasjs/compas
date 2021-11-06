# Session handling

Since Compas v0.0.172 Compas supports two session types: JSON Web Token based
and cookies based sessions. The latter will be removed in the near future. And
thus it is advised to use the JWT based sessions for new projects.

## JSON Web Token based

::: tip

Requires `@compas/store` to be installed

:::

Let's see what Compas brings to the table for sessions. Session in Compas allow
you to persist a data object in PostgreSQL so you can for example keep track if
a user is logged in, and add the user id to that object so you can use it when
necessary. Although JWT's are often used in combination with claim's, for
example which permissions a user has and what it's ID is, Compas doesn't support
it this way. The tokens only contain an identifier and expiration time, which
then can be used in the backend to find the underlying session object. This way
you have all the controls on the backend and can create specific routes to
expose things like which permissions the user has.

The tokens are always created in pairs: an access token and refresh token. The
access token is often short-lived, like 10 - 15 minutes stored in memory, and is
used to authenticate with api calls. The refresh token on the other hand has a
longer time to live, often limited based on the expected attack vectors like if
the application is used in public libraries for example, and can be used to
fetch a new token pair.

Let's take a look at the provided utilities by `@compas/store`. Most functions
will return a `Either<X, AppError>`, meaning that callers should handle
`returnValue.error` and handle these appropriately.

### `sessionStoreSettings`

Session store settings is an object expected by various functions, containing
the following properties:

- `accessTokenMaxAgeInSeconds` (number): How long access tokens should be valid.
  As mentioned, this should be short like 5 to 15 minutes.
- `refreshTokenMaxAgeInSeconds` (number): How long refresh tokens should be
  valid
- `signingKey` (string,>20 chars): The key used for signing JWT's. By changing
  this value, all sessions will be invalidated. The value should be handled as a
  secret and should be generated in a secure random way.

### `sessionStoreCreate`

Creates a new session with the provided `sessionData` and returns a token pair.

**Example**:

```js
import { sessionStoreCreate } from "@compas/store";

const settings = {
  accessTokenMaxAgeInSeconds: 5 * 60, // 5 minutes
  refreshTokenMaxAgeInSeconds: 24 * 60 * 60, // 24 hours
  signingKey: "secure key loaded from secure place",
};

const { error, value: tokenPair } = await sessionStoreCreate(
  newEventFromEvent(event),
  sql,
  settings,
  {
    user: ".user.id",
    ...otherProps,
  },
);

if (error) {
  // handle error
} else {
  // send token pair to client
}
```

**Errors**:

- `validator.error` -> thrown when `sessionSettings` has validator errors
- `error.server.internal` -> if for some reason the JWT signing library can't
  create the access or refresh token.

### `sessionStoreGet`

Get the session object from the `accessTokenString`. Note that this returns the
full database backed object. The `id` is necessary for updating the session
object and `data` contains the saved object for this session.

**Example**:

```js
import { sessionStoreGet } from "@compas/store";

const settings = {
  accessTokenMaxAgeInSeconds: 5 * 60, // 5 minutes
  refreshTokenMaxAgeInSeconds: 24 * 60 * 60, // 24 hours
  signingKey: "secure key loaded from secure place",
};

// Get Authorization header, showing the Koa way.
const header = ctx.get("authorization");
if (!header.startsWith("Bearer")) {
  // throw invalid header
}
const accessTokenString = header.substring("Bearer ".length);

const { error, value } = await sessionStoreGet(
  newEventFromEvent(event),
  sql,
  settings,
  accessTokenString,
);

if (error) {
  // handle error
} else {
  const { id, data } = value.session;
  // id is used for updating the session,
  // data contains your saved session data
}
```

**Errors**:

- `validator.error` -> thrown when `sessionSettings` has validator errors
- `error.server.internal` -> if for some reason the JWT validating library can't
  decode or validate the provided access token.
- `sessionStore.verifyAndDecodeJWT.invalidToken` -> when the token is not issued
  by this backend, or if it is edited by an unauthorized entity.
- `sessionStore.verifyAndDecodeJWT.expiredToken` -> if the `exp` of the token
  before the current time.
- `sessionStore.get.invalidAcessToken` -> when the decoded access token is not
  conforming the expected structure.
- `sessionStore.get.invalidSession` -> when no session can be found by the
  provided access token.
- `sessionStore.get.revokedToken` -> when the token is revoked, via for example
  `sessionStoreInvalidate` or when a new token pair is issued via
  `sessionStoreRefreshTokens`.

## `sessionStoreUpdate`

Update the data stored for the provided session. This function will check if the
object is changed and only do a database call when that is the case.

**Example**:

```js
import { sessionStoreUpdate } from "@compas/store";

const { error } = await sessionStoreUpdate(newEventFromEvent(event), sql, {
  id: "my-session-id",
  data: {
    new: {
      data: "object",
    },
  },
});

if (error) {
  // handle error
}
// Session is saved or wasn't changed
```

**Errors**:

`sessionStore.update.invalidSession` -> when the provided session has an invalid
id or if the data is not a plain JS object.

### `sessionStoreInvalidate`

Revoke all tokens for the provided session.

**Example**:

```js
import { sessionStoreInvalidate } from "@compas/store";

const { error } = await sessionStoreInvalidate(newEventFromEvent(event), sql, {
  id: "my-session-id",
});

if (error) {
  // handle error
}
// Session is completely invalidated
```

**Errors**:

- `sessionStore.invalidate.invalidSession` -> the provided session does not
  contain a valid identifier.

### `sessionStoreRefreshTokens`

Get a new token pair via the provided refresh token. This invalidates the token
pair that is used. To prevent refresh token stealing, it detects if the refresh
token is already used, and if so does the following two things:

- Invalidates the session
- Creates a `compas.sessionStore.potentialLeakedSession` job, with the digest of
  session duration and tokens used as the job 'data'.

**Example**:

```js
import { sessionStoreRefreshTokens } from "@compas/store";

const settings = {
  accessTokenMaxAgeInSeconds: 5 * 60, // 5 minutes
  refreshTokenMaxAgeInSeconds: 24 * 60 * 60, // 24 hours
  signingKey: "secure key loaded from secure place",
};

const { error, value } = await sessionStoreRefreshTokens(
  newEventFromEvent(event),
  sql,
  settings,
  ctx.validatedBody.refreshToken,
);

if (error) {
  // handle error
} else {
  // return token pair to the caller
}
```

**Errors**:

- `validator.error` -> thrown when `sessionSettings` has validator errors
- `error.server.internal` -> if for some reason the JWT validating and signing
  library can't decode the refresh token, validate the provided refresh token or
  can't sign the new tokens.
- `sessionStore.verifyAndDecodeJWT.invalidToken` -> when the token is not issued
  by this backend, or if it is edited by an unauthorized entity.
- `sessionStore.verifyAndDecodeJWT.expiredToken` -> if the `exp` of the token
  before the current time.
- `sessionStore.refreshTokens.invalidRefreshToken` -> when the decoded refresh
  token is not conforming the expected structure.
- `sessionStore.refreshTokens.invalidSession` -> when no session can be found by
  the provided refresh token.
- `sessionStore.refreshTokens.revokedToken` -> when the token is revoked, via
  for example `sessionStoreInvalidate` or when a new token pair is issued via
  `sessionStoreRefreshTokens`.

### `sessionStoreCleanupExpiredSessions`

Cleanup tokens that are expired / revoked longer than 'maxRevokedAgeInDays' days
ago. Also removes the session if no tokens exist anymore. Note that when tokens
are removed, Compas can't detect refresh token reuse, which hints on session
stealing. A good default may be 45 days.

## Cookie based

::: tip

Requires `@compas/store` and `@compas/server` to be installed

:::

Compas comes with cookie based session handling based on @compas/server &
@compas/store. Note that you need to use @compas/store based migrations to use
the Postgres backed store.

### Session setup

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
const sessionMiddleware = session(app, {
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

### `keepPublicCookie`

Another option not mentioned above is the `keepPublicCookie` option, defaulting
to `false`. This can only be enabled when a `store` is present like the
[session store](/api/store.html#newsessionstore). This option keeps another
cookie in sync with the session cookies that is readable by the JavaScript
running in the browser. It does not contain any information and to be really
sure that a valid session exists you still need to ask your api.
