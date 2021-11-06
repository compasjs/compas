import { createTestPostgresDatabase } from "@compas/store";

/**
 * @type {Postgres}
 */
export let sql = undefined;

/**
 * Inject services that can be used in tests across this repo.
 *
 * @return {Promise<void>}
 */
export async function injectTestServices() {
  sql = await createTestPostgresDatabase();
}

/**
 * Destroy services that are used for testing
 *
 * @return {Promise<void>}
 */
export async function destroyTestServices() {
  await sql.end({});
}
