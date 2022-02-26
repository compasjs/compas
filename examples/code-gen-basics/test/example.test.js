import { rm } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { dirnameForModule, exec, pathJoin } from "@compas/stdlib";

mainTestFn(import.meta);

test("examples/code-gen-basics", async (t) => {
  // Check if the structure generates without errors.

  const { exitCode, stdout, stderr } = await exec(
    `./node_modules/.bin/compas run generate`,
    {
      cwd: pathJoin(dirnameForModule(import.meta), "../"),
    },
  );

  if (exitCode !== 0) {
    t.log.info({
      stdout,
      stderr,
    });
  }

  t.equal(exitCode, 0);

  await rm(pathJoin(dirnameForModule(import.meta), "../src"), {
    force: true,
    recursive: true,
  });
});
