import {
  cleanupPostgresDatabaseTemplate,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
} from "@compas/store";
import { destroyTestServices, injectTestServices } from "../src/testing.js";

export const timeout = 3000;

export const ignoreDirectories = ["./examples"];

export async function setup() {
  const sql = await createTestPostgresDatabase();
  await setPostgresDatabaseTemplate(sql);

  await sql.end({ timeout: 0 });

  await injectTestServices();
}

export async function teardown() {
  await destroyTestServices();

  await cleanupPostgresDatabaseTemplate();
}
