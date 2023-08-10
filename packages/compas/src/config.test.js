import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { isNil, pathJoin } from "@compas/stdlib";
import { configLoadEnvironment, configResolve } from "./config.js";

mainTestFn(import.meta);

test("compas/config/environment", (t) => {
  t.jobs = 2;

  const baseDirectory = ".cache/test/config";

  const getFixtureDirectory = async (name) => {
    const dir = pathJoin(baseDirectory, name);

    await rm(dir, { force: true, recursive: true });
    await mkdir(dir, { recursive: true });

    return dir;
  };

  t.test("configLoadEnvironment", (t) => {
    t.test("writes default .env if no .env is present", async (t) => {
      const fixtureDirectory = await getFixtureDirectory(
        "environment/default-0",
      );

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
      const fixtureDirectory = await getFixtureDirectory(
        "environment/default-1",
      );

      const env = await configLoadEnvironment(fixtureDirectory, true);

      t.ok(!existsSync(pathJoin(fixtureDirectory, ".env")));

      t.equal(env.isDevelopment, true);
      t.equal(env.appName, "compas");
    });
  });

  t.test("configResolve", (t) => {
    t.test(
      "write default config if no config is present in root",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory("resolve/default-0");

        const config = await configResolve(fixtureDirectory, true);

        t.ok(existsSync(pathJoin(fixtureDirectory, "config/compas.json")));
        t.equal(
          await readFile(
            pathJoin(fixtureDirectory, "config/compas.json"),
            "utf-8",
          ),
          "{}",
        );
        t.deepEqual(JSON.parse(JSON.stringify(config)), {
          rootDirectory: fixtureDirectory,
          projects: [],
        });
      },
    );

    t.test(
      "returns default config if no config is present in non root projects",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory("resolve/default-1");

        const config = await configResolve(fixtureDirectory, false);

        t.ok(!existsSync(pathJoin(fixtureDirectory, "config/compas.json")));
        t.deepEqual(config, {
          rootDirectory: fixtureDirectory,
          projects: [],
        });
      },
    );

    t.test("returns undefined when the file can't be parsed", async (t) => {
      const fixtureDirectory = await getFixtureDirectory(
        "resolve/parse-error-0",
      );

      await mkdir(pathJoin(fixtureDirectory, "config"));
      await writeFile(pathJoin(fixtureDirectory, "config/compas.json"), "{");

      const config = await configResolve(fixtureDirectory, true);

      t.ok(isNil(config));
    });

    t.test(
      "returns undefined when the config doesn't pass the validators",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory(
          "resolve/validate-error-0",
        );

        await mkdir(pathJoin(fixtureDirectory, "config"));
        await writeFile(
          pathJoin(fixtureDirectory, "config/compas.json"),
          JSON.stringify({
            projects: [1],
          }),
        );

        const config = await configResolve(fixtureDirectory, true);

        t.ok(isNil(config));
      },
    );

    t.test(
      "returns undefined when a nested project doesn't pass the validators",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory(
          "resolve/validate-error-1",
        );
        const nestedFixtureDirectory = await getFixtureDirectory(
          "resolve/validate-error-1/nested-0",
        );

        await mkdir(pathJoin(fixtureDirectory, "config"));
        await writeFile(
          pathJoin(fixtureDirectory, "config/compas.json"),
          JSON.stringify({
            projects: ["nested-0"],
          }),
        );

        await mkdir(pathJoin(nestedFixtureDirectory, "config"));
        await writeFile(
          pathJoin(nestedFixtureDirectory, "config/compas.json"),
          JSON.stringify({
            projects: [1],
          }),
        );

        const config = await configResolve(fixtureDirectory, false);

        t.ok(isNil(config));
      },
    );

    t.test("returns the resolved config", async (t) => {
      const fixtureDirectory = await getFixtureDirectory("resolve/ok-0");

      await mkdir(pathJoin(fixtureDirectory, "config"));
      await writeFile(
        pathJoin(fixtureDirectory, "config/compas.json"),
        JSON.stringify({
          projects: [],
        }),
      );

      const config = await configResolve(fixtureDirectory, true);

      t.deepEqual(JSON.parse(JSON.stringify(config)), {
        rootDirectory: fixtureDirectory,
        projects: [],
      });
    });

    t.test("returns the resolved config recursively", async (t) => {
      const fixtureDirectory = await getFixtureDirectory("resolve/ok-1");
      const nestedFixtureDirectory = await getFixtureDirectory(
        "resolve/ok-1/nested-0",
      );

      await mkdir(pathJoin(fixtureDirectory, "config"));
      await writeFile(
        pathJoin(fixtureDirectory, "config/compas.json"),
        JSON.stringify({
          projects: ["nested-0"],
        }),
      );

      const config = await configResolve(fixtureDirectory, true);

      t.deepEqual(JSON.parse(JSON.stringify(config)), {
        rootDirectory: fixtureDirectory,
        projects: [
          {
            rootDirectory: nestedFixtureDirectory,
            projects: [],
          },
        ],
      });
    });
  });
});
