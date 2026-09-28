import {
  destroyTestServices,
  injectTestSentry,
  injectTestServices,
} from "../src/testing.js";
import {
  cleanupPostgresDatabaseTemplate,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
} from "@compas/store";

export const timeout = 2000;

export async function setup() {
  injectTestSentry();

  const sql = await createTestPostgresDatabase();
  await setPostgresDatabaseTemplate(sql);

  await sql.end({ timeout: 0 });

  await injectTestServices();
}

export async function teardown() {
  await destroyTestServices();

  await cleanupPostgresDatabaseTemplate();
}
