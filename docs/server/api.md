# @lbu/server API

**getApp(opts): Koa**

Create a new Koa app with some defaults set. By using the default options you
get the following:

- A health route on `/_health` that returns a `200 OK` as fast as possible.
  Based on response times your load balancer can determine what it should do.
- Proxy headers are being trusted when `NODE_ENV==="production"`. Which means
  that Koa will use `X-Forwarded-Host` instead of `Host`.
- A request logger with reusable request id available on `ctx.log`. See
  @lbu/insight for more information on the logger used.
- An error handler, but still customisable for your needs
- A handler which will throw the `AppError#notFound()` if no status code is set.
- Default cors handling

The following options are available:

- `proxy`: Override the default proxy value.
- `disableHealthRoute`: Don't use the health route
- `disableHeaders`: Don't use the CORS handler
- `errorOptions`:
  - `onError`: Called for any error. Should be sync. If the function returns
    truthy, the error handler will stop execution directly.
  - `onAppError`: Called for formatting the response based on an `AppError`. The
    default returns an object with the `AppError#key` and `AppError#info`. Note
    that unknown errors result in `Internal Server Errors`.
  - `leakError`: Adds the possibility of returning the stack trace to the
    client. Useful in development and closed staging environments. Default value
    is false.
- `headers`:
  - `cors`: The CORS related options

**compose(...fn)**

_returns: fn_

See [koa-compose](https://github.com/koajs/compose)

**createBodyParsers(opts: KoaBodyOptions)**

_returns: { bodyParser: fn, multipartBodyParser: fn }_

Create a normal (urleconded, json) body parser and a multipart enabled body
parser. These are based on [koa-body](https://github.com/dlau/koa-body).

**session(app, options)**

_returns: fns_

Session middleware. See [using_sessions](../using-sessions.md)

**isServerLog(log: object)**

_returns: boolean_

Give it a parsed log, and it will determine if the http logger may have produced
it.
