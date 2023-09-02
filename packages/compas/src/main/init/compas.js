import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { exec, spawn } from "@compas/stdlib";
import { writeFileChecked } from "../../shared/fs.js";
import { logger } from "../../shared/output.js";
import { packageManagerDetermine } from "../../shared/package-manager.js";

/**
 *
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function initCompas(env) {
  if (env.isCI) {
    logger.info({
      message: "'compas init' is not supported in CI.",
    });
    return;
  }

  if (existsSync("package.json")) {
    await initCompasInExistingProject(env);
  } else {
    await initCompasInNewProject(env);
  }
}

/**
 *
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
async function initCompasInExistingProject(env) {
  const packageJson = JSON.parse(await readFile("package.json", "utf-8"));

  let alreadyInstalled = false;
  const compasVersion = env.compasVersion.split("v").pop();

  if (packageJson.dependencies?.compas) {
    alreadyInstalled = packageJson.dependencies.compas === compasVersion;
    packageJson.dependencies.compas = compasVersion;
  } else if (packageJson.devDependencies?.compas) {
    alreadyInstalled = packageJson.devDependencies.compas === compasVersion;
    packageJson.devDependencies.compas = compasVersion;
  } else {
    packageJson.dependencies ??= {};
    packageJson.dependencies.compas = compasVersion;
  }

  if (!alreadyInstalled) {
    logger.info(
      `Patching package.json with ${env.compasVersion} and installing dependencies...`,
    );
    await writeFileChecked(
      "package.json",
      `${JSON.stringify(packageJson, null, 2)}\n`,
    );

    const packageManager = packageManagerDetermine();

    const command = packageManager.installCommand.split(" ");
    await spawn(command[0], command.slice(1));

    logger.info(`
Ready to roll! Run '${packageManager.nodeModulesBinCommand} compas' to start the Compas development environment.

Tip: See https://compasjs.com/docs/getting-started.html#development-setup on how to run 'compas' without the '${packageManager.nodeModulesBinCommand}' prefix.
`);
  } else {
    logger.info("Already up-to-date!");
  }
}

/**
 *
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
async function initCompasInNewProject(env) {
  const compasVersion = env.compasVersion.split("v").pop();
  const packageJson = {
    name: env.appName,
    private: true,
    version: "0.0.1",
    type: "module",
    scripts: {},
    keywords: [],
    dependencies: {
      compas: compasVersion,
    },
  };

  await writeFileChecked(
    "package.json",
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );

  logger.info("Created a package.json. Installing with npm...");

  const packageManager = packageManagerDetermine();
  const command = packageManager.installCommand.split(" ");

  await spawn(command[0], command.slice(1));

  if (!existsSync(".gitignore")) {
    await writeFileChecked(
      ".gitignore",
      `# Compas
.cache
.env.local
generated

# OS
.DS_Store

# IDE
.idea
.vscode

# Dependencies
node_modules

# Log files
*-debug.log
*-error.log

# Tests
coverage
`,
    );
  }

  if ((await exec("git --version")).exitCode === 0 && !existsSync(".git")) {
    logger.info("Initializing a Git repository.");

    await exec("git init");
    await exec("git checkout -b main");
    await exec("git add -A");
    await exec(`git commit -m "Initialized project with ${env.compasVersion}"`);
  }

  logger.info(`
Ready to roll! Run 'npx compas' to start the Compas development environment.

You can switch to a different supported package manager like yarn v1 or pnpm by removing the created package-lock.json and running the equivalent of 'npm install' with your favorite package manager.

Tip: See https://compasjs.com/docs/getting-started.html#development-setup on how to run 'compas' without the 'npx' prefix.
`);
}
