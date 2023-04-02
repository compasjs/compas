import { readFile } from "fs/promises";
import { pathToFileURL } from "url";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin, uuid } from "@compas/stdlib";
import { sql } from "../../../../../src/testing.js";
import { TypeCreator } from "../../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/date-time", async (t) => {
  const T = new TypeCreator("app");

  const {
    exitCode,
    generatedDirectory,
    stdout,
    stderr,
    cleanupGeneratedDirectory,
  } = await codeGenToTemporaryDirectory(
    [
      T.object("codeGenDateTime")
        .keys({
          fullDate: T.date().defaultToNow(),
          dateOnly: T.date().dateOnly().searchable(),
          timeOnly: T.date().timeOnly().searchable(),
        })
        .enableQueries(),
    ],
    {
      enabledGenerators: ["validator", "sql", "type"],
      isNodeServer: true,
      dumpStructure: true,
      dumpPostgres: true,
    },
  );

  t.equal(exitCode, 0);

  if (exitCode !== 0) {
    t.log.error(stdout);
    t.log.error(stderr);
    return;
  }

  t.test("structure.sql", async (t) => {
    const structureFile = await readFile(
      pathJoin(generatedDirectory, "common/structure.sql"),
      "utf-8",
    );

    t.ok(structureFile.includes(`"fullDate" timestamptz NOT NULL`));
    t.ok(structureFile.includes(`"dateOnly" date NOT NULL`));
    t.ok(structureFile.includes(`"timeOnly" time NOT NULL`));
  });

  t.test("migrate structure.sql", async (t) => {
    const structureFile = await readFile(
      pathJoin(generatedDirectory, "common/structure.sql"),
      "utf-8",
    );

    await sql.unsafe(structureFile);

    const result = await sql`SELECT *
                             FROM "codeGenDateTime";`;

    t.equal(result.length, 0);
  });

  t.test("insert and update partial types", async (t) => {
    const types = await readFile(
      pathJoin(generatedDirectory, "common/types.d.ts"),
      "utf-8",
    );

    const insertPartialStartIdx = types.indexOf(
      "AppCodeGenDateTimeInsertPartial = {",
    );
    const insertPartialEndIdx = types.indexOf("};", insertPartialStartIdx);
    const insertPartial = types.substring(
      insertPartialStartIdx,
      insertPartialEndIdx,
    );

    const updatePartialStartIdx = types.indexOf(
      "AppCodeGenDateTimeUpdatePartial = {",
    );
    const updatePartialEndIdx = types.indexOf("};", updatePartialStartIdx);
    const updatePartial = types.substring(
      updatePartialStartIdx,
      updatePartialEndIdx,
    );

    // Check if types are expected with the inputted builders
    t.ok(insertPartial.includes(`"fullDate"?: undefined|Date,`));
    t.ok(insertPartial.includes(`"dateOnly": string,`));
    t.ok(insertPartial.includes(`"timeOnly": string,`));

    t.ok(updatePartial.includes(`"fullDate"?: undefined|Date|`));
    t.ok(updatePartial.includes(`"dateOnly"?: undefined|string|`));
    t.ok(updatePartial.includes(`"timeOnly"?: undefined|string|`));
  });

  t.test("validator", async (t) => {
    const { validateAppCodeGenDateTime } = await import(
      pathToFileURL(pathJoin(generatedDirectory, "app/validators.js"))
    );

    t.test("dateOnly input", (t) => {
      for (const { input, expectErrorKey, expected } of [
        { input: "2020-01-01", expected: "2020-01-01" },
        { input: "2020010100", expectErrorKey: "validator.string.pattern" },
        { input: "2020", expectErrorKey: "validator.string.min" },
        { input: "2020-13-01", expectErrorKey: "validator.string.pattern" },
        { input: "2020-11-42", expectErrorKey: "validator.string.pattern" },
      ]) {
        const { error, value } = validateAppCodeGenDateTime({
          id: uuid(),
          dateOnly: input,
          timeOnly: "14:14",
        });

        if (expectErrorKey) {
          t.ok(error);
          t.equal(error.info[`$.dateOnly`].key, expectErrorKey);
        } else if (expected) {
          t.ok(value);
          t.equal(value.dateOnly, expected);
        }
      }
    });

    t.test("timeOnly input", (t) => {
      for (const { input, expectErrorKey, expected } of [
        { input: "01:01", expected: "01:01" },
        { input: "01:01:01", expected: "01:01:01" },
        { input: "01:01:01.123", expected: "01:01:01.123" },
        { input: "01", expectErrorKey: "validator.string.min" },
        { input: "111:11:1", expectErrorKey: "validator.string.pattern" },
        { input: "24:00", expectErrorKey: "validator.string.pattern" },
        { input: "12:60", expectErrorKey: "validator.string.pattern" },
        { input: "12:59:61", expectErrorKey: "validator.string.pattern" },
      ]) {
        const { error, value } = validateAppCodeGenDateTime({
          id: uuid(),
          dateOnly: "2021-01-01",
          timeOnly: input,
        });

        if (expectErrorKey) {
          t.ok(error);
          t.equal(error.info[`$.timeOnly`].key, expectErrorKey);
        } else if (expected) {
          t.ok(value);
          t.equal(value.timeOnly, expected);
        }
      }
    });
  });

  t.test("sql", async (t) => {
    const { queryCodeGenDateTime, codeGenDateTimeQueries } = await import(
      pathToFileURL(pathJoin(generatedDirectory, "database/codeGenDateTime.js"))
    );

    t.test("insert and retrieve", async (t) => {
      const date = new Date();

      for (const { fullDate, dateOnly, timeOnly, expectTimeOnly } of [
        {
          fullDate: date,
          dateOnly: "2020-01-01",
          timeOnly: "12:34:56.789",
          expectTimeOnly: "12:34:56.789",
        },
        {
          fullDate: date,
          dateOnly: "2020-01-01",
          timeOnly: "12:34",
          expectTimeOnly: "12:34:00",
        },
      ]) {
        const [inserted] = await codeGenDateTimeQueries.codeGenDateTimeInsert(
          sql,
          {
            fullDate,
            dateOnly,
            timeOnly,
          },
        );

        const [fetched] = await queryCodeGenDateTime({
          where: {
            id: inserted.id,
          },
        }).exec(sql);

        t.equal(fetched.dateOnly, dateOnly);
        t.equal(fetched.timeOnly, expectTimeOnly);
        t.deepEqual(fetched.fullDate, fullDate);
      }
    });

    t.test("where validator", async (t) => {
      try {
        await queryCodeGenDateTime({
          where: {
            dateOnly: new Date(),
          },
        }).exec(sql);
      } catch (e) {
        t.equal(
          e.info["$.codeGenDateTimeBuilder.where.dateOnly"].key,
          "validator.string.type",
        );
      }
    });

    t.test("where", async (t) => {
      await codeGenDateTimeQueries.codeGenDateTimeInsert(sql, [
        {
          dateOnly: "2021-01-01",
          timeOnly: "01:01",
        },
        {
          dateOnly: "2021-02-02",
          timeOnly: "02:02",
        },
        {
          dateOnly: "2021-03-03",
          timeOnly: "03:03:03",
        },
        {
          dateOnly: "2021-04-04",
          timeOnly: "04:04",
        },
        {
          dateOnly: "2021-05-05",
          timeOnly: "05:05",
        },
        {
          dateOnly: "2021-06-06",
          timeOnly: "06:06",
        },
      ]);

      const result = await queryCodeGenDateTime({
        where: {
          dateOnlyGreaterThan: "2021-02-01",
          dateOnlyLowerThan: "2021-05-15",
          timeOnlyGreaterThan: "03:00",
        },
      }).exec(sql);

      t.equal(result.length, 3);

      t.ok(
        result.find(
          (it) => it.dateOnly === "2021-03-03" && it.timeOnly === "03:03:03",
        ),
      );
      t.ok(
        result.find(
          (it) => it.dateOnly === "2021-04-04" && it.timeOnly === "04:04:00",
        ),
      );
      t.ok(
        result.find(
          (it) => it.dateOnly === "2021-05-05" && it.timeOnly === "05:05:00",
        ),
      );
    });
  });

  t.test("teardown", async (t) => {
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
