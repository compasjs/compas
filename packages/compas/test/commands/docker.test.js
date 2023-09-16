import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { TestCompas, testDirectory } from "../utils.js";

mainTestFn(import.meta);

test("compas/commands/init/docker", (t) => {
  t.jobs = 4;

  const workingDirectory = testDirectory(t.name);

  t.test("exits in CI mode", async (t) => {
    const cwd = workingDirectory("no-ci");

    const cli = new TestCompas(
      {
        cwd,
        env: {
          ...process.env,
          CI: "true",
        },
      },
      {
        args: ["init", "docker"],
      },
    ).launch();

    await cli.waitForExit();

    t.ok(cli.stdout.includes("'compas init docker' is not supported in CI."));
  });

  t.test("exits when 'dockerContainers' already exists", async (t) => {
    const cwd = workingDirectory("key-present");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init", "docker"],
      },
    )
      .withConfig(
        JSON.stringify({
          dockerContainers: {
            foo: {
              image: "postgres:16",
            },
          },
        }),
      )
      .launch();

    await cli.waitForExit();

    t.ok(
      cli.stdout.includes("The project already includes 'dockerContainers'"),
    );
  });

  t.test("empty config creates a new file", async (t) => {
    const cwd = workingDirectory("no-config");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init", "docker"],
      },
    ).launch();

    await cli.waitForExit();

    t.ok(cli.stdout.includes("Updated the config"));
    t.ok(existsSync(pathJoin(cwd, "config/compas.json")));

    const contents = JSON.parse(
      await readFile(pathJoin(cwd, "config/compas.json"), "utf-8"),
    );

    t.ok(contents.dockerContainers["compas-postgres-16"]);
    t.ok(contents.dockerContainers["compas-minio"]);
  });

  t.test("existing config is updated", async (t) => {
    const cwd = workingDirectory("existing-config");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init", "docker"],
      },
    )
      .withConfig(
        JSON.stringify({
          dockerContainers: {},
        }),
      )
      .launch();

    await cli.waitForExit();

    t.ok(cli.stdout.includes("Updated the config"));
    t.ok(existsSync(pathJoin(cwd, "config/compas.json")));

    const contents = JSON.parse(
      await readFile(pathJoin(cwd, "config/compas.json"), "utf-8"),
    );

    t.ok(contents.dockerContainers["compas-postgres-16"]);
    t.ok(contents.dockerContainers["compas-minio"]);
  });
});
