import { mainTestFn, test } from "@compas/cli";
import { createTestPostgresDatabase } from "@compas/store";

mainTestFn(import.meta);

test("default/init", async (t) => {
  // TODO: Remove this test once the template is created

  const sql = await createTestPostgresDatabase({
    onnotice: () => {},
  });

  const [result] = await sql`SELECT 1 + 1 AS sum`;
  t.equal(result.sum, 2);
});
