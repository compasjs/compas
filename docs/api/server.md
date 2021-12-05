---
editLink: false
---

# @compas\/server

::: v-pre

## getApp

_Available since 0.1.0_

_function getApp(opts?): void_

Create a new Koa instance with default middleware applied.

Create a new Koa instance with default middleware applied. Adds the following: -
Health check route on `/_health`

- Log middleware to add the Logger from @compas/stdlib on `ctx.log`

- Error handler to catch any errors thrown by route handlers

- A 404 handler when no response is set by other middleware

- Default headers to respond to things like CORS requests

**Parameters**:

- opts `GetAppOptions={}`

_[source](https://github.com/compasjs/compas/blob/main/packages/server/src/app.js#L77)_

## sendFile

_Available since 0.1.0_

_function sendFile({import("koa").Context} ctx, file, getStreamFn):
Promise\<void>_

Send a `StoreFile` instance from @compas/store as a `ctx` response. Handles byte
range requests as well. May need some improvements to set some better cache
headers.

**Parameters**:

- {import("koa").Context} ctx `{import("koa").Context} ctx`:
  {import("koa").Context} ctx
- file `StoreFile`
- getStreamFn `GetStreamFn`

_[source](https://github.com/compasjs/compas/blob/main/packages/server/src/middleware/sendFile.js#L26)_

## createBodyParsers

_Available since 0.1.0_

_function createBodyParsers(bodyOpts?, multipartBodyOpts?): BodyParserPair_

Creates a body parser and a body parser with multipart enabled. Note that
koa-body parses url-encoded, form data, json and text by default.

**Parameters**:

- bodyOpts `KoaBodyOptions={}`: Options that will be passed to koa-body
- multipartBodyOpts `formidable.Options={}`: Options that will be passed to
  formidable

_[source](https://github.com/compasjs/compas/blob/main/packages/server/src/middleware/body.js#L46)_

## compose

_Available since 0.1.0_

_function compose({Middleware[]} middleware): Middleware_

Compose `middleware` returning of all those which are passed.

**Parameters**:

- {Middleware[]} middleware `{Middleware[]} middleware`: {Middleware[]}
  middleware

_[source](https://github.com/compasjs/compas/blob/main/packages/server/src/middleware/compose.js#L20)_

## createTestAppAndClient

_Available since 0.1.0_

_function createTestAppAndClient({import("./app").KoaApplication} app,
{import("axios").AxiosInstance} axios): Promise\<void>_

Open the provided Koa app on a random port, and use the port to set the
'baseURL' on the provided Axios instance.

**Parameters**:

- {import("./app").KoaApplication} app `{import("./app").KoaApplication} app`:
  {import("./app").KoaApplication} app
- {import("axios").AxiosInstance} axios `{import("axios").AxiosInstance} axios`:
  {import("axios").AxiosInstance} axios

_[source](https://github.com/compasjs/compas/blob/main/packages/server/src/testing.js#L11)_

## closeTestApp

_Available since 0.1.0_

_function closeTestApp({import("./app").KoaApplication} app): Promise\<void>_

Close the test app as created by `createTestAppAndClient`.

**Parameters**:

- {import("./app").KoaApplication} app `{import("./app").KoaApplication} app`:
  {import("./app").KoaApplication} app

_[source](https://github.com/compasjs/compas/blob/main/packages/server/src/testing.js#L45)_

:::
