import { readFile } from "node:fs/promises";
import { dirnameForModule, pathJoin } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "version",
  shortDescription: "Print the installed Compas version and exit",
  flags: [],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  const cliPackageJson = pathJoin(
    dirnameForModule(import.meta),
    "../../../package.json",
  );
  const contents = JSON.parse(await readFile(cliPackageJson, "utf-8"));
  if (state.flags.timings) {
    logger.info(contents.version);
  } else {
    // eslint-disable-next-line no-console
    console.log(contents.version);
  }
  return {
    exitStatus: "passed",
  };
}
