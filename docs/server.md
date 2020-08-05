# Server

The server contains various Koa middleware and an easy way to instantiate a new
app.

## Get App

The main export of this package is `getApp` this is a utility function that sets
up various middleware to provide a ready to go experience. The below list
explains the default settings, see
[GetAppOptions](/api?id=interface-getappoptions) for more details about all the
supported options.

- Setup `app.proxy` to `true` when in production. This makes sure Koa is using
  headers provided by the proxy.
- A `/_health` route that responds with `200 OK` on all requests. Can be used to
  check if the api is already running.
- Logging middleware powered by [@lbu/insight](/insight.md). Adds a `requestId`
  to the context of the logger, which makes sure that logs of a request stay
  together. The logger is accessible on `ctx.log` in the middleware.
- An error handling middleware, supporting
  [AppError](http://localhost:3000/#/api?id=class-apperror-t) errors, as well as
  sending a `500 Internal Server Error` for all other errors. It uses the before
  mentioned logging middleware to log all errors.
- A 404 handler for unhandled requests
- A basic CORS handler powered by `process.env.CORS_URL`. See
  [environment](/env.md) for more information.

## Other middleware

- `createBodyParsers` can be used to create a json body parser and a separate
  multipart body parser.
- `compose` can be used to manually compose multiple middleware in to a single
  callable middleware
- `sendFile` is a utility to easily send out files. Supports partial responses,
  when for example sending a video.
- `session` is a cookie based session handling, ties together with the
  `SessionStore` provided by [@lbu/store](/store.md)

## Testing

This package also provides some utilities for testing your api.

`createTestAppAndClient` can be used in combination with an App and Axios
instance to listen to a random port and set the correct `baseURL` in Axios. The
listening app can than be stopped by passing it to `closeTestApp`.
