import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  migrationsGetInfo,
  migrationsInitContext,
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
    const mc = await migrationsInitContext(sql, {
      migrationsDirectory: pathJoin(process.cwd(), "migrations"),
      uniqueLockNumber: -12345,
    });

    const { migrationQueue, hashChanges } = await migrationsGetInfo(mc);

    const message = `Tests are not running with the latest migrations, please run 'compas docker clean --project && compas migrate'.`;
    t.equal(migrationQueue.length, 0, message);
    t.equal(hashChanges.length, 0, message);
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true);
  });
});
