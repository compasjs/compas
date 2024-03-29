import { mainTestFn, test } from "@compas/cli";
import { gc, getSecondsSinceEpoch, isMainFnAndReturnName } from "./utils.js";

mainTestFn(import.meta);

test("stdlib/utils", (t) => {
  t.test("getSecondsSinceEpoch", (t) => {
    t.ok(Number.isInteger(getSecondsSinceEpoch()));
  });

  t.test("gc", (t) => {
    try {
      gc();
      t.pass();
    } catch (e) {
      t.fail("Should not throw");
      t.log.error(e);
    }
  });

  t.test("isMainFnAndGetName", (t) => {
    const baseUrl = `file://${process.cwd()}`;
    const nonMainFnResult = isMainFnAndReturnName({
      url: `${baseUrl}/packages/stdlib/src/utils.js`,
    });

    t.equal(nonMainFnResult.isMainFn, false);
    // Still returns the name of the file that is the process entrypoint
    t.ok(
      nonMainFnResult.name === "worker-thread" ||
        nonMainFnResult.name === "index",
    );
  });
});
