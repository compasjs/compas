import { existsSync } from "node:fs";
import { mkdir, readFile, rm } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { configLoadEnvironment } from "./environment.js";

mainTestFn(import.meta);

test("compas/config/environment", (t) => {
  t.jobs = 4;

  const baseDirectory = ".cache/test/config/environment";

  const getFixtureDirectory = async (name) => {
    const dir = pathJoin(baseDirectory, name);

    await rm(dir, { force: true, recursive: true });
    await mkdir(dir, { recursive: true });

    return dir;
  };

  t.test("writes default .env if no .env is present", async (t) => {
    const fixtureDirectory = await getFixtureDirectory("default-0");

    const env = await configLoadEnvironment(fixtureDirectory, false);

    t.ok(existsSync(pathJoin(fixtureDirectory, ".env")));
    t.equal(
      await readFile(pathJoin(fixtureDirectory, ".env"), "utf-8"),
      "NODE_ENV=development\nAPP_NAME=compas\n",
    );

    t.equal(env.isDevelopment, true);
    t.equal(env.appName, "compas");
  });

  t.test("does not write default .env if NODE_ENV is set", async (t) => {
    const fixtureDirectory = await getFixtureDirectory("default-1");

    const env = await configLoadEnvironment(fixtureDirectory, true);

    t.ok(!existsSync(pathJoin(fixtureDirectory, ".env")));

    t.equal(env.isDevelopment, true);
    t.equal(env.appName, "compas");
  });
});
