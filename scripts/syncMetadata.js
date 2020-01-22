/* eslint-disable @typescript-eslint/no-var-requires */

const { spawnSync } = require("child_process");
const { join } = require("path");
const { readdirSync, readFileSync, writeFileSync } = require("fs");

// Script to copy the root README.md to all packages

if (join(process.cwd(), "scripts") !== __dirname) {
  throw new Error("Wrong directory. Run in root.");
}

const packagesDir = join(process.cwd(), "packages");
const packages = readdirSync(packagesDir);
const readmeSource = getReadmeSource();

console.log("Updating", packages.length, "README.md's");

for (const pkg of packages) {
  const pkgDir = join(packagesDir, pkg);

  writeFileSync(join(pkgDir, "README.md"), buildReadmeSource(pkg));
}

console.log("Done.\nRunning linter");
spawnSync("yarn", ["lint"], { stdio: "inherit" });

function getReadmeSource() {
  const src = readFileSync(join(process.cwd(), "README.md"), "utf-8");

  return src
    .split("\n")
    .slice(1)
    .join("\n");
}

function buildReadmeSource(pkgName) {
  return `# @lbu/${pkgName}\n${readmeSource}`;
}
