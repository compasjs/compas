import { newLogger } from "@lbu/insight";
import { isNil, mainFn, spawn } from "@lbu/stdlib";
import { readdirSync } from "fs";
import { join } from "path";

mainFn(import.meta, newLogger(), main);

export const disallowNodemon = true;

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
    await spawn("yarn", ["link", `@lbu/${pkg}`], {
      cwd: join(process.cwd(), workingDir),
    });
  }
}
