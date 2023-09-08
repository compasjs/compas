import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { TestCompas, testDirectory } from "../utils.js";

mainTestFn(import.meta);

test("compas/commands/init", (t) => {
  t.jobs = 4;

  const workingDirectory = testDirectory(t.name);

  t.test("exits in CI mode", async (t) => {
    const cwd = workingDirectory("no-ci");

    const cli = new TestCompas(
      {
        cwd,
        env: {
          ...process.env,
          CI: "true",
        },
      },
      {
        args: ["init"],
      },
    ).launch();

    await cli.waitForExit();

    t.ok(cli.stdout.includes("'compas init' is not supported in CI."));
  });

  t.test("new project", async (t) => {
    const cwd = workingDirectory("new-project");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init"],
      },
    ).launch();

    await cli.waitForExit();

    // Package.json
    t.ok(
      existsSync(pathJoin(cwd, "package.json")),
      "Should create a package.json",
    );
    t.deepEqual(
      JSON.parse(await readFile(pathJoin(cwd, "package.json"), "utf-8")),
      {
        name: "new-project",
        private: true,
        version: "0.0.1",
        type: "module",
        scripts: {},
        dependencies: {
          compas: JSON.parse(
            await readFile(
              pathJoin(dirnameForModule(import.meta), "../../package.json"),
              "utf-8",
            ),
          ).version,
        },
      },
    );

    // Package manager
    t.ok(cli.stdout.includes("_compas_skip_package_manager_install"));

    // Git
    t.ok(
      existsSync(pathJoin(cwd, ".gitignore")),
      ".gitignore should've been created",
    );
    t.ok(existsSync(pathJoin(cwd, ".git")), "Git repo should've been created");

    // Output
    t.ok(cli.stdout.includes("'npx compas'"));
  });

  t.test("new project - already .git", async (t) => {
    const cwd = workingDirectory("new-project-already-git");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init"],
      },
    );

    await cli.writeFile(".git/.gitkeep", "");
    cli.launch();

    await cli.waitForExit();

    // Package.json
    t.ok(
      existsSync(pathJoin(cwd, "package.json")),
      "Should create a package.json",
    );

    // Package manager
    t.ok(cli.stdout.includes("_compas_skip_package_manager_install"));

    // Git
    t.ok(
      existsSync(pathJoin(cwd, ".gitignore")),
      ".gitignore should've been created",
    );
    t.equal(
      (await readdir(pathJoin(cwd, ".git"))).length,
      1,
      ".git directory should only contain a .gitkeep",
    );

    // Output
    t.ok(cli.stdout.includes("'npx compas'"));
  });

  t.test("exiting project - no dependencies", async (t) => {
    const cwd = workingDirectory("existing-project-no-deps");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init"],
      },
    )
      .withPackageJson("{}")
      .launch();

    await cli.waitForExit();

    // Package.json
    t.deepEqual(
      JSON.parse(await readFile(pathJoin(cwd, "package.json"), "utf-8")),
      {
        dependencies: {
          compas: JSON.parse(
            await readFile(
              pathJoin(dirnameForModule(import.meta), "../../package.json"),
              "utf-8",
            ),
          ).version,
        },
      },
    );

    // Package manager
    t.ok(cli.stdout.includes("Patching package.json"));
    t.ok(cli.stdout.includes("_compas_skip_package_manager_install"));

    // Output
    t.ok(cli.stdout.includes("Ready to roll!"));
  });

  t.test("exiting project - no update", async (t) => {
    const cwd = workingDirectory("existing-project-no-update");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init"],
      },
    )
      .withPackageJson(
        JSON.stringify({
          dependencies: {
            compas: JSON.parse(
              await readFile(
                pathJoin(dirnameForModule(import.meta), "../../package.json"),
                "utf-8",
              ),
            ).version,
          },
        }),
      )
      .launch();

    await cli.waitForExit();

    // Package.json
    t.deepEqual(
      JSON.parse(await readFile(pathJoin(cwd, "package.json"), "utf-8")),
      {
        dependencies: {
          compas: JSON.parse(
            await readFile(
              pathJoin(dirnameForModule(import.meta), "../../package.json"),
              "utf-8",
            ),
          ).version,
        },
      },
    );

    // Package manager
    t.ok(
      !cli.stdout.includes("_compas_skip_package_manager_install"),
      "Package manager did run, but didn't need to",
    );

    // Output
    t.ok(cli.stdout.includes("Already up-to-date!"));
  });

  t.test("exiting project - update", async (t) => {
    const cwd = workingDirectory("existing-project-update");

    const cli = new TestCompas(
      {
        cwd,
      },
      {
        args: ["init"],
      },
    )
      .withPackageJson(
        JSON.stringify({
          dependencies: {
            compas: "*",
          },
        }),
      )
      .launch();

    await cli.waitForExit();

    // Package.json
    t.deepEqual(
      JSON.parse(await readFile(pathJoin(cwd, "package.json"), "utf-8")),
      {
        dependencies: {
          compas: JSON.parse(
            await readFile(
              pathJoin(dirnameForModule(import.meta), "../../package.json"),
              "utf-8",
            ),
          ).version,
        },
      },
    );

    // Package manager
    t.ok(cli.stdout.includes("Patching package.json"));
    t.ok(cli.stdout.includes("_compas_skip_package_manager_install"));

    // Output
    t.ok(cli.stdout.includes("Ready to roll!"));
  });
});
