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
  const sql = await newPostgresConnection({
    createIfNotExists: true,
    connection: {
      ssl: false,
    },
  });
  const mc = await newMigrateContext(sql);
  logger.info(getMigrationsToBeApplied(mc));

  await runMigrations(mc);

  process.exit(0);
}
