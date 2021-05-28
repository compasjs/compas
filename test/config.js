import {
  cleanupPostgresDatabaseTemplate,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
  setStoreQueries,
  storeQueries,
} from "@compas/store";

export const timeout = 2000;

export const enforceSingleAssertion = true;

export async function setup() {
  const sql = await createTestPostgresDatabase();
  await setPostgresDatabaseTemplate(sql);

  setStoreQueries(storeQueries);

  await sql.end({ timeout: 0 });
}

export async function teardown() {
  await cleanupPostgresDatabaseTemplate();
}
