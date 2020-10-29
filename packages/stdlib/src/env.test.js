import { mainTestFn, test } from "@lbu/cli";
import { isProduction, isStaging, refreshEnvironmentCache } from "./env.js";

mainTestFn(import.meta);

test("stdlib/env", (t) => {
  t.test("isProduction", (t) => {
    const currentEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = "production";
    refreshEnvironmentCache();
    t.equal(isProduction(), true);

    process.env.NODE_ENV = "development";
    refreshEnvironmentCache();
    t.equal(isProduction(), false);

    process.env.NODE_ENV = undefined;
    refreshEnvironmentCache();
    t.equal(isProduction(), false);

    process.env.NODE_ENV = currentEnv;
    refreshEnvironmentCache();
  });

  t.test("isStaging", (t) => {
    const currentEnv = process.env.NODE_ENV;
    const currentIsStaging = process.env.IS_STAGING;

    process.env.NODE_ENV = "production";
    process.env.IS_STAGING = "true";
    refreshEnvironmentCache();
    t.equal(isStaging(), true);

    process.env.NODE_ENV = "production";
    process.env.IS_STAGING = undefined;
    refreshEnvironmentCache();
    t.equal(isStaging(), false);

    process.env.NODE_ENV = "production";
    process.env.IS_STAGING = "false";
    refreshEnvironmentCache();
    t.equal(isStaging(), false);

    process.env.NODE_ENV = "development";
    process.env.IS_STAGING = "true";
    refreshEnvironmentCache();
    t.equal(isStaging(), true);

    process.env.NODE_ENV = "development";
    process.env.IS_STAGING = "false";
    refreshEnvironmentCache();
    t.equal(isStaging(), true);

    process.env.NODE_ENV = currentEnv;
    process.env.IS_STAGING = currentIsStaging;
    refreshEnvironmentCache();
  });
});
