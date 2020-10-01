import { mainTestFn, test } from "@lbu/cli";
import { isNil, pathJoin, uuid } from "@lbu/stdlib";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "@lbu/store";

mainTestFn(import.meta);

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

  t.test("select list with items", async (t) => {
    const [result] = await appQueries.listSelectWithItems(sql, {
      id: list.id,
      items: { list: list.id },
    });

    t.equal(result.id, list.id);
    t.equal(result.items.length, items.length);

    t.deepEqual(
      new Set(result.items.map((it) => it.id)),
      new Set(items.map((it) => it.id)),
    );
  });

  t.test("select list but filter out items", async (t) => {
    const [result] = await appQueries.listSelectWithItems(sql, {
      id: list.id,
      items: {
        list: uuid(),
      },
    });

    t.equal(result.items.length, 0);
  });

  t.test("insert setting uses default value", async (t) => {
    const [setting] = await appQueries.listSettingInsert(sql, {
      list: list.id,
      key: "foo",
    });

    t.deepEqual(setting.value, { editable: true });
  });

  t.test("insert app setting", async (t) => {
    const [setting] = await appQueries.settingsInsert(sql, {
      name: "foo",
      value: true,
    });

    t.ok(setting.id);
    t.ok(isNil(setting.deletedAt));
  });

  t.test("app setting returns one item", async (t) => {
    const settings = await appQueries.settingsSelect(sql);

    t.equal(settings.length, 1);
  });

  t.test("soft delete does not throw", async (t) => {
    const [setting] = await appQueries.settingsSelect(sql);
    const result = await appQueries.settingsDelete(sql, { id: setting.id });

    t.equal(result.count, 1);
  });

  t.test(
    "deleted app setting does not show up in default empty where clause",
    async (t) => {
      const settings = await appQueries.settingsSelect(sql);

      t.equal(settings.length, 0);
    },
  );

  t.test("deleted app setting does show up with where clause", async (t) => {
    const settings = await appQueries.settingsSelect(sql, {
      deletedAtInclude: true,
    });

    t.equal(settings.length, 1);
  });

  t.test("permanent delete app setting", async (t) => {
    const [setting] = await appQueries.settingsSelect(sql, {
      deletedAtInclude: true,
    });
    const result = await appQueries.settingsDeletePermanent(sql, {
      id: setting.id,
    });
    t.equal(result.count, 1);
  });

  t.test("deleted app setting is gone", async (t) => {
    const settings = await appQueries.settingsSelect(sql, {
      deletedAtInclude: true,
    });

    t.equal(settings.length, 0);
  });

  t.test("teardown", async () => {
    await cleanupTestPostgresDatabase(sql);
  });
});
