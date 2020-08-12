import { mainFn } from "@lbu/stdlib";
import {
  getMigrationsToBeApplied,
  newMigrateContext,
  newPostgresConnection,
  runMigrations,
} from "@lbu/store";

mainFn(import.meta, main);

/**
 * @param logger
 */
async function main(logger) {
  const sql = await newPostgresConnection({ createIfNotExists: true });
  const mc = await newMigrateContext(sql);
  logger.info(getMigrationsToBeApplied(mc) || "No migrations to be applied");

  await runMigrations(mc);

  await sql.end();
}
