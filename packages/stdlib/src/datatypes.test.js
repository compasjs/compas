import test from "tape";
import { uuid } from "./datatypes.js";

test("stdlib/datatypes", (t) => {
  t.test("uuid", (t) => {
    t.notEqual(uuid(), uuid());

    t.end();
  });
});
