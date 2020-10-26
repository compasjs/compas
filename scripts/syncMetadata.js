import { spawnSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { dirnameForModule, mainFn } from "@lbu/stdlib";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: [/\w+[/\\]README.md$/gi],
  extensions: ["md"],
};

function main(logger) {
  // Script to copy the root README.md to all packages

  if (join(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

  const packagesDir = join(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);
  const readmeSource = getReadmeSource();

  logger.info(`Updating ${packages.length} README.md's`);

  for (const pkg of packages) {
    const pkgDir = join(packagesDir, pkg);

    writeFileSync(
      join(pkgDir, "README.md"),
      buildReadmeSource(pkg, readmeSource),
      "utf-8",
    );
  }

  writeFileSync(
    "./docs/README.md",
    `# @lbu (Lightbase Backend Utilities)\n${readmeSource}`,
    "utf-8",
  );

  logger.info("Running linter");
  spawnSync("yarn", ["lbu", "lint"], { stdio: "inherit" });
  logger.info("Done");
}

/**
 * @param {string} pkgName
 * @param {string} readmeSource
 */
function buildReadmeSource(pkgName, readmeSource) {
  return `# @lbu/${pkgName}\n[![install size ${pkgName}](https://packagephobia.com/badge?p=@lbu/${pkgName})](https://packagephobia.com/result?p=@lbu/${pkgName})${readmeSource}\n`;
}

function getReadmeSource() {
  const src = readFileSync(join(process.cwd(), "README.md"), "utf-8");

  return src.split("\n").slice(1).join("\n");
}
