import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { isNil, pathJoin } from "@compas/stdlib";
import { cacheLoadFromDisk } from "./cache.js";

mainTestFn(import.meta);

test("compas/cache", (t) => {
  t.jobs = 2;

  const baseDirectory = ".cache/test/config";

  const getFixtureDirectory = async (name) => {
    const dir = pathJoin(baseDirectory, name);

    await rm(dir, { force: true, recursive: true });
    await mkdir(dir, { recursive: true });

    return dir;
  };

  t.test("cacheLoadFromDisk", (t) => {
    t.test(
      "returns a default cache if cache.json is not present",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory(
          "cache/load-default-0",
        );

        const cache = await cacheLoadFromDisk(fixtureDirectory, "0.0.0");

        t.ok(
          !existsSync(pathJoin(fixtureDirectory, ".cache/compas/cache.json")),
        );
        t.equal(cache.version, "0.0.0");
      },
    );

    t.test(
      "returns a default cache if cache.json can not be parsed",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory(
          "cache/load-default-1",
        );

        await mkdir(pathJoin(fixtureDirectory, ".cache/compas"), {
          recursive: true,
        });
        await writeFile(
          pathJoin(fixtureDirectory, ".cache/compas/cache.json"),
          "{",
        );

        const cache = await cacheLoadFromDisk(fixtureDirectory, "0.0.0");

        t.equal(cache.version, "0.0.0");
      },
    );

    t.test(
      "returns a default cache if cache.json can not be validated",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory(
          "cache/load-default-2",
        );

        await mkdir(pathJoin(fixtureDirectory, ".cache/compas"), {
          recursive: true,
        });
        await writeFile(
          pathJoin(fixtureDirectory, ".cache/compas/cache.json"),
          "{}",
        );

        const cache = await cacheLoadFromDisk(fixtureDirectory, "0.0.0");

        t.equal(cache.version, "0.0.0");
      },
    );

    t.test(
      "returns a default cache if cache.json does not match version",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory(
          "cache/load-default-3",
        );

        await mkdir(pathJoin(fixtureDirectory, ".cache/compas"), {
          recursive: true,
        });
        await writeFile(
          pathJoin(fixtureDirectory, ".cache/compas/cache.json"),
          `{"version": "1",}`,
        );

        const cache = await cacheLoadFromDisk(fixtureDirectory, "0.0.0");

        t.equal(cache.version, "0.0.0");
      },
    );

    t.test(
      "returns a default cache if cache.json does not match version",
      async (t) => {
        const fixtureDirectory = await getFixtureDirectory(
          "cache/load-default-4",
        );

        await mkdir(pathJoin(fixtureDirectory, ".cache/compas"), {
          recursive: true,
        });
        await writeFile(
          pathJoin(fixtureDirectory, ".cache/compas/cache.json"),
          `{"version": "1",}`,
        );

        const cache = await cacheLoadFromDisk(fixtureDirectory, "0.0.0");

        t.equal(cache.version, "0.0.0");
      },
    );

    t.test("returns the loaded cache", async (t) => {
      const fixtureDirectory = await getFixtureDirectory(
        "cache/load-success-0",
      );

      await mkdir(pathJoin(fixtureDirectory, ".cache/compas"), {
        recursive: true,
      });
      await writeFile(
        pathJoin(fixtureDirectory, ".cache/compas/cache.json"),
        JSON.stringify({
          version: "0.0.0",
          config: {
            rootDirectory: "",
            projects: [],
          },
        }),
      );

      const cache = await cacheLoadFromDisk(fixtureDirectory, "0.0.0");

      t.equal(cache.version, "0.0.0");
      t.ok(!isNil(cache.config));
    });
  });
});
