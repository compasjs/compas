import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { cp, rm } from "node:fs/promises";
import { AppError, exec, pathJoin, spawn } from "@compas/stdlib";

/**
 * @type {import("@compas/cli").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "citgm",
  shortDescription:
    "Poor man's canary in the goldmine. Manually check local projects using the latest 'main' or this local Compas checkout.",
  modifiers: {
    isWatchable: false,
    isCosmetic: true,
  },
  subCommands: [
    {
      name: "run",
      flags: [
        {
          name: "version",
          rawName: "--version",
          description: "Use 'local' or 'github'.",
          modifiers: {
            isRepeatable: false,
            isInternal: false,
            isRequired: true,
          },
          value: {
            specification: "string",
            completions: () => ({
              completions: [
                {
                  type: "completion",
                  name: "local",
                },
                {
                  type: "completion",
                  name: "github",
                },
              ],
            }),
            validator: (value) => {
              if (["local", "github"].includes(value)) {
                return {
                  isValid: true,
                };
              }
              return {
                isValid: false,
                message: `Found '${value}', expected 'local' or 'github'.`,
              };
            },
          },
        },
      ],
      shortDescription: "Run CITGM on the target directory.",
    },
    {
      name: "clean",
      shortDescription: "Cleanup the CITGM, checking out the main branch",
    },
  ],
  flags: [
    {
      name: "targetDirectory",
      rawName: "--target-directory",
      description: "The local project directory",
      modifiers: {
        isRepeatable: false,
        isInternal: false,
        isRequired: true,
      },
      value: {
        specification: "string",
        completions: () => ({
          completions: [
            {
              type: "directory",
            },
          ],
        }),
        validator: (value) => {
          if (existsSync(value) && statSync(value).isDirectory()) {
            return {
              isValid: true,
            };
          }
          return {
            isValid: false,
            message: "Requires a valid local directory.",
          };
        },
      },
    },
  ],
  executor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("@compas/cli").CliExecutorState} state
 * @returns {Promise<import("@compas/cli").CliResult>}
 */
async function executor(logger, state) {
  const { targetDirectory, version } = state.flags;
  const packageManager = existsSync(pathJoin(targetDirectory, "yarn.lock"))
    ? "yarn"
    : "npm";
  const currentBranch = await gitGetCurrentBranch(targetDirectory);
  const targetBranch = "compas/citgm";

  logger.info("Fetching remotes...");
  await gitFetchPrune(targetDirectory);

  if (state.command.includes("run")) {
    if (currentBranch !== targetBranch) {
      logger.info("Checking out branch...");
      await gitCheckoutBranch(targetDirectory, targetBranch);
    }

    if (version === "github") {
      logger.info("Updating package.json");
      const pkgJsonPath = pathJoin(targetDirectory, "package.json");
      const packageJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));

      for (const key of [
        "dependencies",
        "devDependencies",
        "peerDependencies",
      ]) {
        for (const dep of Object.keys(packageJson[key] ?? {})) {
          if (dep.includes("compas")) {
            packageJson[key][
              dep
            ] = `https://gitpkg.now.sh/compasjs/compas/packages/${dep
              .split("/")
              .pop()}?main`;
          }
        }
      }

      writeFileSync(pkgJsonPath, JSON.stringify(packageJson, null, 2));

      logger.info("Installing from remote...");
      await runPackageManager(targetDirectory, packageManager);

      // The online versions depend on the latest released Compas version, which results
      // in package local node_modules of other Compas packages. Remove these, so they
      // import the project installed versions (ie our latest version on GitHub).
      await Promise.all(
        ["cli", "code-gen", "eslint-plugin", "server", "stdlib", "store"].map(
          (it) =>
            rm(
              pathJoin(
                targetDirectory,
                "node_modules",
                "@compas",
                it,
                "node_modules",
              ),
              {
                force: true,
                recursive: true,
              },
            ),
        ),
      );
    } else {
      logger.info("Installing dependencies...");
      await runPackageManager(targetDirectory, packageManager);

      logger.info("Overwriting with local...");
      await cp(
        pathJoin(process.cwd(), "packages"),
        pathJoin(targetDirectory, "node_modules", "@compas"),
      );
    }
  } else {
    await exec(`git reset --hard origin/main`, { cwd: targetDirectory });
    await gitCheckoutBranch(targetDirectory, "main");

    logger.info("Installing dependencies...");
    await runPackageManager(targetDirectory, packageManager);
  }
}

/**
 * Check if target directory is a Git directory and return the current branch.
 *
 * @param {string} targetDirectory
 * @returns {Promise<string>}
 */
async function gitGetCurrentBranch(targetDirectory) {
  const { stdout, exitCode } = await exec(`git branch --show-current`, {
    cwd: targetDirectory,
  });

  if (exitCode === 0) {
    return stdout.trim();
  }

  throw AppError.serverError({
    message: `'${targetDirectory}' is not a Git repository, aborting...`,
  });
}

/**
 * Fetch latest remotes.
 *
 * @param {string} targetDirectory
 * @returns {Promise<void>}
 */
async function gitFetchPrune(targetDirectory) {
  const { exitCode } = await exec(`git fetch --prune`, {
    cwd: targetDirectory,
  });

  if (exitCode === 0) {
    return;
  }

  throw AppError.serverError({
    message: `'${targetDirectory}' could not run 'git fetch --prune'...`,
  });
}

/**
 * Checkout new branch
 *
 * @param {string} targetDirectory
 * @param {string} targetBranch
 * @returns {Promise<void>}
 */
async function gitCheckoutBranch(targetDirectory, targetBranch) {
  const { exitCode } = await exec(
    `git checkout -B ${targetBranch} origin/main`,
    {
      cwd: targetDirectory,
    },
  );

  if (exitCode === 0) {
    return;
  }

  throw AppError.serverError({
    message: `'${targetDirectory}' could not checkout '${targetBranch}'.`,
  });
}

/**
 * Run the projects package manager
 *
 * @param {string} targetDirectory
 * @param {"yarn"|"npm"} packageManager
 * @returns {Promise<void>}
 */
async function runPackageManager(targetDirectory, packageManager) {
  if (packageManager === "yarn") {
    await spawn(`yarn`, [], {
      cwd: targetDirectory,
    });
  } else if (packageManager === "npm") {
    await spawn(`npm`, ["i"], {
      cwd: targetDirectory,
    });
  }
}
