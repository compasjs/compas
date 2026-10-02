import { mainTestFn, test } from "@compas/cli";
import { uuid } from "@compas/stdlib";
import { testGeneratorType } from "../../test/testing.js";

mainTestFn(import.meta);

test("code-gen/processors/models", (t) => {
  const builders = (T) => [
    T.object("post")
      .keys({
        title: T.string(),
        settings: T.object().keys({
          isPinned: T.bool(),
        }),
      })
      .enableQueries(),
  ];

  const row = (overrides = {}) => ({
    id: uuid(),
    title: "Hello",
    settings: { isPinned: true },
    ...overrides,
  });

  for (const [group, validatorName] of [
    ["app", "validateAppPost"],
    ["queryResult", "validateQueryResultAppPost"],
  ]) {
    t.test(`${validatorName} strips unknown top-level keys`, async (t) => {
      const { value, error } = await testGeneratorType(
        t,
        {
          group,
          validatorName,
          validatorInput: row({ addedByNewerMigration: 1 }),
        },
        builders,
      );

      t.equal(error, undefined);
      t.ok(!("addedByNewerMigration" in value));
    });

    t.test(`${validatorName} keeps nested objects strict`, async (t) => {
      const { error } = await testGeneratorType(
        t,
        {
          group,
          validatorName,
          validatorInput: row({
            settings: { isPinned: true, addedByNewerDeploy: 1 },
          }),
        },
        builders,
      );

      t.equal(error?.["$.settings"]?.key, "validator.keys");
    });
  }
});
