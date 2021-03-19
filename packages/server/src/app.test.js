import { mainTestFn, test } from "@compas/cli";
import { AppError, isPlainObject, uuid } from "@compas/stdlib";
import Axios from "axios";
import { closeTestApp, createTestAppAndClient, getApp } from "../index.js";

mainTestFn(import.meta);

test("server/app", (t) => {
  const app = getApp();
  const client = Axios.create();

  app.use((ctx, next) => {
    if (ctx.request.path === "/500") {
      throw AppError.serverError({ foo: true });
    } else if (ctx.request.path === "/wrap-500") {
      throw new Error("o.0");
    } else if (ctx.request.path === "/200") {
      ctx.body = {};
    }

    return next();
  });

  t.test("creat test app and client", async (t) => {
    await createTestAppAndClient(app, client);
    t.ok(app._server.listening);
  });

  t.test("health check", async (t) => {
    const response = await client.get("_health");
    t.equal(response.status, 200);
    t.equal(response.headers["content-length"], "0");
  });

  t.test("404 and error handling", async (t) => {
    try {
      await client.get("/nope");
      t.fail("404, so axios should have thrown");
    } catch ({ response }) {
      t.equal(response.status, 404);
      t.deepEqual(response.data, {
        key: "error.server.notFound",
        message: "error.server.notFound",
        info: {},
      });
    }
  });

  t.test("500 error handling", async (t) => {
    try {
      await client.get("/500");
      t.fail("500, so axios should have thrown");
    } catch ({ response }) {
      t.equal(response.status, 500);
      t.deepEqual(response.data, {
        key: "error.server.internal",
        message: "error.server.internal",
        info: { foo: true },
      });
    }
  });

  t.test("random error handling", async (t) => {
    try {
      await client.get("/wrap-500");
      t.fail("wrap-500, so axios should have thrown");
    } catch ({ response }) {
      t.equal(response.status, 500);
      t.equal(response.data.key, response.data.message);
      t.equal(response.data.key, "error.server.internal");
      t.ok(Array.isArray(response.data.info._error.stack));
    }
  });

  t.test("AppError format of Axios errors", async (t) => {
    try {
      await client.get("/wrap-500");
      t.fail("wrap-500, so axios should have thrown");
    } catch (e) {
      const formatted = AppError.format(e);
      t.equal(formatted.name, "Error");
      t.ok(isPlainObject(formatted.axios.responseHeaders));
      t.ok(isPlainObject(formatted.axios.responseBody));
      t.equal(formatted.axios.responseStatus, 500);
      t.equal(formatted.axios.requestPath, "/wrap-500");
      t.equal(formatted.axios.requestMethod, "GET");
    }
  });

  t.test("consistent x-request-id handling", async (t) => {
    const response = await client.get("/200");
    const header = response.headers["x-request-id"];

    t.ok(uuid.isValid(header));

    const secondResponse = await client.get("/200", {
      headers: { "x-request-id": header },
    });

    t.equal(header, secondResponse.headers["x-request-id"]);
  });

  t.test("consistent x-request-id with generated api client", async (t) => {
    const commonApiClientImport = await import(
      "./../../../generated/testing/server/common/apiClient.js"
    );

    commonApiClientImport.addRequestIdInterceptors(client);

    const response = await client.get("/200");
    const secondResponse = await client.get("/200");
    t.equal(
      response.headers["x-request-id"],
      secondResponse.headers["x-request-id"],
    );
  });

  t.test("close _server", async (t) => {
    await closeTestApp(app);
    t.ok(!app._server.listening);
  });
});
