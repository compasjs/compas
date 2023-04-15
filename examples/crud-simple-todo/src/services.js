import { createBodyParsers, getApp } from "@compas/server";
import {
  createTestPostgresDatabase,
  newPostgresConnection,
} from "@compas/store";
import { router } from "./generated/common/router.js";
import { todoRegisterCrud } from "./generated/todo/crud.js";

export let app = undefined;

export let sql = undefined;

export async function injectServices() {
  app = getApp({});
  sql = await newPostgresConnection({ max: 10 });

  await todoRegisterCrud({
    sql,
  });

  app.use(router(createBodyParsers()));
}

export async function injectTestServices() {
  app = getApp({});
  sql = await createTestPostgresDatabase();

  await todoRegisterCrud({
    sql,
  });

  app.use(router(createBodyParsers()));
}
