import { mainTestFn, test } from "@compas/cli";
import { createTestPostgresDatabase } from "./testing.js";

mainTestFn(import.meta);

test("store/testing", (t) => {
  t.test("createTestPostgresDatabase - accepts options", async (t) => {
    const sql = await createTestPostgresDatabase(false, { max: 3 });
    await sql`SELECT 1 + 1`;

    t.equal(sql.options.max, 3);

    await sql.end();
  });
});
