import { mainTestFn, test } from "@compas/cli";
import { exec } from "@compas/stdlib";

mainTestFn(import.meta);

test("create-compas", async (t) => {
  const { exitCode, stdout } = await exec("create-compas");

  t.equal(exitCode, 0);

  t.ok(stdout.includes("1907"));
});
