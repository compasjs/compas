import test from "tape";
import { TypeCreator } from "../src/types/index.js";
import { generateAndLoad } from "./utils.js";

const name = "code-gen/e2e/validator/number";

test(name, async (t) => {
  const imports = await generateAndLoad(name, applyStructure);
  t.ok(imports);
  t.ok(imports?.validator?.appValidators);

  const { appValidators } = imports["validator"];

  t.test("number1", (t) => {
    t.throws(() => appValidators.number1());
    t.ok(appValidators.number1(3.5));
    t.throws(() => appValidators.number1("1"));

    t.end();
  });

  t.test("number2", (t) => {
    t.equal(appValidators.number2(), undefined);
    t.equal(appValidators.number2(3), 3);
    t.throws(() => appValidators.number2("1"));

    t.end();
  });

  t.test("number3", (t) => {
    t.throws(() => appValidators.number3(0));
    t.equal(appValidators.number3(1), 1);
    t.equal(appValidators.number3(6), 6);

    t.end();
  });

  t.test("number4", (t) => {
    t.throws(() => appValidators.number4(6));
    t.equal(appValidators.number4(-1), -1);
    t.equal(appValidators.number4(5), 5);

    t.end();
  });

  t.test("number5", (t) => {
    t.throws(() => appValidators.number5(3.4));
    t.equal(appValidators.number5(1), 1);

    t.end();
  });

  t.test("number6", (t) => {
    t.throws(() => appValidators.number6());
    t.throws(() => appValidators.number6(4));
    t.equal(appValidators.number6(1), 1);
    t.equal(appValidators.number6(3), 3);

    t.end();
  });

  t.test("number7", (t) => {
    t.throws(() => appValidators.number7());
    t.throws(() => appValidators.number7("NaN"));
    t.equal(appValidators.number7("3.4"), 3.4);
    t.equal(appValidators.number7("3"), 3);
    t.equal(appValidators.number7(3), 3);

    t.end();
  });
});

function applyStructure(app) {
  const T = new TypeCreator();
  app.add(T.number("number1"));
  app.add(T.number("number2").optional());
  app.add(T.number("number3").min(1));
  app.add(T.number("number4").max(5));
  app.add(T.number("number5").integer());
  app.add(T.number("number6").oneOf(1, 2, 3));
  app.add(T.number("number7").convert());

  return {
    enabledGenerators: ["validator"],
  };
}
