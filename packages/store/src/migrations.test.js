import { mainTestFn, test } from "@compas/cli";
import {
  getMigrationsToBeApplied,
  newMigrateContext,
  runMigrations,
} from "./migrations.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

mainTestFn(import.meta);

test("store/migrations", (t) => {
  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  t.test("run full migration", async (t) => {
    const mc = await newMigrateContext(sql, `./__fixtures__/store`);

    t.equal(mc.files.length, 4);

    const { migrationQueue: list } = getMigrationsToBeApplied(mc);
    t.equal(list.length, 4);

    t.ok(list[1].repeatable === false);
    t.ok(list[1].number === 997);

    t.ok(list[2].repeatable === true);
    t.ok(list[2].number === 998);

    t.ok(list[3].repeatable === false);
    t.ok(list[3].number === 999);

    await runMigrations(mc);
    const testResult = await sql`
      SELECT *
      FROM "testTable"
    `;
    t.deepEqual([...testResult], [{ value: 1 }, { value: 2 }, { value: 3 }]);
  });

  t.test("second run has no migrations to be applied", async (t) => {
    const mc = await newMigrateContext(sql, `./__fixtures__/store`);

    const { migrationQueue, hashChanges } = getMigrationsToBeApplied(mc);
    t.equal(migrationQueue.length, 0);
    t.equal(hashChanges.length, 0);
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true);
  });
});
