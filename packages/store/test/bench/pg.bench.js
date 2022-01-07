/* eslint-disable import/no-unresolved */
import { bench, mainBenchFn } from "@compas/cli";
import { queryFileGroup } from "../../src/generated/database/fileGroup.js";
import { newPostgresConnection } from "../../src/postgres.js";

const postgresConnectionOptions = {
  createIfNotExists: true,
  max: 10,
};

let _sql = undefined;

mainBenchFn(import.meta);

async function generatedNestedFileGroups(sql) {
  await sql`TRUNCATE TABLE "fileGroup" CASCADE `;
  await sql`
    INSERT INTO "fileGroup" ("order", name, meta)
    SELECT gen,
           'root ' || gen,
           '{}'::jsonb
    FROM generate_series(1, 10) AS gen
    RETURNING id
  `;

  await sql`
    INSERT INTO "fileGroup"("order", parent, name, meta)
    WITH
      expanded AS (
        SELECT random() AS "random",
               seq AS "seq",
               fg.id AS fg_id
        FROM generate_series(1, 100) seq,
             "fileGroup" fg
      ),
      shuffled AS (
        SELECT e.*
        FROM expanded e
               INNER JOIN (
                            SELECT ei.seq, min(ei.random)
                            FROM expanded ei
                            GROUP BY ei.seq
                          ) em ON (e.seq = em.seq AND e.random = em.min)
        ORDER BY e.seq
      )
    SELECT s.seq,
           s.fg_id,
           'one ' || s.seq,
           '{}'
    FROM shuffled s;
  `;

  await sql`
    INSERT INTO "fileGroup"("order", parent, name, meta)
    WITH
      expanded AS (
        SELECT random() AS "random",
               seq AS "seq",
               fg.id AS fg_id
        FROM generate_series(1, 2000) seq,
             "fileGroup" fg
        WHERE
          fg.parent IS NOT NULL
      ),
      shuffled AS (
        SELECT e.*
        FROM expanded e
               INNER JOIN (
                            SELECT ei.seq, min(ei.random)
                            FROM expanded ei
                            GROUP BY ei.seq
                          ) em ON (e.seq = em.seq AND e.random = em.min)
        ORDER BY e.seq
      )
    SELECT s.seq,
           s.fg_id,
           'two ' || s.seq,
           '{}'
    FROM shuffled s;
  `;

  await sql`ANALYZE`;
}

bench("queryFileGroup - exec", async (b) => {
  if (!_sql) {
    _sql = await newPostgresConnection(postgresConnectionOptions);
  }
  const sql = _sql;
  await generatedNestedFileGroups(sql);

  b.resetTime();

  let len = 0;

  for (let i = 0; i < b.N; ++i) {
    const result = await queryFileGroup({}).exec(sql);

    len = result.length;
  }

  return len;
});

bench("queryFileGroup - execRaw", async (b) => {
  if (!_sql) {
    _sql = await newPostgresConnection(postgresConnectionOptions);
  }
  const sql = _sql;
  await generatedNestedFileGroups(sql);

  b.resetTime();

  let len = 0;

  for (let i = 0; i < b.N; ++i) {
    const result = await queryFileGroup({}).execRaw(sql);

    len = result.length;
  }

  return len;
});

bench("queryFileGroup - exec - aggregate children", async (b) => {
  if (!_sql) {
    _sql = await newPostgresConnection(postgresConnectionOptions);
  }
  const sql = _sql;
  await generatedNestedFileGroups(sql);

  b.resetTime();

  let len = 0;

  for (let i = 0; i < b.N; ++i) {
    const result = await queryFileGroup({
      children: {},
    }).exec(sql);

    len = result.length;
  }

  return len;
});

bench("queryFileGroup - execRaw - aggregate children", async (b) => {
  if (!_sql) {
    _sql = await newPostgresConnection(postgresConnectionOptions);
  }
  const sql = _sql;
  await generatedNestedFileGroups(sql);

  b.resetTime();

  let len = 0;

  for (let i = 0; i < b.N; ++i) {
    const result = await queryFileGroup({
      children: {},
    }).execRaw(sql);

    len = result.length;
  }

  return len;
});

bench("queryFileGroup - exec - aggregate children, with parent", async (b) => {
  if (!_sql) {
    _sql = await newPostgresConnection(postgresConnectionOptions);
  }
  const sql = _sql;
  await generatedNestedFileGroups(sql);

  b.resetTime();

  let len = 0;

  for (let i = 0; i < b.N; ++i) {
    const result = await queryFileGroup({
      children: {
        parent: {},
      },
    }).exec(sql);

    len = result.length;
  }

  return len;
});

bench(
  "queryFileGroup - execRaw - aggregate children, with parent",
  async (b) => {
    if (!_sql) {
      _sql = await newPostgresConnection(postgresConnectionOptions);
    }
    const sql = _sql;
    await generatedNestedFileGroups(sql);

    b.resetTime();

    let len = 0;

    for (let i = 0; i < b.N; ++i) {
      const result = await queryFileGroup({
        children: {
          parent: {},
        },
      }).execRaw(sql);

      len = result.length;
    }

    return len;
  },
);
