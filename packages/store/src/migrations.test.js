import { dirnameForModule } from "@lbu/stdlib";
import test from "tape";
import {
  getMigrationsToBeApplied,
  newMigrateContext,
  runMigrations,
} from "./migrations.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

test("store/migrations", (t) => {
  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    let result = await sql`SELECT 1 + 2 AS sum`;
    t.equal(result[0].sum, 3);

    t.end();
  });

  t.test("run full migration", async (t) => {
    const mc = await newMigrateContext(
      sql,
      dirnameForModule(import.meta) + "/../__fixtures__",
    );

    t.deepEqual(mc.namespaces, ["@lbu/store", process.env.APP_NAME]);
    t.equal(mc.files.length, 6);

    const list = getMigrationsToBeApplied(mc);
    t.equal(list.length, 3);

    t.ok(list[0].isMigrated === false);
    t.ok(list[0].repeatable === false);
    t.ok(list[0].number === 1);

    t.ok(list[1].isMigrated === false);
    t.ok(list[1].repeatable === true);
    t.ok(list[1].number === 2);

    t.ok(list[2].isMigrated === false);
    t.ok(list[2].repeatable === false);
    t.ok(list[2].number === 3);

    await runMigrations(mc);
    let testResult = await sql`SELECT *
                               FROM test_table;`;
    t.deepEqual([...testResult], [{ value: 1 }, { value: 2 }, { value: 3 }]);

    t.end();
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true);

    t.end();
  });
});
