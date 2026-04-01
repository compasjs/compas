import { syncCliReference } from "../src/cli-reference.js";
import { mainFn, spawn } from "@compas/stdlib";

mainFn(import.meta, main);

/**
 * Copy various things around README's and docs
 *
 * @param {Logger} logger
 */
async function main(logger) {
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
