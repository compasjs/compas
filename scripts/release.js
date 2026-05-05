import { readFile, writeFile } from "node:fs/promises";
import { AppError, exec, pathJoin, spawn } from "@compas/stdlib";

/** @type {import("@compas/cli").CliCommandDefinitionInput} */
export const cliDefinition = {
  name: "release",
  shortDescription: "Release a new Compas version",
  flags: [
    {
      name: "version",
      rawName: "--version",
      description: "New version number like v1.3.4",
      modifiers: {
        isRequired: true,
      },
      value: {
        specification: "string",
      },
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("@compas/cli").CliExecutorState} state
 * @returns {Promise<import("@compas/cli").CliResult>}
 */
async function cliExecutor(logger, state) {
  const packages = ["stdlib", "cli", "code-gen", "server", "store"];

  checkVersionFormat(state.flags.version);
  await checkCleanWorkingDirectory();

  for (const pkg of packages) {
    await bumpPackageJson(pkg, state.flags.version.substring(1));
  }

  const { exitCode } = await spawn("npx", ["compas", "run", "types"]);
  if (exitCode !== 0) {
    throw new Error();
  }

  await spawn("npm", ["i"]);
  await spawn("git", ["commit", "-m", `${state.flags.version}`]);
  await spawn("git", [
    "tag",
    "-a",
    state.flags.version,
    "-m",
    `chore: release ${state.flags.version}`,
  ]);
  await spawn("git", ["push"]);
  await spawn("git", ["push", "origin", state.flags.version]);

  logger.info(
    `Pushed ${state.flags.version}. The publish workflow will build and publish all packages to npm.`,
  );

  return {
    exitStatus: "passed",
  };
}

async function bumpPackageJson(pkg, version) {
  const path = pathJoin(process.cwd(), "packages/", pkg, "package.json");
  const contents = JSON.parse(await readFile(path, "utf-8"));
  contents.version = version;

  for (const dep of Object.keys(contents.dependencies)) {
    if (dep.startsWith("@compas/")) {
      contents.dependencies[dep] = version;
    }
  }

  await writeFile(path, `${JSON.stringify(contents, null, 2)}\n`);
  await spawn("git", ["add", path]);
}

async function checkCleanWorkingDirectory() {
  const { exitCode } = await exec("git diff --exit-code");
  const { exitCode: exitCode2 } = await exec("git diff --cached --exit-code");

  if (exitCode !== 0 || exitCode2 !== 0) {
    throw AppError.serverError({
      message:
        "Working directory is not clean. Make sure to commit all your changes.",
    });
  }
}

/**
 * @param {string} version
 * @returns {void}
 */
function checkVersionFormat(version) {
  if (!/^v\d+\.\d+\.\d+$/gi.test(version)) {
    throw AppError.serverError({
      message: "Invalid version format",
      version,
    });
  }
}
