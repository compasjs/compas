import { existsSync } from "node:fs";
import { pathJoin } from "@compas/stdlib";
import { debugPrint } from "./output.js";

/**
 * Determine package manager command to use for installing dependencies.
 *
 * @returns {string[]}
 */
export function packageManagerDetermineInstallCommand(rootDirectory = "") {
  if (existsSync(pathJoin(rootDirectory, "package-lock.json"))) {
    return ["npm", "install"];
  } else if (existsSync(pathJoin(rootDirectory, "yarn.lock"))) {
    return ["yarn"];
  } else if (existsSync(pathJoin(rootDirectory, "pnpm-lock.yaml"))) {
    return ["pnpm", "install"];
  }

  debugPrint(`Defaulting install command to npm for '${rootDirectory}'.`);

  return ["npm", "install"];
}
