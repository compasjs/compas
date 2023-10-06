import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { exec, isNil } from "@compas/stdlib";
import { configResolveProjectConfig } from "../../shared/config.js";
import { writeFileChecked } from "../../shared/fs.js";
import { logger } from "../../shared/output.js";
import { packageManagerDetermine } from "../../shared/package-manager.js";

/**
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function initLint(env) {
  if (env.isCI) {
    logger.info({
      message: "'compas init lint' is not supported in CI.",
    });
    return;
  }

  const packageJson = JSON.parse(await readFile("./package.json", "utf-8"));

  if (
    isNil(packageJson.dependencies?.["eslint"]) &&
    isNil(packageJson.devDependencies?.["eslint"]) &&
    isNil(packageJson.dependencies?.["prettier"]) &&
    isNil(packageJson.devDependencies?.["prettier"])
  ) {
    packageJson.devDependencies ??= {};
    packageJson.devDependencies["@compas/eslint-plugin"] = env.compasVersion
      .split("v")
      .pop();

    await writeFileChecked(
      "package.json",
      `${JSON.stringify(packageJson, null, 2)}\n`,
    );

    const packageManager = packageManagerDetermine("");
    logger.info("Wrote to the package.json. Installing dependencies...");
    await exec(packageManager.installCommand);

    logger.info(
      "Installed '@compas/eslint-plugin'. Compas will automatically supply default config files to ESLint and Prettier. You can customize these by manually creating config files in the project root directories.",
    );
  } else {
    logger.info(
      "Detected that Prettier or ESLint is already installed in this project. Compas will automatically try to prompt you to run them when necessary.",
    );
  }
}
