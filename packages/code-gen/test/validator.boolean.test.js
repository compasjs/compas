import { mainTestFn, test } from "@lbu/cli";
import { TypeCreator } from "../src/types/index.js";
import { generateAndLoad } from "./utils.js";

mainTestFn(import.meta);

const name = "code-gen/e2e/validator/boolean";

test(name, async (t) => {
  const imports = await generateAndLoad(name, applyStructure);
  t.ok(imports);
  t.ok(imports?.validator?.appValidators);

  const { appValidators } = imports["validator"];

  t.test("boolean1", (t) => {
    try {
      appValidators.boolean1("true");
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      appValidators.boolean1();
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.equal(appValidators.boolean1(true), true);
    t.equal(appValidators.boolean1(false), false);
  });

  t.test("boolean2", (t) => {
    try {
      appValidators.boolean2("true");
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      appValidators.boolean2();
    } catch (e) {
      t.fail("Should not throw");
      t.log.error(e);
    }

    t.equal(appValidators.boolean2(true), true);
    t.equal(appValidators.boolean2(false), false);
    t.equal(appValidators.boolean2(), undefined);
  });

  t.test("boolean3", (t) => {
    try {
      appValidators.boolean3();
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.equal(appValidators.boolean3(true), true);
    t.equal(appValidators.boolean3(false), false);
    t.equal(appValidators.boolean3("true"), true);
    t.equal(appValidators.boolean3(1), true);
    t.equal(appValidators.boolean3(0), false);
    t.equal(appValidators.boolean3("false"), false);
  });

  t.test("boolean4", (t) => {
    try {
      appValidators.boolean4();
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      appValidators.boolean4(false);
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.ok(appValidators.boolean4(true));
  });

  t.test("boolean5", (t) => {
    t.equal(appValidators.boolean5(), false);
    t.equal(appValidators.boolean5(false), false);
    t.equal(appValidators.boolean5(true), true);
  });
});

function applyStructure(app) {
  const T = new TypeCreator();
  app.add(T.bool("boolean1"));
  app.add(T.bool("boolean2").optional());
  app.add(T.bool("boolean3").convert());
  app.add(T.bool("boolean4").oneOf(true));
  app.add(T.bool("boolean5").default(false));

  return {
    isNode: true,
    enabledGenerators: ["validator"],
    validatorCollectErrors: false,
  };
}
