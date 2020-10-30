import { mainTestFn, test } from "@lbu/cli";
import { isPlainObject } from "@lbu/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "@lbu/store";
import { postgresTableSizes } from "./postgres.js";

mainTestFn(import.meta);

test("insight/postgres", async (t) => {
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
              WHERE namespace = '@lbu/store'`;
    await sql`ANALYZE`;
  });

  t.test("postgresTableSizes returns a result", async (t) => {
    const result = await postgresTableSizes(sql);

    // Comes from @Lbu/stdlib, but doens't matter when published since this is a test file
    t.ok(isPlainObject(result));
    t.ok(result["migration"].diskSize > 16384, "migration disk size");
    t.ok(result["migration"].rowCount > 5, "migration row count");
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });
});
