import { readFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { TestCompas, testDirectory } from "../utils.js";

mainTestFn(import.meta);

test("compas/development/cache", (t) => {
  t.jobs = 4;

  const workingDirectory = testDirectory(t.name);

  t.test("cache does not exist", async (t) => {
    const cwd = workingDirectory("no-cache");

    const cli = new TestCompas({
      cwd,
    })
      .withPackageJson("{}")
      .launch();

    await cli.waitForOutput("stdout", "Starting up...");
    await cli.writeInput("Q");
    await cli.waitForExit();

    t.pass();
  });

  t.test("cache version mismatch", async (t) => {
    const cwd = workingDirectory("version-mismatch");

    const cli = new TestCompas({
      cwd,
    }).withPackageJson("{}");

    await cli.writeFile(
      ".cache/compas/cache.json",
      JSON.stringify({
        version: "0.5.0",
      }),
    );
    cli.launch();

    await cli.waitForOutput("stdout", "Starting up...");
    await cli.writeInput("Q");
    await cli.waitForExit();

    t.pass();
  });

  t.test("cache not parseable", async (t) => {
    const cwd = workingDirectory("no-parseable");

    const cli = new TestCompas({
      cwd,
    }).withPackageJson("{}");

    await cli.writeFile(
      ".cache/compas/cache.json",
      JSON.stringify({
        version: "0.5.0",
      }).slice(0, 5),
    );
    cli.launch();

    await cli.waitForOutput("stdout", "Starting up...");
    await cli.writeInput("Q");
    await cli.waitForExit();

    t.pass();
  });

  t.test("cache not passing validators", async (t) => {
    const cwd = workingDirectory("validators");

    const cli = new TestCompas({
      cwd,
    }).withPackageJson("{}");

    await cli.writeFile(
      ".cache/compas/cache.json",
      JSON.stringify({
        version: 1,
      }),
    );
    cli.launch();

    await cli.waitForOutput("stdout", "Starting up...");
    await cli.writeInput("Q");
    await cli.waitForExit();

    t.pass();
  });

  t.test("cache is used", async (t) => {
    const cwd = workingDirectory("valid");

    const cli = new TestCompas({
      cwd,
    }).withPackageJson("{}");

    await cli.writeFile(
      ".cache/compas/cache.json",
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
    cli.launch();

    await cli.waitForOutput("stdout", "Starting up from cache...");
    await cli.writeInput("Q");
    await cli.waitForExit();

    t.pass();
  });

  t.test("cache is written", async (t) => {
    const cwd = workingDirectory("written");

    const cli = new TestCompas({
      cwd,
    })
      .withPackageJson("{}")
      .launch();

    await cli.waitForOutput("stdout", "Starting up");
    await cli.writeInput("Q");
    await cli.waitForExit();

    const resolvedCache = JSON.parse(
      await readFile(pathJoin(cwd, ".cache/compas/cache.json"), "utf-8"),
    );

    t.ok(resolvedCache.config);
  });
});
