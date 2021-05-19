import { mainTestFn, test } from "@compas/cli";
import Axios from "axios";
import { getApp } from "../app.js";
import { closeTestApp, createTestAppAndClient } from "../testing.js";
import { createBodyParsers } from "./body.js";

mainTestFn(import.meta);

test("server/middleware/body", async (t) => {
  const app = getApp({ disableHealthRoute: true });

  const parsers = createBodyParsers({}, {});

  app.use(parsers.bodyParser);
  app.use((ctx, next) => {
    ctx.body = ctx.request.body;

    return next();
  });

  const client = Axios.create();
  await createTestAppAndClient(app, client);

  t.test("text payload", async (t) => {
    const { data } = await client.request({
      url: "/",
      method: "POST",
      data: "test",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    t.equal(data, "test");
  });

  t.test("json payload", async (t) => {
    const { data } = await client.request({
      url: "/",
      method: "POST",
      data: {
        foo: "Bar",
      },
      headers: {},
    });

    t.deepEqual(data, {
      foo: "Bar",
    });
  });

  t.test("invalid json payload", async (t) => {
    try {
      await client.request({
        url: "/",
        method: "POST",
        data: `{ "foo": \t`,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      t.ok(e.isAxiosError);
      t.equal(e.response.status, 400);
      t.equal(e.response.data.key, "error.server.unsupportedBodyFormat");
    }
  });

  t.test("invalid json payload", async (t) => {
    try {
      await client.request({
        url: "/",
        method: "POST",
        data: `{ 
        "foo": "bar",
        "bar": {
           "baz": true,
           }
         }`,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      t.ok(e.isAxiosError);

      t.equal(e.response.status, 400);
      t.equal(e.response.data.key, "error.server.unsupportedBodyFormat");
    }
  });

  t.test("teardown", async () => {
    await closeTestApp(app);
  });
});
