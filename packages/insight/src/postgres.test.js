import { mainTestFn, test } from "@compas/cli";
import { isPlainObject } from "@compas/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "@compas/store";
import { postgresTableSizes } from "./postgres.js";

mainTestFn(import.meta);

test("insight/postgres", (t) => {
  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
        SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);

    // Force analyze, so we get results
    await sql`SELECT *
              FROM migration
              WHERE namespace = '@compas/store'`;
    await sql`ANALYZE`;
  });

  t.test("postgresTableSizes returns a result", async (t) => {
    const result = await postgresTableSizes(sql);

    // Comes from @compas/stdlib, but doesn't matter when published since this is a test file
    t.ok(isPlainObject(result));
    t.ok(result["migration"].diskSize > 16384, "migration disk size");
    t.ok(result["migration"].rowCount > 5, "migration row count");
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });
});
