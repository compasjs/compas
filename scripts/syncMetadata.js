import { spawnSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirnameForModule, mainFn, pathJoin } from "@compas/stdlib";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: [/\w+[/\\]README.md$/gi],
  extensions: ["md"],
};

function main(logger) {
  // Script to copy the root README.md to all packages

  if (pathJoin(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

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

  logger.info("Running linter");
  spawnSync("yarn", ["compas", "lint"], { stdio: "inherit" });
  logger.info("Done");
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
