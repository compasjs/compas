import { readdirSync } from "fs";
import { isNil, mainFn, pathJoin, spawn } from "@compas/stdlib";

mainFn(import.meta, main);

/**
 * @param logger
 */
async function main(logger) {
  const [workingDir] = process.argv.slice(2);

  if (isNil(workingDir)) {
    logger.error("Please specify the working directory to link to");
    process.exit(1);
  }

  const packagesDir = pathJoin(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);

  for (const pkg of packages) {
    await spawn("yarn", ["link", `@compas/${pkg}`], {
      cwd: pathJoin(process.cwd(), workingDir),
    });
  }
}
