import {
  cleanupPostgresDatabaseTemplate,
  createTestPostgresDatabase,
  setPostgresDatabaseTemplate,
} from "@compas/store";

export const timeout = 2000;

export async function setup() {
  const sql = await createTestPostgresDatabase();
  await setPostgresDatabaseTemplate(sql);

  await sql.end({ timeout: 0.01 });
}

export async function teardown() {
  await cleanupPostgresDatabaseTemplate();
}
