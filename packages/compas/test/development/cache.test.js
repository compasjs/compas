import { readFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { writeFileChecked } from "../../src/shared/fs.js";
import { testCompasCli, testDirectory } from "../utils.js";

mainTestFn(import.meta);

test("compas/development/cache", (t) => {
  t.jobs = 4;

  const workingDirectory = testDirectory(t.name);

  t.test("cache does not exist", async (t) => {
    const cwd = workingDirectory("no-cache");

    await writeFileChecked(pathJoin(cwd, "package.json"), "{}");

    const { stdout } = await testCompasCli({
      args: [],
      inputs: [
        {
          write: "Q",
        },
      ],
      cwd,
    });

    t.ok(stdout.includes("Starting up..."));
  });

  t.test("cache version mismatch", async (t) => {
    const cwd = workingDirectory("version-mismatch");

    await writeFileChecked(pathJoin(cwd, "package.json"), "{}");
    await writeFileChecked(
      pathJoin(cwd, ".cache/compas/cache.json"),
      JSON.stringify({
        version: "0.5.0",
      }),
    );

    const { stdout } = await testCompasCli({
      args: [],
      inputs: [
        {
          write: "Q",
        },
      ],
      cwd,
    });

    t.ok(stdout.includes("Starting up..."));
  });

  t.test("cache not parseable", async (t) => {
    const cwd = workingDirectory("no-parseable");

    await writeFileChecked(pathJoin(cwd, "package.json"), "{}");
    await writeFileChecked(
      pathJoin(cwd, ".cache/compas/cache.json"),
      JSON.stringify({
        version: "0.5.0",
      }).slice(0, 5),
    );

    const { stdout } = await testCompasCli({
      args: [],
      inputs: [
        {
          write: "Q",
        },
      ],
      cwd,
    });

    t.ok(stdout.includes("Starting up..."));
  });

  t.test("cache not passing validators", async (t) => {
    const cwd = workingDirectory("validators");

    await writeFileChecked(pathJoin(cwd, "package.json"), "{}");
    await writeFileChecked(
      pathJoin(cwd, ".cache/compas/cache.json"),
      JSON.stringify({
        version: 1,
      }),
    );

    const { stdout } = await testCompasCli({
      args: [],
      inputs: [
        {
          write: "Q",
        },
      ],
      cwd,
    });

    t.ok(stdout.includes("Starting up..."));
  });

  t.test("cache is used", async (t) => {
    const cwd = workingDirectory("valid");

    await writeFileChecked(pathJoin(cwd, "package.json"), "{}");
    await writeFileChecked(
      pathJoin(cwd, ".cache/compas/cache.json"),
      JSON.stringify({
        version: `Compas v${
          JSON.parse(
            await readFile(
              pathJoin(dirnameForModule(import.meta), "../../package.json"),
              "utf-8",
            ),
          ).version
        }`,
      }),
    );

    const { stdout } = await testCompasCli({
      args: ["--debug"],
      inputs: [
        {
          write: "Q",
        },
      ],
      cwd,
    });

    t.ok(stdout.includes("Starting up from cache..."));
  });

  t.test("cache is written", async (t) => {
    const cwd = workingDirectory("valid");

    await writeFileChecked(pathJoin(cwd, "package.json"), "{}");
    await writeFileChecked(
      pathJoin(cwd, ".cache/compas/cache.json"),
      JSON.stringify({
        version: `Compas v${
          JSON.parse(
            await readFile(
              pathJoin(dirnameForModule(import.meta), "../../package.json"),
              "utf-8",
            ),
          ).version
        }`,
      }),
    );

    const { stdout } = await testCompasCli({
      args: ["--debug"],
      inputs: [
        {
          write: "1",
          // Should wait for cache to be written.
          timeout: 55,
        },
        {
          write: "Q",
        },
      ],
      cwd,
    });

    const resolvedCache = JSON.parse(
      await readFile(pathJoin(cwd, ".cache/compas/cache.json"), "utf-8"),
    );

    t.ok(stdout.includes("Starting up from cache..."));
    t.ok(resolvedCache.config);
    t.ok(resolvedCache.cachesCleaned);
  });
});
