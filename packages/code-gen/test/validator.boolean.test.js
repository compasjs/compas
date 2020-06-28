import test from "tape";
import { TypeCreator } from "../src/types/index.js";
import { generateAndLoad } from "./utils.js";

const name = "code-gen/e2e/validator/boolean";

test(name, async (t) => {
  const imports = await generateAndLoad(name, applyStructure);
  t.ok(imports);
  t.ok(imports?.validator?.appValidators);

  const { appValidators } = imports["validator"];

  t.test("boolean1", (t) => {
    t.throws(() => appValidators.boolean1("true"));
    t.throws(() => appValidators.boolean1());
    t.equal(appValidators.boolean1(true), true);
    t.equal(appValidators.boolean1(false), false);

    t.end();
  });

  t.test("boolean2", (t) => {
    t.throws(() => appValidators.boolean2("true"));
    t.doesNotThrow(() => appValidators.boolean2());
    t.equal(appValidators.boolean2(true), true);
    t.equal(appValidators.boolean2(false), false);
    t.equal(appValidators.boolean2(), undefined);

    t.end();
  });

  t.test("boolean3", (t) => {
    t.throws(() => appValidators.boolean3());
    t.equal(appValidators.boolean3(true), true);
    t.equal(appValidators.boolean3(false), false);
    t.equal(appValidators.boolean3("true"), true);
    t.equal(appValidators.boolean3(1), true);
    t.equal(appValidators.boolean3(0), false);
    t.equal(appValidators.boolean3("false"), false);

    t.end();
  });

  t.test("boolean4", (t) => {
    t.throws(() => appValidators.boolean4());
    t.throws(() => appValidators.boolean4(false));
    t.ok(appValidators.boolean4(true));

    t.end();
  });

  t.test("boolean5", (t) => {
    t.equal(appValidators.boolean5(), false);
    t.equal(appValidators.boolean5(false), false);
    t.equal(appValidators.boolean5(true), true);

    t.end();
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
    enabledGenerators: ["validator"],
  };
}
