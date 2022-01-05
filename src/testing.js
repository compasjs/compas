import { rm } from "node:fs/promises";
import { environment, uuid } from "@compas/stdlib";
import { createTestPostgresDatabase } from "@compas/store";

/**
 * @type {Postgres}
 */
export let sql;

/**
 * @type {string}
 */
export let temporaryDirectory;

/**
 * Inject services that can be used in tests across this repo.
 *
 * @returns {Promise<void>}
 */
export async function injectTestServices() {
  sql = await createTestPostgresDatabase();

  temporaryDirectory = `./test/tmp/${uuid()}/`;
}

/**
 * Destroy services that are used for testing
 *
 * @returns {Promise<void>}
 */
export async function destroyTestServices() {
  await sql.end({});

  if (environment.CI !== "true") {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
}
