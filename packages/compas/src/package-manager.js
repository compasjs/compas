import { existsSync } from "node:fs";

/**
 * Determine package manager command to use for installing dependencies.
 *
 * @returns {string[]}
 */
export function packageManagerDetermineInstallCommand() {
  if (existsSync("package-lock.json")) {
    return ["npm", "install"];
  } else if (existsSync("yarn.lock")) {
    return ["yarn"];
  } else if (existsSync("pnpm-lock.yaml")) {
    return ["pnpm", "install"];
  }

  // Default to NPM
  return ["npm", "install"];
}
