import { mkdir, rm, writeFile } from "fs/promises";
import { exec, uuid } from "@compas/stdlib";
import { mainTestFn, test } from "../../index.js";

mainTestFn(import.meta);

test("cli/docker/migrate", async (t) => {
  const fileContents = `
      export const postgresConnectionSettings = { max: 2, createIfNotExists: true };
   `;

  const filePath = `./packages/cli/tmp/${uuid()}.js`;

  await mkdir("./packages/cli/tmp", { recursive: true });
  await writeFile(filePath, fileContents, "utf-8");

  t.test("tests", (t) => {
    t.jobs = 3;

    t.test("no --connection-settings specified", async (t) => {
      const { exitCode } = await exec(
        `compas migrate info --connection-settings`,
      );
      t.equal(exitCode, 1);
    });

    t.test("--connection-settings invalid file", async (t) => {
      const { exitCode } = await exec(
        `compas migrate info --connection-settings /tmp/${uuid()}.js`,
      );
      t.equal(exitCode, 1);
    });

    t.test("--connection-settings are loaded", async (t) => {
      const { exitCode, stdout, stderr } = await exec(
        `compas migrate info --connection-settings ${filePath}`,
      );

      t.equal(exitCode, 0);

      if (exitCode !== 0) {
        t.log.error({
          stdout,
          stderr,
        });
      }
    });
  });

  t.test("teardown", async (t) => {
    await rm("./packages/cli/tmp", { recursive: true, force: true });
    t.pass();
  });
});
