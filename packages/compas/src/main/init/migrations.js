import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { isNil } from "@compas/stdlib";
import { configResolveProjectConfig } from "../../shared/config.js";
import { writeFileChecked } from "../../shared/fs.js";
import { logger } from "../../shared/output.js";

/**
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function initMigrations(env) {
  if (env.isCI) {
    logger.info({
      message: "'compas init migrations' is not supported in CI.",
    });
    return;
  }

  const config = await configResolveProjectConfig();

  if (!isNil(config.migrations)) {
    logger.info(
      "The project already includes 'migrations' in the config. Create a sql file in the migrations directory to get started.",
    );

    return;
  }

  if (existsSync("./config/compas.json")) {
    const contents = JSON.parse(
      await readFile("./config/compas.json", "utf-8"),
    );
    contents.migrations = {};

    await writeFileChecked(
      "./config/compas.json",
      `${JSON.stringify(contents, null, 2)}\n`,
    );
  } else {
    await writeFileChecked(
      "./config/compas.json",
      `${JSON.stringify(
        {
          migrations: {},
        },
        null,
        2,
      )}\n`,
    );
  }

  if (!existsSync("./migrations")) {
    await writeFileChecked("./migrations/.gitkeep", "");
  }

  const packageJson = JSON.parse(await readFile("./package.json", "utf-8"));

  if (
    isNil(packageJson.dependencies?.["@compas/store"]) &&
    isNil(packageJson.devDependencies?.["@compas/store"])
  ) {
    packageJson.dependencies ??= {};
    packageJson.dependencies["@compas/store"] = env.compasVersion
      .split("v")
      .pop();

    await writeFileChecked(
      "package.json",
      `${JSON.stringify(packageJson, null, 2)}\n`,
    );
  }

  logger.info(
    "Updated the config. Compas will notify you from now on when a migrations are available to run.",
  );
}
