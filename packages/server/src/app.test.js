/* eslint-disable import/no-unresolved */
import { mainTestFn, test } from "@compas/cli";
import {
  AppError,
  environment,
  isNil,
  isPlainObject,
  refreshEnvironmentCache,
} from "@compas/stdlib";
import axios from "axios";
import { closeTestApp, createTestAppAndClient, getApp } from "../index.js";

mainTestFn(import.meta);

test("server/app", (t) => {
  const appWithoutErrorLeak = getApp({
    errorOptions: {
      leakError: false,
    },
  });
  const app = getApp();

  const clientWithoutErrorLeak = axios.create({});
  const client = axios.create({});

  [appWithoutErrorLeak, app].forEach((app) =>
    app.use((ctx, next) => {
      if (ctx.request.path === "/500") {
        throw AppError.serverError({ foo: true });
      } else if (ctx.request.path === "/wrap-500") {
        throw new Error("o.0");
      } else if (ctx.request.path === "/200") {
        ctx.body = {};
      }

      return next();
    }),
  );

  t.test("creat test app and client", async (t) => {
    await createTestAppAndClient(appWithoutErrorLeak, clientWithoutErrorLeak);
    await createTestAppAndClient(app, client);

    t.ok(appWithoutErrorLeak._server.listening);
    t.ok(app._server.listening);
  });

  t.test("health check", async (t) => {
    const response = await client.get("_health");
    t.equal(response.status, 200);
    t.equal(response.headers["content-length"], "0");
  });

  t.test("404 and error handling", async (t) => {
    try {
      await clientWithoutErrorLeak.get("/nope");
      t.fail("404, so axios should have thrown");
    } catch ({ response }) {
      t.equal(response.status, 404);

      t.ok(response.data.requestId);
      delete response.data.requestId;
      delete response.data.stack;

      t.deepEqual(response.data, {
        key: "error.server.notFound",
        info: {},
        status: 404,
        type: "api_error",
      });
    }
  });

  t.test("500 error handling", async (t) => {
    try {
      await clientWithoutErrorLeak.get("/500");
      t.fail("500, so axios should have thrown");
    } catch ({ response }) {
      t.equal(response.status, 500);

      t.ok(response.data.requestId);
      delete response.data.requestId;
      delete response.data.stack;

      t.deepEqual(response.data, {
        key: "error.server.internal",
        info: { foo: true },
        status: 500,
        type: "api_error",
      });
    }
  });

  t.test("random error handling", async (t) => {
    environment.NODE_ENV = "production";

    try {
      await client.get("/wrap-500");
    } catch ({ response }) {
      t.equal(response.status, 500);
      t.equal(response.data.key, response.data.key);
      t.equal(response.data.key, "error.server.internal");
      t.ok(isNil(response.data.stack));
    }

    refreshEnvironmentCache();
  });

  t.test("AppError format of Axios errors", async (t) => {
    try {
      await client.get("/wrap-500");
    } catch (e) {
      const formatted = AppError.format(e);
      t.equal(formatted.name, "AxiosError");
      t.ok(isPlainObject(formatted.axios.response.body));
      t.equal(formatted.axios.response.status, 500);
      t.equal(formatted.axios.request.path, "/wrap-500");
      t.equal(formatted.axios.request.method, "GET");
    }
  });

  t.test("close _server", async (t) => {
    await closeTestApp(appWithoutErrorLeak);
    await closeTestApp(app);
    t.ok(!appWithoutErrorLeak._server.listening);
  });
});
