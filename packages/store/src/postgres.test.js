import { mainTestFn, test } from "@lbu/cli";
import { environment, refreshEnvironmentCache } from "@lbu/stdlib";
import { postgresEnvCheck } from "./postgres.js";

mainTestFn(import.meta);

test("store/postgres", (t) => {
  const oldPostgresUri = environment.POSTGRES_URI;
  const oldPostgresDatabase = environment.POSTGRES_DATABASE;
  const oldAppName = environment.APP_NAME;

  t.test("throw on missing POSTGRES_URI and partials", (t) => {
    delete process.env.POSTGRES_URI;
    refreshEnvironmentCache();

    try {
      postgresEnvCheck();
      t.fail("Should throw");
    } catch (e) {
      t.ok(e);
    }
  });

  t.test("should create POSTGRES_URI based on partials", (t) => {
    process.env.POSTGRES_HOST = "foo";
    process.env.POSTGRES_USER = "bar";
    process.env.POSTGRES_PASSWORD = "baz";

    refreshEnvironmentCache();
    postgresEnvCheck();
    t.equal(environment.POSTGRES_URI, "postgres://bar:baz@foo/", "env cache");
    t.equal(process.env.POSTGRES_URI, "postgres://bar:baz@foo/", "process.env");
  });

  t.test("should fail on missing POSTGRES_DATABASE", (t) => {
    delete process.env.APP_NAME;
    delete process.env.POSTGRES_DATABASE;
    refreshEnvironmentCache();

    try {
      postgresEnvCheck();
      t.fail("Should throw");
    } catch (e) {
      t.ok(e);
    }
  });

  t.test("Should set POSTGRES_DATABASE based on APP_NAME", (t) => {
    process.env.APP_NAME = "lbu";

    refreshEnvironmentCache();
    postgresEnvCheck();
    t.equal(environment.POSTGRES_DATABASE, "lbu", "env cache");
    t.equal(process.env.POSTGRES_DATABASE, "lbu", "process.env");
  });

  t.test("teardown", () => {
    process.env.POSTGRES_URI = oldPostgresUri;
    process.env.POSTGRES_DATABASE = oldPostgresDatabase;
    process.env.APP_NAME = oldAppName;
    refreshEnvironmentCache();
  });
});
