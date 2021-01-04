import { existsSync } from "fs";
import { mainTestFn, test } from "@compas/cli";
import { environment, spawn } from "@compas/stdlib";

mainTestFn(import.meta);

test("cli/commands/visualise", (t) => {
  if (environment.CI === "true") {
    t.log.info("CI detected, skipping visualise tests");
    return;
  }

  t.test("visualise default", async (t) => {
    const { exitCode } = await spawn(`yarn`, [
      "compas",
      "visualise",
      "sql",
      "./packages/store/src/generated/index.js",
    ]);

    t.equal(exitCode, 0);
  });

  t.test("visualise with arguments", async (t) => {
    const { exitCode } = await spawn(`yarn`, [
      "compas",
      "visualise",
      "sql",
      "./packages/store/src/generated/index.js",
      "--format",
      "png",
      "--output",
      "/tmp/visualise.png",
    ]);

    t.equal(exitCode, 0);
    t.ok(existsSync("/tmp/visualise.png"));
  });
});
