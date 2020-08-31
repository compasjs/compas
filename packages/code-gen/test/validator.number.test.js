import { mainTestFn, test } from "@lbu/cli";
import { TypeCreator } from "../src/types/index.js";
import { generateAndLoad } from "./utils.js";

mainTestFn(import.meta);

const name = "code-gen/e2e/validator/number";

test(name, async (t) => {
  const imports = await generateAndLoad(name, applyStructure);
  t.ok(imports);
  t.ok(imports?.validator?.appValidators);

  const { appValidators } = imports["validator"];

  t.test("number1", (t) => {
    try {
      appValidators.number1();
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      appValidators.number1("1");
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.ok(appValidators.number1(3.5));
  });

  t.test("number2", (t) => {
    t.equal(appValidators.number2(), undefined);
    t.equal(appValidators.number2(3), 3);

    try {
      appValidators.number2("1");
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}
  });

  t.test("number3", (t) => {
    try {
      appValidators.number3(0);
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.equal(appValidators.number3(1), 1);
    t.equal(appValidators.number3(6), 6);
  });

  t.test("number4", (t) => {
    try {
      appValidators.number4(6);
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.equal(appValidators.number4(-1), -1);
    t.equal(appValidators.number4(5), 5);
  });

  t.test("number5", (t) => {
    try {
      appValidators.number5(3.4);
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.equal(appValidators.number5(1), 1);
  });

  t.test("number6", (t) => {
    try {
      appValidators.number6();
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      appValidators.number6(4);
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.equal(appValidators.number6(1), 1);
    t.equal(appValidators.number6(3), 3);
  });

  t.test("number7", (t) => {
    try {
      appValidators.number7();
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    try {
      appValidators.number7("NaN");
      t.fail("Should throw");
      // eslint-disable-next-line no-empty
    } catch {}

    t.equal(appValidators.number7("3.4"), 3.4);
    t.equal(appValidators.number7("3"), 3);
    t.equal(appValidators.number7(3), 3);
  });
});

function applyStructure(app) {
  const T = new TypeCreator();
  app.add(T.number("number1").float());
  app.add(T.number("number2").float().optional());
  app.add(T.number("number3").float().min(1));
  app.add(T.number("number4").float().max(5));
  app.add(T.number("number5"));
  app.add(T.number("number6").oneOf(1, 2, 3));
  app.add(T.number("number7").float().convert());

  return {
    enabledGenerators: ["validator"],
  };
}
