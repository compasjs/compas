import { existsSync, readdirSync, rmdirSync, writeFileSync } from "fs";
import { join } from "path";
import { newLogger } from "@lbu/insight";
import { dirnameForModule, exec, mainFn, pathJoin, spawn } from "@lbu/stdlib";

mainFn(import.meta, newLogger(), main);

export const nodemonArgs = "-e .d.ts";

/**
 * @param logger
 */
async function main(logger) {
  // Script to convert all index.d.ts files in to a single api.md file

  if (join(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

  const packagesDir = join(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);

  const promiseList = [];
  for (const pkg of packages) {
    const pkgFile = pathJoin(packagesDir, pkg, "index.d.ts");

    if (!existsSync(pkgFile)) {
      continue;
    }

    promiseList.push(
      spawn(`./node_modules/.bin/typedoc`, [
        "--mode",
        "file",
        "--includeDeclarations",
        "--excludeExternals",
        "--excludePrivate",
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
      ]),
    );
  }

  await Promise.all(promiseList);

  logger.info("Concatenating files");

  const { stdout } = await exec(
    "./node_modules/.bin/concat-md --decrease-title-levels --dir-name-as-title ./docs/generated",
  );

  writeFileSync("./docs/api.md", stdout.trim(), "utf-8");

  logger.info("Cleaning up temporary directories");

  for (const pkg of packages) {
    rmdirSync(pathJoin("./docs/generated", pkg), { recursive: true });
  }

  logger.info("Done.");

  if (process.argv?.[2] !== "--no-lint") {
    logger.info("Running linter");
    await spawn("yarn", ["lbu", "lint"]);
  }
}
