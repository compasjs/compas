import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { testCompasCli, testDirectory } from "./utils.js";

mainTestFn(import.meta);

test("compas/cli", (t) => {
  t.jobs = 4;

  const workingDirectory = testDirectory(t.name);

  t.test("does not create a debug file without --debug", async (t) => {
    const cwd = workingDirectory("no-debug");

    await testCompasCli({
      args: ["foo"],
      inputs: [],
      waitForExit: true,
      cwd,
    });

    t.equal(existsSync(pathJoin(cwd, ".cache/compas")), false);
  });

  t.test("creates a debug file with --debug", async (t) => {
    const cwd = workingDirectory("with-debug");

    await testCompasCli({
      args: ["foo", "--debug"],
      inputs: [],
      waitForExit: true,
      cwd,
    });

    t.equal(existsSync(pathJoin(cwd, ".cache/compas")), true);
    t.equal(
      (await readdir(pathJoin(cwd, ".cache/compas"), {})).some(
        (it) => it.startsWith("debug-") && it.endsWith(".txt"),
      ),
      true,
    );
  });

  t.test("package.json is not available", async (t) => {
    const cwd = workingDirectory("no-package-json");

    const { stdout } = await testCompasCli({
      args: [],
      inputs: [],
      waitForExit: true,
      cwd,
    });

    t.ok(
      stdout.includes("Please run 'npx compas@latest init' to install Compas."),
    );
  });

  t.test("unsupported command", async (t) => {
    const cwd = workingDirectory("unknown-command");

    const { stdout } = await testCompasCli({
      args: ["foo"],
      inputs: [],
      waitForExit: true,
      cwd,
    });

    t.ok(stdout.includes(`Unsupported command. Available commands:`));
  });
});
