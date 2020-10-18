import { mainTestFn, test } from "@lbu/cli";
import { isPlainObject } from "@lbu/stdlib";
import { explainAnalyzeQuery, query } from "./query.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

mainTestFn(import.meta);

const getResult = (q) => {
  let sql, args;

  q.exec({
    unsafe(query, values) {
      sql = query.trim();
      args = values;
    },
  });

  return {
    sql,
    args,
  };
};

test("store/query", (t) => {
  t.test("base string", (t) => {
    const { sql, args } = getResult(query`SELECT 1 + 1`);

    t.equal(sql, `SELECT 1 + 1`);
    t.equal(args.length, 0);
  });

  t.test("base interpolation", (t) => {
    const { sql, args } = getResult(query`SELECT 1 + 1 WHERE 2 > ${1}`);
    t.equal(sql, `SELECT 1 + 1 WHERE 2 > $1`);
    t.equal(args.length, 1);
    t.equal(args[0], 1);
  });

  t.test("undefined interpolation", (t) => {
    const { sql, args } = getResult(query`SELECT ${undefined}1 + 1`);

    t.equal(sql, `SELECT 1 + 1`);
    t.equal(args.length, 0);
  });

  t.test("base append", (t) => {
    const { sql, args } = getResult(
      query`SELECT 1 + 1`.append(query`WHERE 1 = 1`),
    );

    t.equal(sql, `SELECT 1 + 1 WHERE 1 = 1`);
    t.equal(args.length, 0);
  });

  t.test("append with single interpolation", (t) => {
    const { sql, args } = getResult(
      query`SELECT 1 + ${1}`.append(query`WHERE 1 = ${1}`),
    );

    t.equal(sql, `SELECT 1 + $1 WHERE 1 = $2`);
    t.deepEqual(args, [1, 1]);
  });

  t.test("append with many interpolations", (t) => {
    const { sql, args } = getResult(
      query`SELECT ${1} + ${1} as "foo" WHERE`.append(
        query`${2} = ${3} AND "foo" = ${2}`,
      ),
    );

    t.equal(sql, `SELECT $1 + $2 as "foo" WHERE $3 = $4 AND "foo" = $5`);
    t.deepEqual(args, [1, 1, 2, 3, 2]);
  });

  t.test("append with undefined values", (t) => {
    const { sql, args } = getResult(
      query`SELECT ${1} + ${1} as "foo" WHERE`
        .append(query`${2} = ${3} AND "foo" ${undefined} = ${2}`)
        .append(query`${undefined}`),
    );

    t.equal(sql, `SELECT $1 + $2 as "foo" WHERE $3 = $4 AND "foo"  = $5`);
    t.deepEqual(args, [1, 1, 2, 3, 2]);
  });

  t.test("base interpolate recursive", (t) => {
    const { sql, args } = getResult(query`SELECT ${query`"foo"`}`);

    t.equal(sql, `SELECT  "foo"`);
    t.deepEqual(args, []);
  });

  t.test("base interpolate recursive - multiple", (t) => {
    const { sql, args } = getResult(
      query`SELECT ${query`"foo", ${query`"bar"`}`}`,
    );

    t.equal(sql, `SELECT  "foo",  "bar"`);
    t.deepEqual(args, []);
  });

  t.test("interpolate recursive", (t) => {
    const { sql, args } = getResult(
      query`SELECT ${query`${1} as "foo", ${query`${2} as "bar"`}`}`,
    );

    t.equal(sql, `SELECT  $1 as "foo",  $2 as "bar"`);
    t.deepEqual(args, [1, 2]);
  });

  t.test("mix interpolate and append", (t) => {
    const { sql, args } = getResult(
      query`FROM "foo" ${query`WHERE 1 = ${1}`}`.append(query`ORDER BY "bar"`),
    );

    t.equal(sql, `FROM "foo"  WHERE 1 = $1 ORDER BY "bar"`);
    t.deepEqual(args, [1]);
  });
});

test("store/analyze-query", (t) => {
  let sql;

  t.test("setup", async () => {
    sql = await createTestPostgresDatabase();
  });

  t.test("analyze select query - string plan", async (t) => {
    const result = await explainAnalyzeQuery(sql, query`SELECT 1 + 1`);
    t.equal(typeof result, "string");
  });

  t.test("analyze select query - json plan", async (t) => {
    const result = await explainAnalyzeQuery(sql, query`SELECT 1 + 1`, {
      jsonResult: true,
    });
    t.ok(isPlainObject(result));
  });

  t.test("create test table", async () => {
    await sql`CREATE TABLE "temp" (value int not null);`;
  });

  t.test("analyze insert does not insert", async (t) => {
    await explainAnalyzeQuery(
      sql,
      query`INSERT INTO "temp" ("value") VALUES (1), (2)`,
    );
    const result = await sql`SELECT * FROM "temp"`;
    t.equal(result.length, 0);
  });

  t.test("teardown", async () => {
    await cleanupTestPostgresDatabase(sql);
  });
});
