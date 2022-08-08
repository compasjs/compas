import { existsSync } from "fs";
import { rm } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { exec, pathJoin, uuid } from "@compas/stdlib";

mainTestFn(import.meta);

test("create-compas", (t) => {
  const outputDirectory = `./.cache/test-output/${uuid()}`;

  t.timeout = 5000;

  t.test("run", async (t) => {
    const { exitCode, stdout } = await exec(
      `create-compas --output-directory ${outputDirectory} --template-ref main`,
    );

    t.equal(exitCode, 0);
    t.ok(existsSync(outputDirectory));
    t.ok(existsSync(pathJoin(outputDirectory, "./package.json")));

    if (exitCode !== 0) {
      t.log.error({
        message: "create-compas-error",
        stdout,
      });
    }
  });

  t.test("teardown", async (t) => {
    await rm(outputDirectory, { force: true, recursive: true });

    t.pass();
  });
});
