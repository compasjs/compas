import { readFile } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { AppError, isNil, pathJoin, uuid } from "@compas/stdlib";
import { query } from "@compas/store";
import { sql } from "../../../../../src/testing.js";
import { TypeCreator } from "../../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/sql-update", (t) => {
  const T = new TypeCreator();

  t.test("types", async (t) => {
    const { exitCode, generatedDirectory, stdout, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("settings")
            .keys({
              name: T.string(),
              age: T.number(),
              settings: {
                sendNotifications: T.bool().default(false),
              },
              optionalField: T.bool().allowNull(),
            })
            .enableQueries({ withDates: true }),
        ],
        {
          enabledGenerators: ["type", "validator", "sql"],
          isNodeServer: true,
        },
      );

    t.equal(exitCode, 0, stdout);

    const typeFile = await readFile(
      pathJoin(generatedDirectory, "./common/types.d.ts"),
      "utf-8",
    );

    const lines = typeFile.split("\n");

    t.test("update partial", (t) => {
      const updatePartialLine = lines.find((it) =>
        it.startsWith("type AppSettingsUpdatePartial ="),
      );

      t.ok(updatePartialLine);
      t.ok(updatePartialLine.includes(`"name"?: undefined|string|{"$append"`));
      t.ok(updatePartialLine.includes(`"age"?: undefined|number|{"$add"`));
      t.ok(
        updatePartialLine.includes(`"optionalField"?: undefined|null|boolean`),
      );

      for (const key of [
        "$add",
        "$subtract",
        "$multiply",
        "$divide",
        "$append",
        "$set",
        "$remove",
      ]) {
        t.ok(updatePartialLine.includes(key), key);
      }
    });

    t.test("update", (t) => {
      const updateLine = lines.find((it) =>
        it.startsWith("type AppSettingsUpdateInput ="),
      );

      t.ok(updateLine);

      t.ok(updateLine.includes(`"update": AppSettingsUpdatePartial`));
      t.ok(updateLine.includes(`"where": AppSettingsWhere`));
      t.ok(updateLine.includes(`"returning"?: undefined|"*"|("name"|"age"`));
    });

    t.test("updateFn", (t) => {
      const updateFnLine = lines.find((it) =>
        it.startsWith("type AppSettingsUpdateFn = "),
      );
      t.ok(updateFnLine);
    });

    t.test("teardown", async (t) => {
      await cleanupGeneratedDirectory();

      t.pass();
    });
  });

  t.test("validator", async (t) => {
    const { exitCode, generatedDirectory, stdout, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("settings")
            .keys({
              name: T.string(),
              age: T.number(),
              settings: {
                sendNotifications: T.bool().default(false),
              },
              optionalField: T.bool().allowNull(),
            })
            .enableQueries({ withDates: true }),
        ],
        {
          enabledGenerators: ["type", "validator", "sql"],
          isNodeServer: true,
        },
      );

    t.equal(exitCode, 0, stdout);

    const { validateAppSettingsUpdate } = await import(
      pathJoin(generatedDirectory, "app/validators.js")
    );

    t.equal(typeof validateAppSettingsUpdate, "function");

    t.test("update", (t) => {
      t.test("basic usage", (t) => {
        const { error } = validateAppSettingsUpdate({
          update: {
            name: "foo",
            age: 15,
            settings: {
              sendNotifications: true,
            },
            optionalField: null,
          },
          where: {},
        });

        t.ok(isNil(error));
      });

      t.test("partial update", (t) => {
        const { error } = validateAppSettingsUpdate({
          update: {
            name: "foo",
          },
          where: {},
        });

        t.ok(isNil(error));
      });

      t.test("converted null-usage", (t) => {
        const { value } = validateAppSettingsUpdate({
          update: {
            name: null,
          },
          where: {},
        });

        t.equal(value.update.name, undefined);
      });

      t.test("atomic update", (t) => {
        const { error } = validateAppSettingsUpdate({
          update: {
            name: {
              $append: "bar",
            },
            age: {
              $add: 5,
            },
            settings: {
              $remove: {
                path: ["sendNotifications"],
              },
            },
            optionalField: {
              $negate: true,
            },
          },
          where: {},
        });

        t.ok(isNil(error));
      });

      t.test("incorrect atomic update", (t) => {
        const { error } = validateAppSettingsUpdate({
          update: {
            age: {
              $subtract: 3,
              $multiply: 5,
            },
          },
          where: {},
        });

        t.ok(AppError.instanceOf(error));
      });
    });

    t.test("returning", (t) => {
      t.test("undefined", (t) => {
        const { error } = validateAppSettingsUpdate(
          {
            update: {},
            where: {},
          },
          "$.",
        );

        t.ok(isNil(error));
      });

      t.test("star", (t) => {
        const { error } = validateAppSettingsUpdate(
          {
            update: {},
            where: {},
            returning: "*",
          },
          "$.",
        );

        t.ok(isNil(error));
      });

      t.test("unknown columns", (t) => {
        const { error } = validateAppSettingsUpdate(
          {
            update: {},
            where: {},
            returning: ["bar", "baz"],
          },
          "$.",
        );

        t.ok(error);
      });

      t.test("known columns", (t) => {
        const { error } = validateAppSettingsUpdate(
          {
            update: {},
            where: {},
            returning: ["name", "id", "createdAt"],
          },
          "$.",
        );

        t.ok(isNil(error));
      });
    });

    t.test("teardown", async (t) => {
      await cleanupGeneratedDirectory();

      t.pass();
    });
  });

  t.test("runtime", async (t) => {
    const { exitCode, generatedDirectory, stdout, cleanupGeneratedDirectory } =
      await codeGenToTemporaryDirectory(
        [
          T.object("settings")
            .keys({
              name: T.string(),
              age: T.number(),
              settings: {
                sendNotifications: T.bool().default(false),
              },
              optionalField: T.bool().allowNull(),
              someArrayField: T.array().values(T.bool()).default("[]"),
            })
            .enableQueries({ withDates: true }),
        ],
        {
          enabledGenerators: ["type", "validator", "sql"],
          isNodeServer: true,
          dumpPostgres: true,
        },
      );

    t.equal(exitCode, 0, stdout);

    const { querySettings } = await import(
      pathJoin(generatedDirectory, "./database/settings.js")
    );
    const { queries } = await import(
      pathJoin(generatedDirectory, "./database/index.js")
    );

    t.test("setup database", async (t) => {
      await sql.unsafe(
        await readFile(
          pathJoin(generatedDirectory, "common/structure.sql"),
          "utf-8",
        ),
      );

      await querySettings().exec(sql);

      t.pass();
    });

    t.test("empty update object", async (t) => {
      try {
        await queries.settingsUpdate(sql, {
          update: {},
          where: {
            $raw: query`1 = 1`,
          },
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.ok(e.info.message.includes("Empty 'update' input"), e.info.message);
      }
    });

    t.test("empty where object", async (t) => {
      try {
        await queries.settingsUpdate(sql, {
          update: {
            name: "foo",
          },
          where: {},
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.ok(e.info.message.includes("Empty 'where' input"), e.info.message);
      }
    });

    t.test("partial update", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          settings: {
            sendNotifications: true,
          },
          optionalField: false,
        },
        where: {
          id: setting.id,
        },
        returning: "*",
      });

      t.equal(result.optionalField, false);
      t.equal(result.id, setting.id);
      t.equal(result.name, setting.name);
      t.deepEqual(result.someArrayField, []);
    });

    t.test("partial update - with undefined field", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          age: undefined,
          name: "bar",
          someArrayField: [true],
        },
        where: {
          id: setting.id,
        },
        returning: "*",
      });

      t.equal(result.id, setting.id);
      t.equal(result.age, setting.age);
      t.equal(result.name, "bar");
      t.deepEqual(result.someArrayField, [true]);
    });

    t.test("partial update - with undefined field", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
      });

      const update = Object.create(null);
      update.age = 20;

      const [result] = await queries.settingsUpdate(sql, {
        update,
        where: {
          id: setting.id,
        },
        returning: "*",
      });

      t.equal(result.id, setting.id);
      t.equal(result.age, 20);
    });

    t.test("null update", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          optionalField: null,
        },
        where: {
          id: setting.id,
        },
        returning: "*",
      });

      t.equal(
        result.optionalField,
        undefined,
        "Null fields are transformed to undefined.",
      );
    });

    t.test("invalid null update", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      try {
        await queries.settingsUpdate(sql, {
          update: {
            name: null,
          },
          where: {
            id: setting.id,
          },
          returning: "*",
        });
      } catch (e) {
        t.equal(e.name, "PostgresError");
        t.ok(e.message.includes(`null value in column "name"`), e.message);
      }
    });

    t.test("no returning", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const result = await queries.settingsUpdate(sql, {
        update: {
          name: uuid(),
        },
        where: {
          id: setting.id,
        },
      });

      t.ok(isNil(result));
    });

    t.test("partial returning", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const result = await queries.settingsUpdate(sql, {
        update: {
          name: uuid(),
        },
        where: {
          id: setting.id,
        },
        returning: ["id", "age", "createdAt"],
      });

      t.deepEqual(
        [...result],
        [{ id: setting.id, age: setting.age, createdAt: setting.createdAt }],
      );
    });

    t.test("atomic update boolean: $negate", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          optionalField: { $negate: true },
        },
        where: {
          id: setting.id,
        },
        returning: ["optionalField"],
      });

      t.equal(result.optionalField, false);
    });

    t.test("atomic update number: $add", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          age: { $add: 8 },
        },
        where: {
          id: setting.id,
        },
        returning: ["age"],
      });

      t.equal(result.age, 26);
    });

    t.test("atomic update number: $subtract", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          age: { $subtract: 8 },
        },
        where: {
          id: setting.id,
        },
        returning: ["age"],
      });

      t.equal(result.age, 10);
    });

    t.test("atomic update number: $multiply", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          age: { $multiply: 2 },
        },
        where: {
          id: setting.id,
        },
        returning: ["age"],
      });

      t.equal(result.age, 36);
    });

    t.test("atomic update number: $divide", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          age: { $divide: 2 },
        },
        where: {
          id: setting.id,
        },
        returning: ["age"],
      });

      t.equal(result.age, 9);
    });

    t.test("atomic update string: $append", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          name: { $append: "bar" },
        },
        where: {
          id: setting.id,
        },
        returning: ["name"],
      });

      t.equal(result.name, `${setting.name}bar`);
    });

    t.test("atomic update date: $add", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          updatedAt: { $add: "1 day 2 hours" },
        },
        where: {
          id: setting.id,
        },
        returning: ["updatedAt"],
      });

      const expectedUpdatedAt = new Date(setting.updatedAt);
      expectedUpdatedAt.setHours(expectedUpdatedAt.getHours() + 2);
      expectedUpdatedAt.setDate(expectedUpdatedAt.getDate() + 1);

      t.deepEqual(result.updatedAt, expectedUpdatedAt);
    });

    t.test("atomic update date: $subtract", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          updatedAt: { $subtract: "1 day 2 hours" },
        },
        where: {
          id: setting.id,
        },
        returning: ["updatedAt"],
      });

      const expectedUpdatedAt = new Date(setting.updatedAt);
      expectedUpdatedAt.setHours(expectedUpdatedAt.getHours() - 2);
      expectedUpdatedAt.setDate(expectedUpdatedAt.getDate() - 1);

      t.deepEqual(result.updatedAt, expectedUpdatedAt);
    });

    t.test("atomic update json: $set", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          settings: {
            $set: {
              path: ["sendNotifications"],
              value: true,
            },
          },
        },
        where: {
          id: setting.id,
        },
        returning: ["settings"],
      });

      t.deepEqual(result.settings, {
        sendNotifications: true,
      });
    });

    t.test("atomic update json: $remove", async (t) => {
      const [setting] = await queries.settingsInsert(sql, {
        name: uuid(),
        age: 18,
        settings: {},
        optionalField: true,
      });

      const [result] = await queries.settingsUpdate(sql, {
        update: {
          settings: {
            $remove: {
              path: ["sendNotifications"],
            },
          },
        },
        where: {
          id: setting.id,
        },
        returning: ["settings"],
      });

      t.deepEqual(result.settings, {});
    });

    t.test("teardown", async (t) => {
      await sql`DROP TABLE "settings";`;
      await cleanupGeneratedDirectory();

      t.pass();
    });
  });
});
