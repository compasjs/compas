import { createBodyParsers, getApp } from "@compas/server";
import {
  createTestPostgresDatabase,
  newPostgresConnection,
} from "@compas/store";
import { router } from "./generated/common/router.js";
import { postRegisterCrud } from "./generated/post/crud.js";

export let app = undefined;

export let sql = undefined;

export async function injectServices() {
  app = getApp({});
  sql = await newPostgresConnection({ max: 10 });

  injectCrud();

  app.use(router(createBodyParsers()));
}

export async function injectTestServices() {
  app = getApp({});
  sql = await createTestPostgresDatabase();

  injectCrud();

  app.use(router(createBodyParsers()));
}

/**
 * Register all crud routes
 */
function injectCrud() {
  postRegisterCrud({ sql });
}
