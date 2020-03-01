import { gc, getSecondsSinceEpoch } from "./utils.js";

export const test = t => {
  t.test("getSecondsSinceEpoch", t => {
    t.ok(Number.isInteger(getSecondsSinceEpoch()));

    t.end();
  });

  t.test("gc", t => {
    t.doesNotThrow(() => gc());

    t.end();
  });
};
