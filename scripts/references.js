/* eslint-disable @typescript-eslint/no-var-requires */

const { spawnSync } = require("child_process");
const { join } = require("path");
const { readdirSync, writeFileSync } = require("fs");

// Script to set Typescript references from package.json for all packages

if (join(process.cwd(), "scripts") !== __dirname) {
  throw new Error("Wrong directory. Run in root.");
}

const packagesDir = join(process.cwd(), "packages");
const packages = readdirSync(packagesDir);

console.log("Updating", packages.length, "tsconfig.json's");

for (const pkg of packages) {
  const pkgDir = join(packagesDir, pkg);

  const { dependencies, devDependencies } = require(join(pkgDir, "package.json"));

  // make sure to sort them for easier to review changes
  const allKeys = Object.keys({ ...devDependencies, ...dependencies })
                        .filter(it => it.startsWith("@lightbase/"))
                        .map(it => it.split("/")[1])
                        .sort();

  if (allKeys.includes(pkg)) {
    throw new Error(`${pkg} has a dependency on it self`);
  }

  const tsconfig = require(join(pkgDir, "tsconfig.json"));
  tsconfig.references = allKeys.map(it => ({ path: `../${it}` }));

  writeFileSync(join(pkgDir, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));
}

console.log("Updating root tsconfig.json");

const rootConfig = require(join(process.cwd(), "tsconfig.json"));
// Also sorting for easier change reviews
rootConfig.references = packages.sort().map(it => ({ path: `packages/${it}` }));
writeFileSync(join(process.cwd(), "tsconfig.json"), JSON.stringify(rootConfig, null, 2));

console.log("Done.\nRunning linter");
spawnSync("yarn", [ "lint" ], { stdio: "inherit" });
