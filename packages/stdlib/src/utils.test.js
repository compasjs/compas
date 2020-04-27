import test from "tape";
import { gc, getSecondsSinceEpoch } from "./utils.js";

test("stdlib/utils", (t) => {
  t.test("getSecondsSinceEpoch", (t) => {
    t.ok(Number.isInteger(getSecondsSinceEpoch()));

    t.end();
  });

  t.test("gc", (t) => {
    t.doesNotThrow(() => gc());

    t.end();
  });
});
