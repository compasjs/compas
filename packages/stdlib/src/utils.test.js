import { mainTestFn, test } from "@lbu/cli";
import {
  gc,
  getSecondsSinceEpoch,
  isMainFnAndReturnName,
  isProduction,
  isStaging,
} from "./utils.js";

mainTestFn(import.meta);

test("stdlib/utils", (t) => {
  t.test("getSecondsSinceEpoch", (t) => {
    t.ok(Number.isInteger(getSecondsSinceEpoch()));
  });

  t.test("gc", (t) => {
    try {
      gc();
    } catch (e) {
      t.fail("Should not throw");
      t.log.error(e);
    }
  });

  t.test("isProduction", (t) => {
    const currentEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = "production";
    t.equal(isProduction(), true);

    process.env.NODE_ENV = "development";
    t.equal(isProduction(), false);

    process.env.NODE_ENV = undefined;
    t.equal(isProduction(), false);

    process.env.NODE_ENV = currentEnv;
  });

  t.test("isStaging", (t) => {
    const currentEnv = process.env.NODE_ENV;
    const currentIsStaging = process.env.IS_STAGING;

    process.env.NODE_ENV = "production";
    process.env.IS_STAGING = "true";
    t.equal(isStaging(), true);

    process.env.NODE_ENV = "production";
    process.env.IS_STAGING = undefined;
    t.equal(isStaging(), false);

    process.env.NODE_ENV = "production";
    process.env.IS_STAGING = "false";
    t.equal(isStaging(), false);

    process.env.NODE_ENV = "development";
    process.env.IS_STAGING = "true";
    t.equal(isStaging(), true);

    process.env.NODE_ENV = "development";
    process.env.IS_STAGING = "false";
    t.equal(isStaging(), true);

    process.env.NODE_ENV = currentEnv;
    process.env.IS_STAGING = currentIsStaging;
  });

  t.test("isMainFnAndGetName", (t) => {
    const baseUrl = `file://${process.cwd()}`;
    const nonMainFnResult = isMainFnAndReturnName({
      url: `${baseUrl}/packages/stdlib/src/utils.js`,
    });

    t.equal(nonMainFnResult.isMainFn, false);
    // Still returns the name of the file that is the process entrypoint
    t.equal(nonMainFnResult.name, "test");

    const isMainFnResult = isMainFnAndReturnName({
      url: `${baseUrl}/packages/cli/scripts/test.js`,
    });

    t.equal(isMainFnResult.isMainFn, true);
    t.equal(isMainFnResult.name, "test");
  });
});
