import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  AppError,
  dirnameForModule,
  environment,
  isNil,
  isProduction,
  loggerDetermineDefaultDestination,
  pathJoin,
  refreshEnvironmentCache,
} from "@compas/stdlib";
import dotenv from "dotenv";
import { validateCompasConfig } from "../generated/compas/validators.js";
import { writeFileChecked } from "./fs.js";
import { debugPrint, debugTimeEnd, debugTimeStart } from "./output.js";

/**
 * @typedef {{
 *   isCI: boolean,
 *   isDevelopment: boolean,
 *   appName: string,
 *   compasVersion: string,
 *   nodeVersion: string,
 *   hostEnv: Record<string, string|undefined>,
 * }} ConfigEnvironment
 */

/**
 * Load .env files, resolve the Compas version and information to determine in which mode
 * we're booting.
 *
 * @param {boolean} preferPrettyPrint
 * @returns {Promise<ConfigEnvironment>}
 */
export async function configLoadEnvironment(preferPrettyPrint) {
  debugTimeStart("config.environment");

  const hostEnv = { ...process.env };

  const defaultDotEnvFile = ".env";

  if (isNil(process.env.NODE_ENV) && !existsSync(defaultDotEnvFile)) {
    // Write a default .env file, we only do this if a NODE_ENV is not explicitly set.

    debugPrint("No .env file found, writing .env file.");

    const dirname = process.cwd().split(path.sep).pop();
    await writeFileChecked(
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

  if (preferPrettyPrint && environment.NODE_ENV !== "development") {
    environment.COMPAS_LOG_PRINTER = "pretty";
  }

  loggerDetermineDefaultDestination();

  const packageJson = JSON.parse(
    await readFile(
      pathJoin(dirnameForModule(import.meta), "../../package.json"),
      "utf-8",
    ),
  );

  const env = {
    isCI: environment.CI === "true",
    isDevelopment: !isProduction(),
    appName: environment.APP_NAME ?? process.cwd().split(path.sep).pop(),
    compasVersion: packageJson.version
      ? `Compas v${packageJson.version}`
      : "Compas v0.0.0",
    nodeVersion: process.version,
    hostEnv,
  };

  debugPrint(env);

  debugTimeEnd("config.environment");

  return env;
}

/**
 * Resolve the full project config.
 *
 * @returns {Promise<import("../generated/common/types.d.ts").CompasResolvedConfig>}
 */
export async function configResolveProjectConfig() {
  debugTimeStart("config.resolveProjectConfig");

  const loadedPaths = [];

  async function loadRelativeConfig(relativeDirectory) {
    debugPrint(`Resolving config in '${relativeDirectory}'.`);

    const configPath = path.resolve(
      pathJoin(relativeDirectory, "config/compas.json"),
    );

    // Prevent recursion when two projects reference each other.
    if (loadedPaths.includes(configPath)) {
      return;
    }
    loadedPaths.push(configPath);

    let rawConfig = {};
    if (existsSync(configPath)) {
      try {
        rawConfig = JSON.parse(await readFile(configPath, "utf-8"));
      } catch (e) {
        debugPrint({
          message: "parseError",
          relativeDirectory,
          error: AppError.format(e),
        });

        // @ts-expect-error
        throw AppError.validationError("config.resolve.parseError", {}, e);
      }
    } else {
      debugPrint("No config file found.");
    }

    const { error, value } = validateCompasConfig(rawConfig);

    if (error) {
      debugPrint({
        message: "validationError",
        relativeDirectory,
        error,
      });

      throw AppError.validationError("config.resolve.validationError", {
        relativeDirectory,
        error,
      });
    }

    const projects = [];

    for (const subProject of value.projects ?? []) {
      const config = await loadRelativeConfig(
        pathJoin(relativeDirectory, subProject),
      );

      if (!isNil(config)) {
        projects.push(config);
      }
    }

    // @ts-expect-error
    value.projects = projects;
    // @ts-expect-error
    value.rootDirectory = path.resolve(relativeDirectory);

    return value;
  }

  const config = await loadRelativeConfig(process.cwd());

  debugTimeEnd("config.resolveProjectConfig");
  debugPrint(config);

  // @ts-expect-error
  return config;
}

/**
 * Flatten the provided config.
 *
 * @param {import("../generated/common/types.d.ts").CompasResolvedConfig|undefined} config
 * @returns {import("../generated/common/types.d.ts").CompasResolvedConfig[]}
 */
export function configFlatten(config) {
  const result = [];

  if (!config) {
    return result;
  }

  function handleConfig(conf) {
    result.push(conf);

    for (const p of conf.projects) {
      result.push(p);
    }
  }

  handleConfig(config);

  return result;
}
