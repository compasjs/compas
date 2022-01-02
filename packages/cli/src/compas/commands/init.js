import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { pathJoin } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "init",
  shortDescription: "Init various files in the current project.",
  flags: [
    {
      name: "dumpJSConfig",
      rawName: "--jsconfig",
      description:
        "Creates or overwrites the root jsconfig.json file, to use with the Typescript Language Server.",
    },
    {
      name: "dumpLintConfig",
      rawName: "--lint-config",
      description:
        "Creates or overwrites .eslintrc.cjs, .eslintignore and .prettierignore files, and overwrites the 'prettier' key in the package.json.",
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  let didDump = false;
  if (state.flags.dumpJSConfig) {
    didDump = true;
    await writeJSConfig();
  }

  if (state.flags.dumpLintConfig) {
    didDump = true;
    await writeLintConfig();
  }

  if (didDump) {
    logger.info("Init successful.");

    return {
      exitStatus: "passed",
    };
  }

  logger.info("Init did not write any files.");

  return {
    exitStatus: "failed",
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

async function writeLintConfig() {
  if (existsSync("./package.json")) {
    const pkgJson = JSON.parse(await readFile("./package.json", "utf-8"));
    pkgJson.prettier = "@compas/lint-config/prettierrc";

    await writeFile("./package.json", `${JSON.stringify(pkgJson, null, 2)}\n`);
  }

  await writeFile(
    "./.eslintrc.cjs",
    `const config = require("@compas/lint-config");

config.root = true;

module.exports = config;
`,
  );

  await writeFile(
    "./.prettierignore",
    `coverage
node_modules
.nyc_output
.clinic
`,
  );

  await writeFile(
    "./.eslintignore",
    `coverage
node_modules
.nyc_output
.clinic
`,
  );
}
