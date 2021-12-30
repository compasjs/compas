import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirnameForModule, mainFn, pathJoin, spawn } from "@compas/stdlib";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  disable: true,
};

/**
 * Copy various things around README's and docs
 *
 * @param {Logger} logger
 */
async function main(logger) {
  if (pathJoin(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

  syncReadmes(logger);
  syncDocs(logger);

  logger.info("Running linter");
  await spawn("yarn", ["compas", "lint"]);
  logger.info("Done");
}

/**
 * Sync repo files to docs root
 *
 * @param {Logger} logger
 */
function syncDocs(logger) {
  const rootDir = process.cwd();
  const docsDir = pathJoin(rootDir, "docs");

  const files = ["changelog.md", "contributing.md"];

  for (const file of files) {
    const path = pathJoin(rootDir, file);

    if (!existsSync(path)) {
      logger.error(`Could not find '${file}' at '${path}'.`);
      process.exit(1);
    }

    writeFileSync(pathJoin(docsDir, file), readFileSync(path));
  }
}

/**
 * Sync root and package readme's
 *
 * @param {Logger} logger
 */
function syncReadmes(logger) {
  const packagesDir = pathJoin(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);
  const readmeSource = getReadmeSource();

  logger.info(`Updating ${packages.length} README.md's`);

  for (const pkg of packages) {
    const pkgDir = pathJoin(packagesDir, pkg);

    writeFileSync(
      pathJoin(pkgDir, "README.md"),
      buildReadmeSource(pkg, readmeSource),
      "utf-8",
    );
  }
}

/**
 * @param {string} pkgName
 * @param {string} readmeSource
 */
function buildReadmeSource(pkgName, readmeSource) {
  return `# @compas/${pkgName}\n[![install size ${pkgName}](https://packagephobia.com/badge?p=@compas/${pkgName})](https://packagephobia.com/result?p=@compas/${pkgName})${readmeSource}\n`;
}

function getReadmeSource() {
  const src = readFileSync(pathJoin(process.cwd(), "README.md"), "utf-8");

  return src.split("\n").slice(1).join("\n");
}
