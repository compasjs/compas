import { test } from "./runner.js";
import { areTestsRunning } from "./state.js";
import { mainTestFn } from "./utils.js";

mainTestFn(import.meta);

test("cli/test/state", (t) => {
  t.test("areTestRunning", (t) => {
    t.equal(areTestsRunning, true);
  });

  t.test("test logger is available", (t) => {
    t.equal(typeof t.log.info, "function");
    t.equal(typeof t.log.error, "function");
  });
});
