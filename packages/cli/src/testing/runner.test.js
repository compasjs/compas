import { match, strictEqual } from "assert";
import { mainTestFn, test } from "@compas/cli";
import { runTestsRecursively } from "./runner.js";

mainTestFn(import.meta);

test("cli/testing/runner", (t) => {
  t.test(
    "runTestsRecursively - catch assertion errors strictEqual",
    async (t) => {
      const state = {
        parent: undefined,
        hasFailure: false,
        name: "test",
        callback: () => {
          strictEqual(1, 2);
        },
        assertions: [],
        children: [],
      };
      await runTestsRecursively(state);

      t.equal(state.assertions.length, 1);
      t.equal(state.assertions[0].type, "strictEqual");
      t.ok(state.assertions[0].meta.message.indexOf("strictly") !== -1);
    },
  );

  t.test("runTestsRecursively - catch assertion errors match", async (t) => {
    const state = {
      parent: undefined,
      hasFailure: false,
      name: "test",
      callback: () => {
        match("foo", /bar/);
      },
      assertions: [],
      children: [],
    };
    await runTestsRecursively(state);

    t.equal(state.assertions.length, 1);
    t.equal(state.assertions[0].type, "match");
    t.ok(state.assertions[0].meta.message.indexOf("regular expression") !== -1);
  });
});
