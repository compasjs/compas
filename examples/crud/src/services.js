import { createBodyParsers, getApp } from "@compas/server";
import { isNil } from "@compas/stdlib";
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
  todoRegisterCrud({
    sql,
    todoTransform: (entity) => ({
      id: entity.id,
      title: entity.title,
      createdAt: entity.createdAt,

      // Our custom field
      isCompleted:
        !isNil(entity.completedAt) && entity.completedAt < new Date(),
    }),
  });
}
