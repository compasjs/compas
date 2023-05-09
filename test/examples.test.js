import { readdir, readFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { environment, exec } from "@compas/stdlib";

mainTestFn(import.meta);

test("compas/examples", async (t) => {
  const examples = await readdir("./examples");

  t.timeout = 5000;

  const configs = (
    await Promise.all(
      examples.map(async (example) => {
        const packageJson = JSON.parse(
          await readFile(`./examples/${example}/package.json`, "utf-8"),
        );

        packageJson.exampleMetadata = packageJson.exampleMetadata ?? {};
        packageJson.exampleMetadata.path = `./examples/${example}`;

        if (
          !Array.isArray(packageJson.exampleMetadata.testing) ||
          packageJson.exampleMetadata.testing.length === 0
        ) {
          return undefined;
        }

        return packageJson;
      }),
    )
  ).filter((it) => !!it);

  t.test("run examples", async (t) => {
    await Promise.all(
      configs.map(async (config) => {
        for (const cmd of config.exampleMetadata.testing) {
          const parts = cmd.split(" ");
          if (parts[0] === "compas") {
            parts[0] = "../../node_modules/.bin/compas";
          }

          const { exitCode, stdout, stderr } = await exec(parts.join(" "), {
            cwd: config.exampleMetadata.path,
            env: {
              PATH: environment.PATH,
              CI: environment.CI,
              GITHUB_ACTIONS: environment.GITHUB_ACTIONS,
            },
          });

          t.equal(
            exitCode,
            0,
            `Path: ${config.exampleMetadata.path}, Command: ${cmd}, Exitcode: ${exitCode}`,
          );

          if (exitCode !== 0) {
            t.log.error({
              config,
              cmd,
              stdout,
              stderr,
            });
          }
        }
      }),
    );
  });
});
