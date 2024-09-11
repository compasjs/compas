import { match, strictEqual } from "node:assert";
import { setTimeout } from "node:timers/promises";
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
      await runTestsRecursively(
        {
          timeout: 10,
        },
        state,
      );

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
    await runTestsRecursively(
      {
        timeout: 10,
      },
      state,
    );

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
    await runTestsRecursively(
      {
        timeout: 10,
      },
      state,
    );

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
      await runTestsRecursively(
        {
          timeout: 10,
        },
        state,
      );

      t.ok(AppError.instanceOf(state.caughtException));
      t.equal(state.caughtException.key, "error.server.notImplemented");
    },
  );

  t.test("parallel", (t) => {
    const start = new Date();

    t.test("act", (t) => {
      t.jobs = 5;

      for (let i = 0; i < 10; ++i) {
        t.test(`${i}`, async (t) => {
          await setTimeout(i);
          t.pass();
        });
      }
    });

    t.test("assert", (t) => {
      const stop = new Date();

      // total of 9...0 = 45, but should be shorter than that, even with a bit of test
      // runner overhead. The minimum time is 13ms -> 4 + 9
      t.ok(stop - start < 45, `Actual time: ${stop - start}ms`);
    });
  });
});
