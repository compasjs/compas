import { readdirSync } from "fs";
import { join } from "path";
import { isNil, mainFn, spawn } from "@compas/stdlib";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  disable: true,
};

/**
 * @param logger
 */
async function main(logger) {
  const [workingDir] = process.argv.slice(2);

  if (isNil(workingDir)) {
    logger.error("Please specify the working directory to link to");
    process.exit(1);
  }

  const packagesDir = join(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);

  for (const pkg of packages) {
    await spawn("yarn", ["link", `@compas/${pkg}`], {
      cwd: join(process.cwd(), workingDir),
    });
  }
}
