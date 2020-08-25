import { test } from "./runner.js";
import { areTestsRunning, testLogger, timeout } from "./state.js";

test("cli/test/state", (t) => {
  t.test("areTestRunning", (t) => {
    t.equal(areTestsRunning, true);
  });

  t.test("config loaded", (t) => {
    t.equal(timeout, 2000);
  });

  t.test("test logger is available", (t) => {
    t.equal(t.log, testLogger);
  });
});
