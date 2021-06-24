import { dirnameForModule, exec, pathJoin } from "@compas/stdlib";
import { mainTestFn, test } from "../index.js";

mainTestFn(import.meta);

test("cli/commands/test", (t) => {
  // Use working directory without tests in it, to prevent recursive test runs
  const workingDir = pathJoin(
    dirnameForModule(import.meta),
    "../../../.github/",
  );

  // Use executable, since `yarn compas` uses the root of the repo as the working
  // directory for its spawned 'compas'.
  const compasExecutable = pathJoin(
    dirnameForModule(import.meta),
    "../src/cli.js",
  );

  t.test("--serial spawns single worker", async (t) => {
    const { exitCode, stdout } = await exec(
      `${compasExecutable} test --serial`,
      {
        cwd: workingDir,
      },
    );

    t.equal(exitCode, 0);
    t.ok(stdout.includes("in serial."));
  });

  t.test("--parallel-count spawns number of workers", async (t) => {
    const { exitCode, stdout } = await exec(
      `${compasExecutable} test --parallel-count 5`,
      {
        cwd: workingDir,
      },
    );

    t.equal(exitCode, 0);
    t.ok(stdout.includes("parallel with 5 runners"));
  });
});
