import test from "tape";
import { uuid } from "./datatypes.js";

test("stdlib/datatypes", (t) => {
  t.test("uuid", (t) => {
    t.notEqual(uuid(), uuid());

    t.end();
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

    t.end();
  });
});
