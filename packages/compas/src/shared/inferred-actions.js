import { readFile } from "node:fs/promises";
import { pathJoin } from "@compas/stdlib";

/**
 * Try to infer the lint command for a specific directory
 *
 * @param {string} rootDirectory
 * @returns {Promise<string[]|undefined>}
 */
export async function inferActionLint(rootDirectory = "") {
  const usesCompas = await inferUsesLegacyCompasCli(rootDirectory);

  if (usesCompas) {
    // TODO: use package manager
    return ["npx", "compas", "lint"];
  }

  const packageJsonFile = pathJoin(rootDirectory, "package.json");

  if (!packageJsonFile) {
    return undefined;
  }

  const file = JSON.parse(await readFile(packageJsonFile, "utf-8"));
  const command = file.scripts?.format ?? file.scripts?.lint;

  if (!command) {
    return undefined;
  }

  return command.split(" ");
}

/**
 * Check if the project uses the legacy Compas CLI provided by @compas/cli.
 *
 * This is done based on the following rules:
 *
 * - @compas/cli is installed in the project
 * - No lint or format script in the package.json
 *
 * @param {string} rootDirectory
 * @returns {Promise<boolean>}
 */
export async function inferUsesLegacyCompasCli(rootDirectory = "") {
  const packageJsonFile = pathJoin(rootDirectory, "package.json");

  if (!packageJsonFile) {
    return false;
  }

  const file = JSON.parse(await readFile(packageJsonFile, "utf-8"));

  if (
    !file.dependencies["@compas/cli"] &&
    !file.devDependencies["@compas/cli"]
  ) {
    return false;
  }

  return !file.scripts["lint"] && !file.scripts["format"];
}
