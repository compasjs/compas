import { mainTestFn, test } from "@compas/cli";
import { uuid } from "./datatypes.js";

mainTestFn(import.meta);

test("stdlib/datatypes", (t) => {
  t.test("uuid", (t) => {
    t.ok(uuid() !== uuid());
  });

  t.test("uuid.isValid", (t) => {
    t.ok(uuid.isValid(uuid()));
    t.ok(uuid.isValid(uuid().toUpperCase()));
    t.notOk(uuid.isValid(undefined));
    t.notOk(uuid.isValid(undefined));
    t.notOk(uuid.isValid(false));
    t.notOk(uuid.isValid(true));
    t.notOk(uuid.isValid(5));
    t.notOk(uuid.isValid("foo"));
    t.notOk(uuid.isValid({}));
    t.notOk(uuid.isValid([]));
    t.notOk(uuid.isValid("9f7443e7-81ba-3be2-be0b-ed46faacc592"));
    t.notOk(uuid.isValid("9f7443e7-81ba-4be-be0b-ed46faacc592"));
  });
});
