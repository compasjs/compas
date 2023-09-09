import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { pathJoin } from "@compas/stdlib";
import { packageManagerDetermine } from "./package-manager.js";

/**
 * Infer the lint command
 *
 * @param {string} rootDirectory
 * @returns {Promise<string[]|undefined>}
 */
export async function inferLintCommand(rootDirectory = "") {
  const usesCompas = await inferUsesLegacyCompasCli(rootDirectory);
  const packageManager = packageManagerDetermine(rootDirectory);

  if (usesCompas) {
    return [
      ...packageManager.nodeModulesBinCommand.split(" "),
      "compas",
      "lint",
    ];
  }

  const packageJson = pathJoin(rootDirectory, "package.json");

  if (!existsSync(packageJson)) {
    return undefined;
  }

  const contents = JSON.parse(await readFile(packageJson, "utf-8"));
  const command = contents.scripts?.format ?? contents.scripts?.lint;

  if (!command) {
    return undefined;
  }

  return [
    ...packageManager.nodeModulesBinCommand.split(" "),
    ...command.split(" "),
  ];
}

/**
 * Infer the 'dev' command
 *
 * @param {string} rootDirectory
 * @returns {Promise<string[]|undefined>}
 */
export async function inferDevCommand(rootDirectory = "") {
  const usesCompas = await inferUsesLegacyCompasCli(rootDirectory);
  const packageManager = packageManagerDetermine(rootDirectory);

  if (usesCompas) {
    return undefined;
  }

  const packageJson = pathJoin(rootDirectory, "package.json");

  if (!existsSync(packageJson)) {
    return undefined;
  }

  const contents = JSON.parse(await readFile(packageJson, "utf-8"));
  const command = contents.scripts?.dev;

  if (!command) {
    return undefined;
  }

  return [
    ...packageManager.nodeModulesBinCommand.split(" "),
    ...command.split(" "),
  ];
}

/**
 * Infer the 'test' command
 *
 * @param {string} rootDirectory
 * @returns {Promise<string[]|undefined>}
 */
export async function inferTestCommand(rootDirectory = "") {
  const usesCompas = await inferUsesLegacyCompasCli(rootDirectory);
  const packageManager = packageManagerDetermine(rootDirectory);

  if (usesCompas) {
    return [
      ...packageManager.nodeModulesBinCommand.split(" "),
      "compas",
      "test",
    ];
  }

  const packageJson = pathJoin(rootDirectory, "package.json");

  if (!existsSync(packageJson)) {
    return undefined;
  }

  const contents = JSON.parse(await readFile(packageJson, "utf-8"));
  const command = contents.scripts?.test;

  if (!command) {
    return undefined;
  }

  return [
    ...packageManager.nodeModulesBinCommand.split(" "),
    ...command.split(" "),
  ];
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

  if (!existsSync(pathJoin(rootDirectory, "node_modules/.bin/compas"))) {
    return false;
  }

  const file = JSON.parse(await readFile(packageJsonFile, "utf-8"));

  return !file.scripts?.["lint"] && !file.scripts?.["format"];
}
