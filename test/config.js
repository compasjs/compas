import {
  cleanupPostgresDatabaseTemplate,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
  setStoreQueries,
} from "@compas/store";
import { queries as storeQueries } from "../packages/store/src/generated/index.js";

export const timeout = 2000;

export async function setup() {
  const sql = await createTestPostgresDatabase();
  await setPostgresDatabaseTemplate(sql);

  setStoreQueries(storeQueries);

  await sql.end({ timeout: 0 });
}

export async function teardown() {
  await cleanupPostgresDatabaseTemplate();
}
