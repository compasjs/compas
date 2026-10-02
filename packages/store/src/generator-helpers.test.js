import { mainTestFn, test } from "@compas/cli";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
  generatedUpdateHelper,
} from "../index.js";
import { jobWhereSpec, queryJob } from "./generated/database/job.js";
import { queries } from "./generated.js";

mainTestFn(import.meta);

test("store/generator-helpers", (t) => {
  /** @type {import("../types/advanced-types.d.ts").Postgres} */
  let sql;

  t.test("create a test db with a column from a newer migration", async (t) => {
    sql = await createTestPostgresDatabase();
    await sql`ALTER TABLE "job" ADD COLUMN "addedByNewerMigration" int NOT NULL DEFAULT 1`;

    t.pass();
  });

  t.test(
    "generatedUpdateHelper with returning '*' only returns the spec columns",
    async (t) => {
      const [job] = await queries.jobInsert(sql, { name: "update-helper" });

      const result = await generatedUpdateHelper(
        {
          schemaName: "",
          name: "job",
          shortName: "j",
          columns: ["id", "priority"],
          where: jobWhereSpec,
          injectUpdatedAt: false,
          fields: {
            priority: { type: "number", atomicUpdates: [] },
          },
        },
        {
          where: { id: job.id },
          update: { priority: 2 },
          returning: "*",
        },
      ).exec(sql);

      t.deepEqual(Object.keys(result[0]), ["id", "priority"]);
    },
  );

  t.test("generated queries ignore the newer column", async (t) => {
    const [inserted] = await queries.jobInsert(sql, { name: "insert" });
    const [upserted] = await queries.jobUpsertOnId(sql, {
      ...inserted,
      name: "upsert",
    });
    const [updated] = await queries.jobUpdate(sql, {
      where: { id: inserted.id },
      update: { priority: 5 },
      returning: "*",
    });
    const [queried] = await queryJob({
      where: { id: inserted.id },
    }).exec(sql);

    t.equal(upserted.name, "upsert");
    t.equal(updated.priority, 5);
    t.equal(queried.priority, 5);

    for (const row of [inserted, upserted, updated, queried]) {
      t.ok(!("addedByNewerMigration" in row));
    }
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.pass();
  });
});
