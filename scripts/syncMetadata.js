import { newLogger } from "@lbu/insight";
import { dirnameForModule, mainFn } from "@lbu/stdlib";
import { spawnSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

mainFn(import.meta, newLogger(), main);

export const nodemonArgs = "-w ./README.md";

function main(logger) {
  // Script to copy the root README.md to all packages

  if (join(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

  const packagesDir = join(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);
  const readmeSource = getReadmeSource();

  logger.info("Updating", packages.length, "README.md's");

  for (const pkg of packages) {
    const pkgDir = join(packagesDir, pkg);

    writeFileSync(
      join(pkgDir, "README.md"),
      buildReadmeSource(pkg, readmeSource),
    );
  }

  logger.info("Done.\nRunning linter");
  spawnSync("yarn", ["lbu", "lint"], { stdio: "inherit" });
}

function buildReadmeSource(pkgName, readmeSource) {
  return `# @lbu/${pkgName}\n${readmeSource}`;
}

function getReadmeSource() {
  const src = readFileSync(join(process.cwd(), "README.md"), "utf-8");

  return src.split("\n").slice(1).join("\n");
}
