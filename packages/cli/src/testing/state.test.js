import { test } from "./runner.js";
import { areTestsRunning, testLogger, timeout } from "./state.js";
import { mainTestFn } from "./utils.js";

mainTestFn(import.meta);

test("cli/test/state", (t) => {
  const originalTimeout = timeout;

  t.test("areTestRunning", (t) => {
    t.equal(areTestsRunning, true);
  });

  t.test("config loaded", (t) => {
    t.equal(timeout, 2000);
  });

  t.test("test logger is available", (t) => {
    t.equal(t.log, testLogger);
  });

  t.test("set timeout of child test", (t) => {
    t.timeout = 1000;
    t.test("timeout is correct", (t) => {
      t.equal(timeout, 1000);
      t.pass();
    });
  });

  t.test("timeout is reset to original value", (t) => {
    t.equal(timeout, originalTimeout);
  });
});
