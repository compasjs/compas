import { uuid } from "./datatypes.js";

export function test(t) {
  t.test("uuid", (t) => {
    t.notEqual(uuid(), uuid());

    t.end();
  });
}
