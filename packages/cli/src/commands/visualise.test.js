import { existsSync, statSync } from "fs";
import { rm } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { environment, spawn } from "@compas/stdlib";

mainTestFn(import.meta);

test("cli/commands/visualise", (t) => {
  if (environment.CI === "true") {
    t.log.info("CI detected, skipping visualise tests");
    t.pass();
    return;
  }

  t.test("visualise default", async (t) => {
    await rm(`/tmp/compas_sql.svg`, { force: true });

    const { exitCode } = await spawn(`yarn`, [
      "compas",
      "visualise",
      "sql",
      "./packages/store/src/generated/common/structure.js",
    ]);

    t.equal(exitCode, 0);
  });

  t.test("visualise creates output dir", async (t) => {
    await rm(`/tmp/visualise_dir`, { force: true, recursive: true });

    const { exitCode } = await spawn(`yarn`, [
      "compas",
      "visualise",
      "sql",
      "./packages/store/src/generated/common/structure.js",
      "--output",
      "/tmp/visualise_dir/visualise.svg",
    ]);

    t.equal(exitCode, 0);
  });

  t.test("visualise with arguments", async (t) => {
    await rm(`/tmp/visualise.svg`, { force: true });

    const { exitCode } = await spawn(`yarn`, [
      "compas",
      "visualise",
      "sql",
      "./packages/store/src/generated/common/structure.js",
      "--format",
      "svg",
      "--output",
      "/tmp/visualise.svg",
    ]);

    t.equal(exitCode, 0);
    t.ok(existsSync("/tmp/visualise.svg"));
  });

  t.test("hash check", async (t) => {
    const stats = statSync("/tmp/visualise.svg");

    const { exitCode } = await spawn(`yarn`, [
      "compas",
      "visualise",
      "sql",
      "./packages/store/src/generated/common/structure.js",
      "--format",
      "svg",
      "--output",
      "/tmp/visualise.svg",
    ]);

    t.equal(exitCode, 0);
    const newStats = statSync("/tmp/visualise.svg");

    t.deepEqual(stats.mtime, newStats.mtime);
  });
});
