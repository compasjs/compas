import { readFile } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { AppError, isNil, pathJoin } from "@compas/stdlib";
import { TypeCreator } from "../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/sql-update", (t) => {
  const T = new TypeCreator();

  t.test("types", async (t) => {
    const { exitCode, generatedDirectory, stdout } =
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
  });

  t.test("validator", async (t) => {
    const { exitCode, generatedDirectory, stdout } =
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
  });

  t.test("runtime", (t) => {
    t.pass("TODO");
  });
});
