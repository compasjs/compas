import { mainTestFn, test } from "@compas/cli";
import { isNil } from "@compas/stdlib";
import { TestCompas, testDirectory } from "./utils.js";

mainTestFn(import.meta);

test("compas/cli", (t) => {
  t.jobs = 4;

  const workingDirectory = testDirectory(t.name);

  t.test("does not create a debug file without --debug", async (t) => {
    const cwd = workingDirectory("no-debug");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["foo"],
      },
    ).launch();

    await cli.waitForExit();
    await cli.recalculateOutputState();

    t.ok(isNil(cli.debugFilePath));
  });

  t.test("creates a debug file with --debug", async (t) => {
    const cwd = workingDirectory("with-debug");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["foo", "--debug"],
      },
    ).launch();

    await cli.waitForExit();
    await cli.recalculateOutputState();

    t.ok(cli.debugFilePath);
  });

  t.test("package.json is not available", async (t) => {
    const cwd = workingDirectory("no-package-json");

    const cli = new TestCompas({
      cwd,
    }).launch();

    await cli.waitForExit();

    t.ok(
      cli.stdout.includes(
        "Please run 'npx compas@latest init' to install Compas.",
      ),
    );
  });

  t.test("unsupported command", async (t) => {
    const cwd = workingDirectory("unknown-command");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["foo"],
      },
    ).launch();

    await cli.waitForExit();

    t.ok(cli.stdout.includes("Unsupported command. Available commands:"));
  });
});
