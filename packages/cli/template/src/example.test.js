import { mainTestFn, test } from "@lbu/cli";

mainTestFn(import.meta);

test("example test", (t) => {
  t.ok(true);
});
