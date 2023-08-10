import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  dirnameForModule,
  environment,
  isNil,
  isProduction,
  loggerDetermineDefaultDestination,
  pathJoin,
  refreshEnvironmentCache,
} from "@compas/stdlib";
import dotenv from "dotenv";
import { validateCompasConfig } from "./generated/compas/validators.js";
import { debugTimeEnd, debugTimeStart } from "./output/debug.js";
import { output } from "./output/static.js";

/**
 * Load .env files, resolve the Compas version and information to determine in which mode we're booting.
 *
 * @param {string} projectDirectory
 * @param {boolean} hasNodeEnvSet
 * @returns {Promise<{
 *   isCI: boolean,
 *   isDevelopment: boolean,
 *   appName: string,
 *   compasVersion: string,
 *   nodeVersion: string,
 * }>}
 */
export async function configLoadEnvironment(projectDirectory, hasNodeEnvSet) {
  debugTimeStart("config.environment");

  const defaultDotEnvFile = pathJoin(projectDirectory, ".env");

  if (!hasNodeEnvSet && !existsSync(defaultDotEnvFile)) {
    // Write a default .env file, we only do this if a NODE_ENV is not explicitly set.

    output.config.environment.creating();

    const dirname = process.cwd().split(path.sep).pop();
    await writeFile(
      defaultDotEnvFile,
      `NODE_ENV=development
APP_NAME=${dirname}
`,
    );
  }

  // Load .env.local first, since existing values in `process.env` are not overwritten.
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config();

  refreshEnvironmentCache();

  const packageJson = JSON.parse(
    await readFile(
      pathJoin(dirnameForModule(import.meta), "../package.json"),
      "utf-8",
    ),
  );

  const env = {
    isCI: environment.CI === "true",
    isDevelopment: !isProduction(),
    appName: environment.APP_NAME ?? process.cwd().split(path.sep).pop(),
    compasVersion: packageJson.version
      ? `Compas ${packageJson.version}`
      : "Compas v0.0.0",
    nodeVersion: process.version,
  };

  loggerDetermineDefaultDestination();

  // Doesn't log anything here, the caller should do that after enabling the appropriate
  // systems.
  debugTimeEnd("config.environment");

  return env;
}

/**
 * Try to load the config recursively from disk.
 *
 * Returns undefined when the config couldn't be loaded, for soft errors like no config
 * present, it returns a default empty config.
 *
 * @param {string} projectDirectory
 * @param {boolean} isRootProject
 * @returns {Promise<import("./generated/common/types.d.ts").CompasResolvedConfig|undefined>}
 */
export async function configResolve(projectDirectory, isRootProject) {
  const expectedFileLocation = pathJoin(projectDirectory, "config/compas.json");

  if (isRootProject) {
    debugTimeStart("config.resolve");
    output.config.resolve.starting();
  }

  if (!existsSync(expectedFileLocation)) {
    if (isRootProject) {
      output.config.resolve.creating();

      await mkdir(pathJoin(projectDirectory, "config"), { recursive: true });
      await writeFile(expectedFileLocation, JSON.stringify({}, null, 2));

      return await configResolve(projectDirectory, isRootProject);
    }

    output.config.resolve.notFound(expectedFileLocation);

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
    output.config.resolve.parseError(e, expectedFileLocation);

    return undefined;
  }

  const { error, value } = validateCompasConfig(parsedConfigContents);

  if (error) {
    output.config.resolve.validationError(error, expectedFileLocation);

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

  /** @type {import("./generated/common/types.d.ts").CompasResolvedConfig} */
  const resolvedConfig = {
    ...value,

    rootDirectory: projectDirectory,

    // @ts-expect-error
    projects,
  };

  if (isRootProject) {
    debugTimeEnd("config.resolve");
    output.config.resolve.resolved(resolvedConfig);
  }

  return resolvedConfig;
}
