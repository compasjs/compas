import { dirnameForModule, mainFn, pathJoin, spawn } from "@compas/stdlib";
import { syncCliReference } from "../src/cli-reference.js";

mainFn(import.meta, main);

/**
 * Copy various things around README's and docs
 *
 * @param {Logger} logger
 */
async function main(logger) {
  if (pathJoin(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

  await syncCliReference(logger);

  logger.info("Regenerating");
  await spawn("compas", ["generate"], {
    env: {
      ...process.env,
      CI: "false",
    },
  });

  logger.info("Done");
}
