import test from "tape";
import {
  gc,
  getSecondsSinceEpoch,
  isMainFnAndReturnName,
  isProduction,
  isStaging,
} from "./utils.js";

test("stdlib/utils", async (t) => {
  t.test("getSecondsSinceEpoch", async (t) => {
    t.ok(Number.isInteger(getSecondsSinceEpoch()));
  });

  t.test("gc", async (t) => {
    t.doesNotThrow(() => gc());
  });

  t.test("isProduction", async (t) => {
    const currentEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = "production";
    t.equal(isProduction(), true);

    process.env.NODE_ENV = "development";
    t.equal(isProduction(), false);

    process.env.NODE_ENV = undefined;
    t.equal(isProduction(), false);

    process.env.NODE_ENV = currentEnv;
  });

  t.test("isStaging", async (t) => {
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

  t.test("isMainFnAndGetName", async (t) => {
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
