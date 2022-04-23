import { createReadStream } from "fs";
import { mainTestFn, test } from "@compas/cli";
import Axios from "axios";
import FormData from "form-data";
import { getApp } from "../app.js";
import { closeTestApp, createTestAppAndClient } from "../testing.js";
import { createBodyParsers } from "./body.js";

mainTestFn(import.meta);

test("server/middleware/body", async (t) => {
  const app = getApp({ disableHealthRoute: true });
  const fileApp = getApp({
    disableHealthRoute: true,
  });

  const parsers = createBodyParsers(
    {},
    {
      maxFileSize: 512,
    },
  );

  app.use(parsers.bodyParser);
  app.use((ctx, next) => {
    ctx.body = ctx.request.body;

    return next();
  });

  fileApp.use(parsers.multipartBodyParser);
  fileApp.use((ctx, next) => {
    ctx.type = "application/json";
    ctx.body = JSON.stringify({ files: ctx.request.files }, null, 2);

    return next();
  });

  const client = Axios.create();
  await createTestAppAndClient(app, client);
  const fileClient = Axios.create();
  await createTestAppAndClient(fileApp, fileClient);

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

  t.test("file payload", async (t) => {
    const body = new FormData();
    body.append(
      "image",
      createReadStream("./__fixtures__/server/image.png"),
      "image.png",
    );

    const { data } = await fileClient.request({
      url: "/",
      method: "POST",
      data: body,
      headers: typeof body?.getHeaders === "function" ? body.getHeaders() : {},
    });

    t.ok(data.files);
    t.equal(data.files.image.size, 284);
  });

  t.test("file payload too big", async (t) => {
    const body = new FormData();
    body.append(
      "video",
      createReadStream("./__fixtures__/server/video.mp4"),
      "video.mp4",
    );

    try {
      await fileClient.request({
        url: "/",
        method: "POST",
        data: body,
        headers:
          typeof body?.getHeaders === "function" ? body.getHeaders() : {},
      });
    } catch (e) {
      t.ok(e.isAxiosError);
      t.equal(e.response.status, 400);
      t.equal(e.response.data.key, "error.server.maxFieldSize");
    }
  });

  t.test("teardown", async (t) => {
    await closeTestApp(app);
    await closeTestApp(fileApp);
    t.pass();
  });
});
