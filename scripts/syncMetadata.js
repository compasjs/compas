import { newLogger } from "@lbu/insight";
import { dirnameForModule, mainFn } from "@lbu/stdlib";
import { spawnSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const buildReadmeSource = (pkgName, readmeSource) =>
  `# @lbu/${pkgName}\n${readmeSource}`;

const getReadmeSource = () => {
  const src = readFileSync(join(process.cwd(), "README.md"), "utf-8");

  return src.split("\n").slice(1).join("\n");
};

const exec = (logger) => {
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

  writeFileSync(
    join(process.cwd(), "docs/README.md"),
    `# @lbu (Lightbase Backend Utilities)\n${readmeSource}`,
  );

  logger.info("Done.\nRunning linter");
  spawnSync("yarn", ["lbu", "lint"], { stdio: "inherit" });
};

mainFn(import.meta, newLogger(), exec);

export const nodemonArgs = "-w ./README.md";
