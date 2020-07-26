# Using sessions

To use persistent sessions, lbu provides two building blocks:

- @lbu/store provides a persisted session store
- @lbu/server wraps koa-session middleware with some defaults

### Requirements

- Have your app up and running
- Be able to connect to PostgeSQL

### Implementation

Mounting sessions is pretty straight forward. First of all create a database
connection and session store:

```javascript
import { newPostgresConnection, newSessionStore } from "@lbu/store";

const sql = newPostgresConnection({});
const store = newSessionStore(sql, {});
```

The second argument for `newSessionStore` allows you to tune the interval at
which expired sessions will be cleaned up. By default, it will start the cleanup
task every 45 minutes. It is also possible to disable with `disableInterval`.

Next we will mount the session middleware:

```javascript
import { getApp, session } from "@lbu/server";

const app = getApp({
  /* ... */
});
app.use(
  session(app, {
    store,
    // any other argument to koa-session
  }),
);
```

Note that the call to session will use some defaults and has some expectations:

- `APP_KEYS` should be in the environment when `NODE_ENV=production`. When
  `NODE_ENV` is anything else, `APP_KEYS` will not be used.
- The default cookie name is `process.env.APP_NAME.toLowerCase() + ".sess"`
- The cookie expires after 10 days
- The cookie is updated when half of the expire time is up.

That's it!
