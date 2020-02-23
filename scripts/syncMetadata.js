const { newLogger } = require("@lbu/insight");
const { mainFn } = require("@lbu/stdlib");
const { spawnSync } = require("child_process");
const { join } = require("path");
const { readdirSync, readFileSync, writeFileSync } = require("fs");

const buildReadmeSource = (pkgName, readmeSource) =>
  `# @lbu/${pkgName}\n${readmeSource}`;

const getReadmeSource = () => {
  const src = readFileSync(join(process.cwd(), "README.md"), "utf-8");

  return src
    .split("\n")
    .slice(1)
    .join("\n");
};

const exec = logger => {
  // Script to copy the root README.md to all packages

  if (join(process.cwd(), "scripts") !== __dirname) {
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
};

mainFn(module, require, newLogger(), exec);

module.exports = {
  nodemonArgs: "-w ./README.md",
};
