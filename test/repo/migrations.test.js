import { mainTestFn, test } from "@compas/cli";
import {
  createTestPostgresDatabase,
  getMigrationsToBeApplied,
  newMigrateContext,
  cleanupTestPostgresDatabase,
} from "@compas/store";

mainTestFn(import.meta);

test("repo/migrations", (t) => {
  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  t.test("migrations should have been applied", async (t) => {
    const mc = await newMigrateContext(sql);

    const { migrationQueue, hashChanges } = getMigrationsToBeApplied(mc);

    const message = `Tests are not running with the latest migrations, please run 'yarn compas docker reset && yarn compas migrate'.`;
    t.equal(migrationQueue.length, 0, message);
    t.equal(hashChanges.length, 0, message);
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true);
  });
});
