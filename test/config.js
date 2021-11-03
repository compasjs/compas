import {
  cleanupPostgresDatabaseTemplate,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
  setStoreQueries,
  storeQueries,
} from "@compas/store";
import { destroyTestServices, injectTestServices } from "../src/testing.js";

export const timeout = 2000;

export const enforceSingleAssertion = true;

export async function setup() {
  const sql = await createTestPostgresDatabase();
  await setPostgresDatabaseTemplate(sql);

  setStoreQueries(storeQueries);

  await sql.end({ timeout: 0 });

  await injectTestServices();
}

export async function teardown() {
  await destroyTestServices();

  await cleanupPostgresDatabaseTemplate();
}
