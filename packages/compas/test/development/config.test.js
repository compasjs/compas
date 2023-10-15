import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { TestCompas, testDirectory } from "../utils.js";

mainTestFn(import.meta);

test("compas/development/config", (t) => {
  const workingDirectory = testDirectory(t.name);

  t.test("config does not exist", async (t) => {
    const cwd = workingDirectory("no-config");

    const cli = new TestCompas({
      cwd,
    })
      .withPackageJson("{}")
      .launch();

    await cli.waitForOutput("debug", "config.resolveProjectConfig");
    await cli.exit();

    t.ok(!existsSync(pathJoin(cwd, "config/compas.json")));
    t.ok(
      (await readFile(cli.debugFilePath, "utf-8")).includes(
        "No config file found",
      ),
    );
  });
});
