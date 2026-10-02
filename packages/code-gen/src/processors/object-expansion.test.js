import { mainTestFn, test } from "@compas/cli";
import { testGeneratorType } from "../../test/testing.js";

mainTestFn(import.meta);

test("code-gen/processors/object-expansion", (t) => {
  const builders = (T) => [
    T.object("base").keys({
      foo: T.string(),
      bar: T.string(),
    }),
    T.pick("picked").object(T.reference("app", "base")).keys("foo"),
    T.pick("pickedLoose")
      .object(T.reference("app", "base"))
      .keys("foo")
      .loose(),
    T.pick("pickedNullable")
      .object(T.reference("app", "base"))
      .keys("foo")
      .allowNull(),
    T.omit("omitted").object(T.reference("app", "base")).keys("bar"),
    T.omit("omittedLoose")
      .object(T.reference("app", "base"))
      .keys("bar")
      .loose(),
    T.omit("omittedNullable")
      .object(T.reference("app", "base"))
      .keys("bar")
      .allowNull(),
  ];

  const validate = (name, validatorInput) =>
    testGeneratorType(
      t,
      {
        group: "app",
        validatorName: `validateApp${name}`,
        validatorInput,
      },
      builders,
    );

  for (const prefix of ["Picked", "Omitted"]) {
    t.test(`${prefix} rejects unknown keys by default`, async (t) => {
      const { error } = await validate(prefix, { foo: "x", bar: "y" });

      t.equal(error?.$?.key, "validator.keys");
    });

    t.test(`${prefix}Loose strips unknown keys`, async (t) => {
      const { value, error } = await validate(`${prefix}Loose`, {
        foo: "x",
        bar: "y",
      });

      t.equal(error, undefined);
      t.deepEqual(value, { foo: "x" });
    });

    t.test(`${prefix}Nullable keeps null`, async (t) => {
      const { value, error } = await validate(`${prefix}Nullable`, null);

      t.equal(error, undefined);
      t.equal(value, null);
    });
  }
});
