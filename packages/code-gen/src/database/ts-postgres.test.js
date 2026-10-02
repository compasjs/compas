import { mainTestFn, test } from "@compas/cli";
import { testGeneratorStaticOutput } from "../../test/testing.js";

mainTestFn(import.meta);

test("code-gen/database/ts-postgres", (t) => {
  const builders = (T) => [
    T.date("day").dateOnly(),
    T.object("event")
      .keys({
        at: T.date().searchable(),
        day: T.date().dateOnly().searchable(),
        dayReference: T.reference("app", "day").searchable(),
        time: T.date().timeOnly().searchable(),
      })
      .enableQueries(),
  ];

  for (const [key, keyType] of [
    ["at", "timestamptz"],
    ["day", "date"],
    ["dayReference", "date"],
    ["time", "time"],
  ]) {
    t.test(`where spec of '${key}' casts to '${keyType}'`, (t) => {
      testGeneratorStaticOutput(
        t,
        {
          relativePath: "database/event.ts",
          partialValue: `"tableKey": "${key}",\n      "keyType": "${keyType}",`,
          generateOptions: {
            targetLanguage: "ts",
            generators: { database: { target: { dialect: "postgres" } } },
          },
        },
        builders,
      );
    });
  }
});
