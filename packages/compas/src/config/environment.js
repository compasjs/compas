import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  dirnameForModule,
  environment,
  isProduction,
  pathJoin,
  refreshEnvironmentCache,
} from "@compas/stdlib";
import dotenv from "dotenv";
import { debugTimeEnd, debugTimeStart } from "../output/debug.js";
import { output } from "../output/static.js";

/**
 * Load .env files, resolve Compas version and information to determine in which mode we
 * are booting.
 *
 * @param {string} relativeDirectory
 * @param {boolean} hasNodeEnvSet
 * @returns {Promise<{
 *   isCI: boolean,
 *   isDevelopment: boolean,
 *   appName: string,
 *   compasVersion: string,
 *   nodeVersion: string,
 * }>}
 */
export async function configLoadEnvironment(relativeDirectory, hasNodeEnvSet) {
  debugTimeStart("config.environment");

  const defaultDotEnvFile = pathJoin(relativeDirectory, ".env");

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
      pathJoin(dirnameForModule(import.meta), "../../package.json"),
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

  // Doesn't log anything here, the caller should do that after enabling the appropriate
  // systems.
  debugTimeEnd("config.environment");

  return env;
}