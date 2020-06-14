import { newLogger } from "@lbu/insight";
import { dirnameForModule, exec, mainFn, pathJoin, spawn } from "@lbu/stdlib";
import { existsSync, readdirSync, rmdirSync, writeFileSync } from "fs";
import { join } from "path";

mainFn(import.meta, newLogger(), main);

export const nodemonArgs = "-w ./README.md";

/**
 * @param logger
 */
async function main(logger) {
  // Script to copy the root README.md to all packages

  if (join(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

  const packagesDir = join(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);

  for (const pkg of packages) {
    const pkgFile = pathJoin(packagesDir, pkg, "index.d.ts");

    if (!existsSync(pkgFile)) {
      continue;
    }

    await spawn(`./node_modules/.bin/typedoc`, [
      "--mode",
      "file",
      "--includeDeclarations",
      "--excludeExternals",
      "--includeVersion",
      "--disableSources",
      "--categorizeByGroup",
      "false",
      "--name",
      `@lbu/${pkg}`,
      "--readme",
      "none",
      "--listInvalidSymbolLinks",
      "--out",
      `docs/generated/${pkg}`,
      pkgFile,
    ]);
  }

  logger.info("Concatenating files");

  const { stdout } = await exec(
    "./node_modules/.bin/concat-md --decrease-title-levels --dir-name-as-title ./docs/generated",
  );

  writeFileSync("./docs/api.md", stdout.trim(), "utf-8");

  logger.info("Cleaning up temporary directories");

  for (const pkg of packages) {
    rmdirSync(pathJoin("./docs/generated", pkg), { recursive: true });
  }

  logger.info("Done.\nRunning linter");
  await spawn("yarn", ["lbu", "lint"]);
}
