import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import {
  getMigrationsToBeApplied,
  newMigrateContext,
  newPostgresConnection,
  runMigrations,
} from "@lbu/store";

mainFn(import.meta, log, main);

async function main(logger) {
  const sql = await newPostgresConnection({ createIfNotExists: true });
  const mc = await newMigrateContext(sql);
  logger.info(getMigrationsToBeApplied(mc) || "No migrations to be applied");

  await runMigrations(mc);

  await sql.end();
}
