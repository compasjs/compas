import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { AppError, isNil, pathJoin } from "@compas/stdlib";
import { validateCompasConfig } from "../generated/compas/validators.js";
import { debugPrint } from "../output/debug.js";
import { logger } from "../output/log.js";
import { tuiPrintInformation } from "../output/tui.js";

/**
 * Try to load the config recursively from disk.
 *
 * Returns undefined when the config couldn't be loaded, for soft errors like no config
 * present, it returns a default empty config.
 *
 * @param {string} projectDirectory
 * @param {boolean} isRootProject
 * @returns {Promise<import("../generated/common/types").CompasResolvedConfig|undefined>}
 */
export async function configResolve(projectDirectory, isRootProject) {
  const expectedFileLocation = pathJoin(projectDirectory, "config/compas.json");

  if (isRootProject) {
    debugPrint("Resolving config...");
  }

  if (!existsSync(expectedFileLocation)) {
    if (isRootProject) {
      debugPrint(
        "Did not find a config in the project root. Creating empty config",
      );

      await mkdir(pathJoin(projectDirectory, "config"), { recursive: true });
      await writeFile(expectedFileLocation, JSON.stringify({}, null, 2));

      return await configResolve(projectDirectory, isRootProject);
    }

    debugPrint(`Could not find config at ${expectedFileLocation}.`);
    logger.error(`Could not find config at ${expectedFileLocation}.`);
    tuiPrintInformation(`Could not find config at ${expectedFileLocation}.`);

    return {
      rootDirectory: projectDirectory,

      projects: [],
    };
  }

  const rawConfigContents = await readFile(expectedFileLocation, "utf-8");

  let parsedConfigContents = undefined;
  try {
    parsedConfigContents = JSON.parse(rawConfigContents);
  } catch (e) {
    debugPrint(
      `Parsing error in config at ${expectedFileLocation}: ${JSON.stringify(
        AppError.format(e),
      )}.`,
    );
    logger.error({
      message: "Unknown error while parsing config",
      expectedFileLocation,
      error: AppError.format(e),
    });
    tuiPrintInformation(
      `Could not parse the config in ${expectedFileLocation}.`,
    );

    return undefined;
  }

  const { error, value } = validateCompasConfig(parsedConfigContents);

  if (error) {
    debugPrint(
      `Validation error while resolving config at ${expectedFileLocation}.`,
    );
    debugPrint(error);

    for (const key of Object.keys(error)) {
      const value = error[key];
      if (key === "$") {
        if (value.key === "validator.object") {
          logger.error({
            message:
              "Expected that the config file contains at least a JSON object.",
            configFile: expectedFileLocation,
          });
          tuiPrintInformation(
            `Config file at ${expectedFileLocation} does not contain a top level object.`,
          );
        } else if (value.key === "validator.keys") {
          logger.error({
            message: "The config may only specify known keys",
            configFile: expectedFileLocation,
            unknownKeys: value.unknownKeys,
          });
          tuiPrintInformation(
            `Config file at ${expectedFileLocation} contains unknown keys which is not allowed: ${value.unknownKeys.join(
              ", ",
            )}`,
          );
        } else {
          logger.error({
            message: "Unknown error while loading config",
            configFile: expectedFileLocation,
            error,
          });
          tuiPrintInformation(
            `Config file at ${expectedFileLocation} contains an unknown error. Run 'zakmes verify' to retrieve the raw error.`,
          );
        }
      } else if (key === "$.projects") {
        logger.error({
          message: "Unknown error while loading config",
          configFile: expectedFileLocation,
          error,
        });
        tuiPrintInformation(
          `Config file at ${expectedFileLocation} contains an invalid projects array. Run 'zakmes verify' to retrieve the raw error.`,
        );
      } else {
        logger.error({
          message: "Unknown error while loading config",
          configFile: expectedFileLocation,
          error,
        });
        tuiPrintInformation(
          `Config file at ${expectedFileLocation} contains an unknown error. Run 'zakmes verify' to retrieve the raw error.`,
        );
      }
    }

    return undefined;
  }

  const projects = value.projects
    ? await Promise.all(
        value.projects.map((it) =>
          configResolve(pathJoin(projectDirectory, it), false),
        ),
      )
    : [];

  if (projects.some((it) => isNil(it))) {
    // Can't resolve if a sub config returns undefined. The user is already notified.
    return undefined;
  }

  /** @type {import("../generated/common/types").CompasResolvedConfig} */
  const resolvedConfig = {
    ...value,

    rootDirectory: projectDirectory,

    // @ts-expect-error
    projects,
  };

  if (isRootProject) {
    debugPrint("Successfully resolved a config");
    debugPrint(resolvedConfig);
  }

  return resolvedConfig;
}
