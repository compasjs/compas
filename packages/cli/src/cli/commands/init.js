import { writeFile } from "fs/promises";
import { pathJoin } from "@compas/stdlib";

/**
 *
 * @param {import("../types").CliLogger} logger
 * @param {import("../types").CliCommandExecutorState} state
 * @returns {Promise<import("../types").CliResult>}
 */
export async function cliExecutor(logger, state) {
  let didDump = false;
  if (state.flags.dumpJSConfig) {
    didDump = true;
    await writeJSConfig();
  }

  if (didDump) {
    logger.info("Init successful.", {
      type: "command:init:result",
      init: { dumpJSConfig: state.flags.dumpJSConfig },
    });

    return {
      value: {
        exitCode: 0,
      },
    };
  }

  logger.info("Init did not write any files.", {
    type: "command:init:result",
    init: {},
  });

  return {
    value: {
      exitCode: 1,
    },
  };
}

async function writeJSConfig() {
  await writeFile(
    pathJoin(process.cwd(), "jsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "esnext",
          lib: ["esnext"],
          noEmit: true,
          module: "esnext",
          checkJs: true,
          maxNodeModuleJsDepth: 0,
          baseUrl: "./",
          moduleResolution: "node",
          strict: true,
        },
        typeAcquisition: {
          enable: true,
        },
        include: ["**/*.js"],
        exclude: ["**/*.test.js"],
      },
      null,
      2,
    ),
  );
}
