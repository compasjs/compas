import { uuid } from "./datatypes.js";

export const test = (t) => {
  t.test("uuid", (t) => {
    t.notEqual(uuid(), uuid());

    t.end();
  });
};
