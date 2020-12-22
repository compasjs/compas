import { mainTestFn, test } from "@compas/cli";
import { environment, spawn } from "@compas/stdlib";

mainTestFn(import.meta);

test("cli/commands/visualise", async (t) => {
  if (environment.CI === "true") {
    t.log.info("CI detected, skipping visualise tests");
    return;
  }
  const { exitCode } = await spawn(`yarn`, [
    "compas",
    "visualise",
    "sql",
    "./packages/store/src/generated/index.js",
  ]);

  t.equal(exitCode, 0);
});
