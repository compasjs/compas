import { match, strictEqual } from "assert";
import { mainTestFn, test } from "@compas/cli";
import { AppError } from "@compas/stdlib";
import { runTestsRecursively } from "./runner.js";

mainTestFn(import.meta);

test("cli/testing/runner", (t) => {
  t.test("my test name", (t) => {
    t.equal(t.name, "my test name");
  });

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
      await runTestsRecursively(state, {
        bail: false,
        isDebugging: false,
      });

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
    await runTestsRecursively(state, {
      bail: false,
      isDebugging: false,
    });

    t.equal(state.assertions.length, 1);
    t.equal(state.assertions[0].type, "match");
    t.ok(state.assertions[0].meta.message.indexOf("regular expression") !== -1);
  });

  t.test("runTestsRecursively - enforceSingleAssertion", async (t) => {
    const state = {
      parent: undefined,
      hasFailure: false,
      name: "test",
      callback: () => {},
      assertions: [],
      children: [],
    };
    await runTestsRecursively(state, {
      bail: false,
      isDebugging: false,
    });

    t.ok(state.caughtException);
    t.ok(state.caughtException.message.includes("at least a single"));
  });

  t.test(
    "runTestsRecursively - enforceSingleAssertion - does not overwrite existing exception",
    async (t) => {
      const state = {
        parent: undefined,
        hasFailure: false,
        name: "test",
        callback: () => {
          throw AppError.notImplemented();
        },
        assertions: [],
        children: [],
      };
      await runTestsRecursively(state, {
        bail: false,
        isDebugging: false,
      });

      t.ok(AppError.instanceOf(state.caughtException));
      t.equal(state.caughtException.key, "error.server.notImplemented");
    },
  );
});
