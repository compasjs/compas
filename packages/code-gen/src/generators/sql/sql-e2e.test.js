import { pathJoin } from "@lbu/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "@lbu/store";
import test from "tape";

test("code-gen/sql/e2e", async (t) => {
  let sql = undefined;
  let appQueries = undefined;
  let list = undefined;
  const items = [];

  t.test("setup", async () => {
    sql = await createTestPostgresDatabase();

    appQueries = (
      await import(pathJoin(process.cwd(), "./generated/app/queries.js"))
    ).appQueries;
  });

  t.test("insert list", async (t) => {
    const [newList] = await appQueries.listInsert(sql, [
      {
        name: "Test",
      },
      {
        name: "Testing multiple",
      },
    ]);

    list = newList;
    t.ok(list?.id);
  });

  t.test("list count", async (t) => {
    const count = await appQueries.listCount(sql);
    t.equal(count, 2);
  });

  t.test("insert list item", async (t) => {
    const [item] = await appQueries.listItemInsert(sql, {
      list: list.id,
      value: "Do test!",
    });

    t.ok(item.id);
    t.equal(list.id, item.list);

    items.push(item);
  });

  t.test("select item with list", async (t) => {
    const [result] = await appQueries.listItemSelectWithList(sql, {
      list: {
        id: list.id,
      },
    });

    t.equal(result.id, items[0].id);
    t.equal(result?.list?.name, list.name);
  });

  t.test("teardown", async () => {
    await cleanupTestPostgresDatabase(sql);
  });
});
