import { mkdir, readdir, rm, symlink } from "node:fs/promises";
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
  await syncExamplesToDocs();

  logger.info("Regenerating");
  await spawn("compas", ["generate"], {
    env: {
      ...process.env,
      CI: "false",
    },
  });

  logger.info("Done");
}

/**
 * Recreate soft links for all examples in to the docs
 *
 * @returns {Promise<void>}
 */
async function syncExamplesToDocs() {
  await rm(`./docs/examples`, { force: true, recursive: true });
  await mkdir(`./docs/examples`, { recursive: true });

  const examples = await readdir("./examples");

  for (const example of examples) {
    await symlink(
      `../../examples/${example}/README.md`,
      `./docs/examples/${example}.md`,
    );
  }
}
