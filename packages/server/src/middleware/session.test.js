import { mainTestFn, test } from "@lbu/cli";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  newSessionStore,
} from "@lbu/store";
import Axios from "axios";
import Koa from "koa";
import { closeTestApp, createTestAppAndClient } from "../testing.js";
import { session } from "./session.js";

mainTestFn(import.meta);

test("server/session", async (t) => {
  const app = new Koa();
  const client = Axios.create();

  let sql;
  let cookieVal;

  t.test("setup", async () => {
    sql = await createTestPostgresDatabase();
    app.use(
      session(app, {
        supportOptionOverwrites: true,
        store: newSessionStore(sql),
      }),
    );
    app.use((ctx, next) => {
      if (ctx.session.isNew) {
        ctx.session.foo = true;
        ctx.session._domain = "test.com";
        ctx.body = {};
      } else {
        ctx.body = {
          ...ctx.session.toJSON(),
        };
      }

      return next();
    });

    await createTestAppAndClient(app, client);
  });

  t.test("set cookie", async (t) => {
    const response = await client.get("/");

    t.deepEqual(response.data, {});
    cookieVal = response.headers["set-cookie"];

    t.equal(cookieVal.length, 2);
  });

  t.test("get cookie", async (t) => {
    const response = await client.get("/", {
      headers: {
        Cookie: cookieVal.join("; "),
      },
    });

    // Note that _domain is not serialized by koa-session
    t.deepEqual(response.data, {
      foo: true,
    });
  });

  t.test("teardown", async () => {
    await cleanupTestPostgresDatabase(sql);
    await closeTestApp(app);
  });
});
